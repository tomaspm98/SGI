import * as THREE from 'three';
import { MyActivatable } from "./MyActivatable.js";
import { MyShader } from './MyShader.js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class MyObstacle1 extends MyActivatable {
    constructor(position, rotation, scale, duration) {
        super(position, rotation, scale, duration)
        this.effect = "invertedControls"
    }

    async _constructMesh() {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('./scene/circuits/tire.glb', (gltf) => {
                const loadedMesh = gltf.scene;
                resolve(loadedMesh); // Resolve the promise with the loaded mesh
            },
            undefined,
            function (error) {
                console.error(error);
                reject(error); // Reject the promise if there is an error
            });
        });
    }
}

class MyObstacle2 extends MyActivatable {
    constructor(position, rotation, scale, duration) {
        super(position, rotation, scale, duration)
        this.effect = "reducedSpeed"
    }

    async _constructMesh() {
        const geometry = new THREE.CylinderGeometry(1, 1, 4, 32);
        const textureMetal = new THREE.TextureLoader().load('../scene/textures/metalTex2.jpg');
        const material = new THREE.MeshPhongMaterial({
            map: textureMetal,
            shininess: 20,
            specular: 0x7A7F80,
            color: 0x7A7F80, 
            side: THREE.DoubleSide
        });      
        //this._constructShader() 
        const cube = new THREE.Mesh(geometry, material);
        //cube.material= this.shaderPulsate.material
        return cube
    }


    /*_constructShader(){
        this.shaderPulsate = new MyShader(this.app, 'Pulsating', "Load a texture and pulsate it", "circuit/shaders/pulsate.vert", "circuit/shaders/pulsate.frag", {
            normScale: { type: 'f', value: 0.1 },
            displacement: { type: 'f', value: 0.0 },
            normalizationFactor: { type: 'f', value: 1 },
            blendScale: { type: 'f', value: 0.5 },
            timeFactor: { type: 'f', value: 0.0 },
        });

    }*/
}

export { MyObstacle1, MyObstacle2 };