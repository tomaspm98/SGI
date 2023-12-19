import * as THREE from 'three';
import { GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import { MyFileReader } from '../parser/MyFileReader.js';
import { MySceneGraph } from "../MySceneGraph.js";
import * as Utils from '../utils.js';

class MyVehicle {
    constructor(app) {
        this.textures = []
        this.materials = []
        this.app=app
        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        this.reader.open("scenes/SGI_TP2_XML_T02_G07_v02/scene.xml")
        this.carMesh = null;
        this.speed = 0;
        this.rotationspeed = 0;
        this.speedchange=0;
        this.rotationchange=0;
        this.maxSpeed=0.5;
        this.minSpeed=-0.5;
        this.autoDecrease = 0.001;
        this.isLoaded=false;
    }

    renderMaterials(data) {
        for (let key in data.materials) {
            const material = data.materials[key]

            console.log(material)

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

    onSceneLoaded(data) {
        //console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);

    }

    async onAfterSceneLoadedAndBeforeRender(data) {
        this.renderTextures(data)
        this.renderMaterials(data)

        console.log(data['materials'])


        this.sceneGraph = new MySceneGraph(data.nodes, data.rootId, this.materials, data['materials'])

        //Add the scene graph to the scene
        await this.sceneGraph.constructSceneGraph()
        this.app.scene.add(this.sceneGraph.graph)

    }


    controlCar() {
        document.addEventListener('keydown', (event) => {
            const keyCode = event.keyCode;
            if (keyCode == 87){
                this.speedchange = 0.001;
            }

            if (keyCode == 83){
                this.speedchange = -0.001;
            }

            if (keyCode == 68){
                this.rotationchange = -0.05;
                this.carMesh.children[4].rotation.y= -Math.PI/6;
                this.carMesh.children[5].rotation.y= -Math.PI/6;
            }

            if (keyCode == 65){
                this.rotationchange = 0.05;
                this.carMesh.children[4].rotation.y=Math.PI/6;
                this.carMesh.children[5].rotation.y=Math.PI/6;
            }

        });

        document.addEventListener('keyup', (event) => {
            if (event.keyCode == 87 && this.speed>0){
                this.speedchange = -this.autoDecrease;
                this.reducing = true;
                /*if (this.speed < 0){
                    this.speedchange = 0;
                    this.speed=0
                }*/
            } else if (event.keyCode == 83 && this.speed<0){
                this.speedchange = this.autoDecrease;
                this.increasing = true;
                /*if (this.speed == 0){
                    this.speedchange = 0;
                }*/
            }
            this.rotationchange = 0;
            
            if (event.keyCode == 68){
                this.carMesh.children[4].rotation.y=0;
                this.carMesh.children[5].rotation.y=0;
            }
            if (event.keyCode == 65){
                this.carMesh.children[4].rotation.y=0;
                this.carMesh.children[5].rotation.y=0;
            }
        });
    }

    

    update() {
        if(this.isLoaded){
            this.controlCar();
            if (this.speed < this.maxSpeed && this.speed> this.minSpeed) {
                this.speed += this.speedchange;
                if (this.reducing && this.speed<0){
                    this.speed=0
                    this.speedchange=0
                    this.reducing=false
                }

                if (this.increasing && this.speed>0){
                    this.speed=0
                    this.speedchange=0
                    this.increasing=false
                }
                console.log(this.speed)
            }
            else if (this.speed>=this.maxSpeed && this.speedchange<0){
                this.speed += this.speedchange;
            }
            else if (this.speed<=this.minSpeed && this.speedchange>0){
                this.speed += this.speedchange;
            }

            this.rotationspeed += this.rotationchange;
    
            this.carMesh.position.z += this.speed * Math.cos(this.carMesh.rotation.y);
            this.carMesh.position.x += this.speed * Math.sin(this.carMesh.rotation.y);

            //console.log(this.speed)
    
            this.carMesh.rotation.y += this.rotationspeed;
    
            this.rotationspeed = 0;

            this.carMesh.children[2].rotation.x += 2*this.speed;
            this.carMesh.children[3].rotation.x += 2*this.speed;
            this.carMesh.children[4].rotation.x += 2*this.speed;
            this.carMesh.children[5].rotation.x += 2*this.speed;

        }
    }
}

export { MyVehicle };