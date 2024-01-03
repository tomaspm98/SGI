import * as THREE from 'three';
import { MyActivatable } from "./MyActivatable.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class MyObstacle1 extends MyActivatable {
    constructor(position, rotation, scale, duration) {
        super(position, rotation, scale, duration)
        this.effect = "invertedControls"
    }

    /**
     * Function to construct the mesh of the obstacle 1.
     * @returns The mesh of the obstacle 1.
     */
    async _constructMesh() {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('./scene/circuits/tire.glb', (gltf) => {
                console.log(gltf);
                const loadedMesh = gltf.scene;
                loadedMesh.name = "1"
                loadedMesh.scale.set(0.1, 0.1, 0.1)
                loadedMesh.position.y=0.4
                loadedMesh.rotation.set(0, 0, 1.5708)
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

    /**
     * Function to construct the mesh of the obstacle 2.
     * @returns The mesh of the obstacle 2.
     */
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
        cube.name="2"
        console.log(cube)
        cube.position.y=1.5
        return cube
    }
}

export { MyObstacle1, MyObstacle2 };