import * as THREE from 'three';
import { MyVehicleReader } from './MyVehicleReader.js';
import { MyVehicleGraph } from './MyVehicleGraph.js';


class MyVehicleRenderer {

    constructor() {
    }

    render(yasfPath) {
        // Reset the variables
        this.textures = []
        this.materials = []
        this.videoTextureCount = 0


        // Read the file
        const reader = new MyVehicleReader(this, this._renderVehicle)
        reader.open(yasfPath)


        // Return the vehicle mesh
        return [this.vehicleGraph.graph, this.specs, this.vehicleGraph.importantNodes]
    }


    _renderVehicle(data) {
        this.renderTextures(data)
        this.renderMaterials(data)
        this.specs = data.specs
        this.vehicleGraph = new MyVehicleGraph(data.nodes, data.rootId, this.materials, data['materials'])
        this.vehicleGraph.constructVehicleGraph()
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
}

export { MyVehicleRenderer }