import * as THREE from 'three';
import { MyActivatable } from "./MyActivatable.js";

class MyPowerUp1 extends MyActivatable {
    constructor(position, rotation, scale, duration) {
        super(position, rotation, scale, duration)
        this.effect = "increasedSpeed"
    }

    /**
     * Function to construct the mesh of the power up 1.
     * @returns the mesh of the power up 1.
     */
    _constructMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const cube = new THREE.Mesh(geometry, material);
        return cube
    }
}

export { MyPowerUp1 };