import * as THREE from 'three';
import { MyActivatable } from "./MyActivatable.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class MyPowerUp1 extends MyActivatable {
    constructor(position, rotation, scale, duration) {
        super(position, rotation, scale, duration)
        this.effect = "increasedSpeed"
    }

    /**
     * Function to construct the mesh of the power up 1.
     * @returns the mesh of the power up 1.
     */
    async _constructMesh() {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('./scene/circuits/powerup.glb', (gltf) => {
                console.log(gltf);
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

class MyPowerUp2 extends MyActivatable {
    constructor(position, rotation, scale, duration) {
        super(position, rotation, scale, duration)
        this.effect = "speedNoReduce" //TODO- no idea
    }

    async _constructMesh() {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('./scene/circuits/powerup_2.glb', (gltf) => {
                console.log(gltf);
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


export { MyPowerUp1, MyPowerUp2 };