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
        this.reader.open("scenes/SGI_TP2_XML_T02_G07_v02/scene.xml");

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

    onAfterSceneLoadedAndBeforeRender(data) {
        this.renderCameras(data)
        this.renderTextures(data)
        this.renderMaterials(data)
        this.renderBackground(data)
        this.renderFog(data)
        this.renderSkybox(data)

        this.sceneGraph = new MySceneGraph(data.nodes, data.rootId, this.materials, this.textures)

        //Add the scene graph to the scene
        this.sceneGraph.constructSceneGraph()
        this.app.scene.add(this.sceneGraph.graph)

        //Save the references to the lights that will be used in the Guiinterface
        this.lights = this.sceneGraph.getLightMap();
    }

    /**
     * Renders a skybox using the provided data.
     * @param {Object} data - Skybox data containing textures and settings.
     */
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


    /**
     * Function to render textures.
     * @param {Object} data - The data object containing textures.
     */
    renderTextures(data) {
        for (let key in data.textures) {
            let texture = data.textures[key]
            let newTexture;

            if (texture.isVideo) {
                const videoId = `video${this.videoTextureCount++}`

                // Add a video tag to the HTML document
                this.addVideoTagToHTML(texture.filepath, videoId);

                // Get the video element and create a new THREE.VideoTexture
                const video = document.getElementById(videoId)
                newTexture = new THREE.VideoTexture(video)
                newTexture.needsUpdate = true
            } else {
                newTexture = new THREE.TextureLoader().load(texture.filepath)
            }

            newTexture.generateMipmaps = texture.mipmaps

            // If mipmaps are not generated, load them manually
            if (texture.mipmaps === false) {
                for (let i = 0; i <= 7; i++) {
                    if (texture[`mipmap${i}`] != undefined) {
                        Utils.loadMipmap(newTexture, i, texture[`mipmap${i}`])
                    }
                }
            } else {
                // If mipmaps are generated, set the magFilter and minFilter properties
                newTexture.magFilter = Utils.convertFilterThree(texture.magFilter)
                newTexture.minFilter = Utils.convertFilterThree(texture.minFilter)
            }

            newTexture.anisotropy = texture.anisotropy
            this.textures[key] = newTexture
        }
    }

    /**
     * Function to render materials.
     * @param {Object} data - The data object containing materials.
     */
    renderMaterials(data) {
        for (let key in data.materials) {
            const material = data.materials[key]

            const newMaterial = new THREE.MeshPhongMaterial({
                color: material.color,
                specular: material.specular,
                emissive: material.emissive,
                shininess: material.shininess,
                wireframe: material.wireframe,
                flatShading: material.shading === "flat",
                side: material.twosided ? THREE.DoubleSide : THREE.FrontSide,
                map: this.textures[material.textureref] !== undefined ? this.textures[material.textureref] : null,
                bumpMap: this.textures[material.bumpref] !== undefined ? this.textures[material.bumpref] : null,
                bumpScale: material.bumpscale,
                specularMap: this.textures[material.specularref] !== undefined ? this.textures[material.specularref] : null,
            })

            if (material.texlength_s !== undefined && material.texlength_t !== undefined && material.texlength_s !== 1 && material.texlength_t !== 1 && this.textures[material.textureref] !== undefined) {
                this.textures[material.textureref].repeat.set(material.texlength_s, material.texlength_t)
                this.textures[material.textureref].wrapS = THREE.MirroredRepeatWrapping
                this.textures[material.textureref].wrapT = THREE.MirroredRepeatWrapping
            }

            newMaterial.name = material.id
            this.materials[key] = newMaterial
        }
    }

    renderBackground(data) {               
        if (data.options.type === 'globals') {
            const ambientLight = new THREE.AmbientLight(data.options.ambient)
            this.app.scene.add(ambientLight)
            this.app.scene.background = data.options.background
        }
    }

    /**
     * Function to render the fog.
     * @param {Object} data - The data object containing fog options.
     */
    renderFog(data) {
        if (data.fog.type === 'fog') {
            this.app.scene.fog = new THREE.Fog(data.fog.color, data.fog.near, data.fog.far)
        }
    }

    /**
     * Function to render the cameras.
     * @param {Object} data - The data object containing cameras.
     */
    renderCameras(data) {
        for (let key in data.cameras) {
            let camera = data.cameras[key];
            let threeCamera, target;
            if (camera.type === 'orthogonal') {
                threeCamera = new THREE.OrthographicCamera(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far);
            } else if (camera.type === 'perspective') {
                threeCamera = new THREE.PerspectiveCamera(camera.angle, 1, camera.near, camera.far);
            }
            if (threeCamera) {
                threeCamera.position.set(...camera.location);
                target = new THREE.Vector3(...camera.target);
                threeCamera.lookAt(target);
                this.cameras_map.set(camera.id, { camera: threeCamera, target: target });
            }
        }
        this.activeCamera = data.activeCameraId;
    }
    

    /**
     * Function to update the scene. Currently empty, but can be filled with logic to update the scene every frame.
     */
    update() {

    }

    /**
     * Function to add a video tag to the HTML document.
     * @param {string} videoPath - The path to the video file.
     * @param {string} videoId - The id to give to the video element.
     */
    addVideoTagToHTML(videoPath, videoId) {
        // Create a video element
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

        // Append video to the document body
        document.body.appendChild(video);
    }


}

export {MyContents};