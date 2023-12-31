import * as THREE from 'three';
import { MyActivatable } from "./MyActivatable.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class MyPowerUp1 extends MyActivatable {
    constructor(position, rotation, scale, duration) {
        super(position, rotation, scale, duration)
        this.effect = "increasedSpeed"
    }

    /*_constructMesh(callback) {
        const loader = new GLTFLoader();
        loader.load('./scene/circuits/powerup.glb', (gltf) => {
            console.log(gltf);
            const loadedMesh = gltf.scene;
            callback(loadedMesh); // Call the callback with the loaded mesh
        },
        undefined,
        function (error) {
            console.error(error);
        });
    }*/

    _constructMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const cube = new THREE.Mesh(geometry, material);
        return cube
    }

}

export { MyPowerUp1 };