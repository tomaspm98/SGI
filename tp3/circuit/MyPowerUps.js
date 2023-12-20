import * as THREE from 'three';
import { MyActivatable } from "./MyActivatable.js";

class MyPowerUp1 extends MyActivatable {
    constructor(position, rotation, scale) {
        super(position, rotation, scale)
    }

    _constructMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const cube = new THREE.Mesh(geometry, material);
        return cube
    }
}

export { MyPowerUp1 };