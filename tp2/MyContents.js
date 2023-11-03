import * as THREE from 'three';
import {MyAxis} from './MyAxis.js';
import {MyFileReader} from './parser/MyFileReader.js';
import {MyNurbsBuilder} from './MyNurbsBuilder.js';
import {MySceneGraph} from "./MySceneGraph.js";
import * as Utils from "./utils.js";
import {TextureLoader} from "three";

/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
     constructs the object
     @param {MyApp} app The application object
     */
    constructor(app) {
        this.app = app
        this.axis = null

        this.textures = []
        this.materials = []
        this.cameras_map = new Map()

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        this.reader.open("scenes/demo/MyScene.xml");

    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        //console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
        this.app.updateGui()
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        this.renderCameras(data)
        this.renderTextures(data)//renders the textures
        this.renderMaterials(data)//renders materials
        this.renderBackground(data)
        this.renderFog(data)

        this.sceneGraph = new MySceneGraph(data.nodes, data.rootId, this.materials, this.textures)
        this.sceneGraph.constructSceneGraph()
        this.app.scene.add(this.sceneGraph.graph)
        console.log(data.nodes["scene"])
        console.log(this.sceneGraph.graph)
    }


    renderTextures(data) {
        for (let key in data.textures) {
            let texture = data.textures[key]
            let newTexture;
            if (texture.isVideo) {
                newTexture = new THREE.VideoTexture(texture.filepath)
            } else {
                newTexture = new TextureLoader().load(texture.filepath)
            }
            newTexture.magFilter = Utils.convertFilterThree(texture.magFilter)
            newTexture.minFilter = Utils.convertFilterThree(texture.minFilter)
            newTexture.generateMipmaps = texture.mipmaps
            newTexture.anisotropy = texture.anisotropy
            this.textures[key] = newTexture
        }
    }

    renderMaterials(data) {
        for (let key in data.materials) {
            const material = data.materials[key]
            const newMaterial = new THREE.MeshPhongMaterial({
                color: Utils.rgbToHex(material.color),
                specular: Utils.rgbToHex(material.specular),
                emissive: Utils.rgbToHex(material.emissive),
                shininess: material.shininess,
                wireframe: material.wireframe,
                flatShading: material.shading === "flat",
                side: material.twosided ? THREE.DoubleSide : THREE.FrontSide,
                map: material.textureref !== undefined ? this.textures[material.textureref] : undefined,
            })
            this.materials[key] = newMaterial
        }
    }

    renderBackground(data) {
        if (data.options.type === 'globals') {
            const ambientLight = new THREE.AmbientLight(Utils.rgbToHex(data.options.ambient))
            this.app.scene.add(ambientLight)
            this.app.scene.background = new THREE.Color(Utils.rgbToHex(data.options.background))
        }

    }

    renderFog(data) {
        if (data.fog.type === 'fog') {
            this.app.scene.fog = new THREE.Fog(Utils.rgbToHex(data.fog.color), data.fog.near, data.fog.far)
        }
    }

    renderCameras(data) {
        for (let key in data.cameras) {
            let camera = data.cameras[key]
            if (camera.type === 'orthogonal') {
                this.cameras_map.set(camera.id, new THREE.OrthographicCamera(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far))
                this.cameras_map.get(camera.id).position.set(...camera.location)
                this.cameras_map.get(camera.id).lookAt(...camera.target)

            } else if (camera.type === 'perspective') {
                this.cameras_map.set(camera.id, new THREE.PerspectiveCamera(camera.angle, 1, camera.near, camera.far))
                this.cameras_map.get(camera.id).position.set(...camera.location)
                this.cameras_map.get(camera.id).lookAt(...camera.target)
            }
        }
        this.activeCamera = data.activeCameraId
    }


    update() {

    }

    printData(data) {
        this.output(data.options)
        console.log("textures:")
        console.log(data.textures)
        for (let key in data.textures) {
            let texture = data.textures[key]
            this.output(texture, 1)
        }

        console.log("materials:")
        for (let key in data.materials) {
            let material = data.materials[key]
            this.output(material, 1)
        }
        console.log(data.materials)

        console.log(data.cameras)
        console.log(data.options)

        console.log("cameras:")
        for (let key in data.cameras) {
            let camera = data.cameras[key]
            this.output(camera, 1)
        }
        console.log("nodes:")
        console.log(data.nodes)
        for (let key in data.nodes) {
            let node = data.nodes[key]
            this.output(node, 1)
            for (let i = 0; i < node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with " + child.representations[0].length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0][0].controlpoints.length + " control points")
                    }
                } else {
                    this.output(child, 2)
                }
            }
        }
    }


}

export {MyContents};