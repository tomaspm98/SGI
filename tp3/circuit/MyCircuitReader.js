import { MyFileReader } from './parser/MyFileReader.js';
import * as THREE from 'three';
import { MySceneGraph } from './parser/MySceneGraph.js';
import { MyTrack } from './MyTrack.js';
import { MyActivatable } from './MyActivatable.js';
import { createActivatable } from './utils.js';


class MyCircuitReader {

    constructor() {
    }

    buildCircuitScene(yasfPath) {
        // Reset the variables
        this.textures = []
        this.materials = []
        this.cameras_map = new Map()
        this.videoTextureCount = 0
        this.activatables = []
        this.circuitScene = new THREE.Scene()

        // Read the file
        const reader = new MyFileReader(this, this.renderCircuit)
        reader.open(yasfPath)

        // Return the circuit scene
        return this.circuitScene
    }


    renderCircuit(data) {
        this.renderCameras(data)
        this.renderTextures(data)
        this.renderMaterials(data)
        this.renderBackground(data)
        this.renderFog(data)
        this.renderSkyBox(data)
        this.renderTrack(data)
        this.renderActivatables(data)

        this.sceneGraph = new MySceneGraph(data.nodes, data.rootId, this.materials, data['materials'])
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
            if (camera.type === 'orthogonal') {
                this.cameras_map.set(camera.id, new THREE.OrthographicCamera(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far))
            } else if (camera.type === 'perspective') {
                this.cameras_map.set(camera.id, new THREE.PerspectiveCamera(camera.angle, window, camera.near, camera.far))
            }
            this.cameras_map.get(camera.id).position.set(...camera.location)
            this.cameras_map.get(camera.id).lookAt(...camera.target)
        }
        this.activeCamera = data.activeCameraId;
    }

    /**        console.log("HELLO")

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

    async _openJSON(jsonFile) {
        const response = await fetch(jsonFile);

        if (!response.ok) {
            throw new Error("Error fetching json file");
        }

        return response.json();
    }

    async renderTrack(data) {
        const geoJSON = await this._openJSON(data.track['filepath'])
        const points = geoJSON["features"][0]["geometry"]["coordinates"]
        const track = new MyTrack(points, data.track['size'], data.track['segments'], data.track['width'], data.track['texture'])
        this.trackGroup = track.draw()
        this.circuitScene.add(track.draw())
    }

    renderObstacles(data) {
        for (const key in data.obstacles) {
            const obstacle = data.obstacles[key]
            console.log(obstacle.class)
            const newObstacle = MyObstacle.create(obstacle.position, obstacle.class, obstacle.rotation, obstacle.scale)
            this.obstacles.push(newObstacle)
            this.circuitScene.add(newObstacle.draw())
        }
    }

    renderActivatables(data) {
        for (const activatable of data.activatables) {
            const newActivatable = createActivatable(activatable.type, activatable.subtype, activatable.position, activatable.rotation, activatable.scale)
            this.activatables.push(newActivatable)
            this.circuitScene.add(newActivatable.mesh)
        }
    }

}

export { MyCircuitReader }