import { MyCircuitReader } from './MyCircuitReader.js';
import * as THREE from 'three';
import { MyCircuitGraph } from './MyCircuitGraph.js';
import { MyTrack } from '../MyTrack.js';
import * as Utils from './utils.js';


class MyCircuitRenderer {

    constructor() {
    }

    render(yasfPath) {
        // Reset the variables
        this.textures = []
        this.materials = []
        this.cameras = []
        this.videoTextureCount = 0
        this.activatables = []
        this.circuitScene = new THREE.Scene()
        this.track = null
        this.slots = []

        // Read the file
        const reader = new MyCircuitReader(this, this._renderCircuitFile)
        reader.open(yasfPath)
        // Return the circuit scene
        return [this.circuitScene, this.activatables, this.track, this.cameras, this.slots]
    }

    
    /**
     * Renders the circuit file.
     * @param {*} data - The data object containing the circuit file.
     */
    _renderCircuitFile(data) {
        this.renderTrack(data)
        this.renderCameras(data)
        this.renderTextures(data)
        this.renderMaterials(data)
        this.renderBackground(data)
        this.renderFog(data)
        this.renderSkyBox(data)
        this.renderActivatables(data)
        this.renderSlots(data)

        this.sceneGraph = new MyCircuitGraph(data.nodes, data.rootId, this.materials, data['materials'])
        this.sceneGraph.constructSceneGraph()
        this.circuitScene.add(this.sceneGraph.graph)
    }

    /**
     * Renders a skybox using the provided data.
     * @param {Object} data - Skybox data containing textures and settings.
     */
    renderSkyBox(data) {
        let skyBox = data.skyboxes.default
        let skyBoxGeometry = new THREE.BoxGeometry(skyBox.size[0], skyBox.size[1], skyBox.size[2])
        const textures = ["front", "back", "up", "down", "right", "left"].map(text => new THREE.TextureLoader().load(skyBox[text]))

        const material = textures.map(text => new THREE.MeshPhongMaterial({
            map: text,
            side: THREE.BackSide,
            emissive: skyBox.emissive,
            emissiveIntensity: skyBox.intensity,
            emissiveMap: text
        }))

        const skyboxMesh = new THREE.Mesh(skyBoxGeometry, material)
        skyboxMesh.position.set(...skyBox.center)
        this.circuitScene.add(skyboxMesh)
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
                const video = this.createVideoElement(texture.filepath, videoId);

                newTexture = new THREE.VideoTexture(video)
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
            newMaterial.name = material.id
            this.materials[key] = newMaterial
        }
    }

    /**
     * Function to render the background.
     * @param {*} data - The data object containing background options.
     */
    renderBackground(data) {
        if (data.options.type === 'globals') {
            const ambientLight = new THREE.AmbientLight(data.options.ambient)
            this.circuitScene.add(ambientLight)
            this.circuitScene.background = data.options.background
        }
    }

    /**
     * Function to render the fog.
     * @param {Object} data - The data object containing fog options.
     */
    renderFog(data) {
        if (data.fog.type === 'fog' && data.fog.near > 0 && data.fog.far > 0) {
            this.circuitScene.fog = new THREE.Fog(data.fog.color, data.fog.near, data.fog.far)
        }
    }

    /**
     * Function to render the cameras.
     * @param {Object} data - The data object containing cameras.
     */
    renderCameras(data) {
        for (let key in data.cameras) {
            let camera = data.cameras[key];
            let cameraObject;
            if (camera.type === 'orthogonal') {
                cameraObject = new THREE.OrthographicCamera(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far)
            } else if (camera.type === 'perspective') {
                cameraObject = new THREE.PerspectiveCamera(camera.angle, window, camera.near, camera.far)
            }
            cameraObject.position.set(...camera.location)
            cameraObject.positionTarget = camera.target

            this.cameras[key] = cameraObject
        }
        this.activeCamera = data.activeCameraId;
    }

    /**
     * Function to add a video tag to the HTML document.
     * @param {string} videoPath - The path to the video file.
     * @param {string} videoId - The id to give to the video element.
     */
    createVideoElement(videoPath, videoId) {
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

        return video;
    }

    /**
     *  Function to open a JSON file.
     * @param {*} file - The file to open.
     * @returns The JSON object.
     */
    _openJSON(file) {
        var request = new XMLHttpRequest();
        request.open('GET', file, false);
        request.send(null);

        if (request.status === 200) {
            return JSON.parse(request.responseText);
        } else {
            throw new Error('Failed to load file: ' + file);
        }
    }

    /**
     * Function to render the track.
     * @param {*} data - The data object containing the track.
     */
    renderTrack(data) {
        const geoJSON = this._openJSON(data.track['filepath'])
        const points = geoJSON["features"][0]["geometry"]["coordinates"]
        this.track = new MyTrack(points, data.track['size'], data.track['segments'], data.track['width'], data.track['texture'], data.track['checkpoints'], data.track['checkpointModel'])
        this.circuitScene.add(this.track.group)
    }

    /**
     * Function to render activatables.
     * @param {*} data - The data object containing activatables. 
     */
    async renderActivatables(data) {
        for (const activatable of data.activatables) {
            const newActivatable = Utils.createActivatable(activatable.type, activatable.subtype, activatable.position, activatable.duration, activatable.rotation, activatable.scale)
            this.activatables.push(newActivatable)
            await newActivatable.meshPromise
            this.circuitScene.add(newActivatable.mesh)
        }
    }

    /**
     * Function to render slots.
     * @param {*} data - The data object containing slots.
     */
    renderSlots(data) {
        for (const slot of data.slots) {
            this.slots.push({ object: slot.object, position: slot.position, rotation: slot.rotation })
        }
    }

}

export { MyCircuitRenderer }