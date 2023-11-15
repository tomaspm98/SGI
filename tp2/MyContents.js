import * as THREE from 'three';
import {MyAxis} from './MyAxis.js';
import {MyFileReader} from './parser/MyFileReader.js';
import {MySceneGraph} from "./MySceneGraph.js";
import * as Utils from "./utils.js";

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
        this.videoTextureCount = 0

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        this.reader.open("scenes/spacescene/scene.xml");

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

    }

    output(obj, indent = 0) {
        //console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        this.renderCameras(data)
        this.renderTextures(data)//renders the textures
        this.renderMaterials(data)//renders materials
        this.renderBackground(data)
        this.renderFog(data)
        this.renderSkybox(data)

        this.sceneGraph = new MySceneGraph(data.nodes, data.rootId, this.materials, this.textures)

        console.log("Raw Data: ")
        console.log(data.nodes[data.rootId])
        console.log("--------------------------------------------------------------------------")

        this.sceneGraph.constructSceneGraph()
        this.app.scene.add(this.sceneGraph.graph)

        console.log("Scene Graph: ")
        console.log(this.sceneGraph.graph)
        console.log("--------------------------------------------------------------------------")

        this.lights = this.sceneGraph.getLightsMap();
    }

    renderSkybox(data) {
        let skybox = data.skyboxes.default
        let skyboxGeometry = new THREE.BoxGeometry(skybox.size[0], skybox.size[1], skybox.size[2])
        const textures = ["front", "back", "up", "down", "right", "left"].map(text => new THREE.TextureLoader().load(skybox[text]))

        const material = textures.map(text => new THREE.MeshPhongMaterial({
            map: text,
            side: THREE.BackSide,
            emissive: skybox.emissive,
            emissiveIntensity: skybox.intensity,
            emissiveMap: text
        }))

        const skyboxMesh = new THREE.Mesh(skyboxGeometry, material)
        skyboxMesh.position.set(...skybox.center)
        this.app.scene.add(skyboxMesh)
    }


    renderTextures(data) {
        for (let key in data.textures) {
            let texture = data.textures[key]
            let newTexture;
            if (texture.isVideo) {
                const videoId = `video${this.videoTextureCount++}`
                this.addVideoTagToHTML(texture.filepath, videoId);
                const video = document.getElementById(videoId)
                newTexture = new THREE.VideoTexture(video)
                newTexture.needsUpdate = true
            } else {
                newTexture = new THREE.TextureLoader().load(texture.filepath)
            }
            newTexture.generateMipmaps = texture.mipmaps
            if (texture.mipmaps === false) {
                if (texture.mipmap0 != undefined) {
                    Utils.loadMipmap(newTexture, 0, texture.mipmap0)
                }
                if (texture.mipmap1 != undefined) {
                    Utils.loadMipmap(newTexture, 1, texture.mipmap1)
                }
                if (texture.mipmap2 != undefined) {
                    Utils.loadMipmap(newTexture, 2, texture.mipmap2)
                }
                if (texture.mipmap3 != undefined) {
                    Utils.loadMipmap(newTexture, 3, texture.mipmap3)
                }
                if (texture.mipmap4 != undefined) {
                    Utils.loadMipmap(newTexture, 4, texture.mipmap4)
                }
                if (texture.mipmap5 != undefined) {
                    Utils.loadMipmap(newTexture, 5, texture.mipmap5)
                }
                if (texture.mipmap6 != undefined) {
                    Utils.loadMipmap(newTexture, 6, texture.mipmap6)
                }
                if (texture.mipmap7 != undefined) {
                    Utils.loadMipmap(newTexture, 7, texture.mipmap7)
                }
            } else {
                newTexture.magFilter = Utils.convertFilterThree(texture.magFilter)
                newTexture.minFilter = Utils.convertFilterThree(texture.minFilter)
            }
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
                map: this.textures[material.textureref] !== undefined ? this.textures[material.textureref] : null,
                bumpMap: this.textures[material.bumpref] !== undefined ? this.textures[material.bumpref] : null,
                bumpScale: material.bumpscale,
                specularMap: this.textures[material.specularref] !== undefined ? this.textures[material.specularref] : null,
            })
            if (material.texlength_s !== undefined && material.texlength_t !== undefined && this.textures[material.textureref] !== undefined)
                this.textures[material.textureref].repeat.set(material.texlength_s, material.texlength_t)
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

    addVideoTagToHTML(videoPath, videoId) {
        // Create video element
        const video = document.createElement('video');
        video.id = videoId;
        video.playsInline = true;
        video.webkitPlaysInline = true;
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        video.width = 640;
        video.height = 360;
        video.preload = 'auto';
        video.src = videoPath;

        // Append video to the document body or a specific container
        document.body.appendChild(video); // or use a specific container like document.getElementById('yourContainerId').appendChild(video);
    }


}

export {MyContents};