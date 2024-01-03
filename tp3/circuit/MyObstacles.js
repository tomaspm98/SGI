import * as THREE from 'three';
import { MyActivatable } from "./MyActivatable.js";

class MyObstacle1 extends MyActivatable {
    constructor(position, rotation, scale, duration) {
        super(position, rotation, scale, duration)
        this.effect = "invertedControls"
    }

    /**
     * Function to construct the mesh of the obstacle 1.
     * @returns The mesh of the obstacle 1.
     */
    _constructMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        cube.name = "1"
        return cube
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
    _constructMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x005500 });
        const cube = new THREE.Mesh(geometry, material);
        cube.name = "2"
        return cube
    }
}

export { MyObstacle1, MyObstacle2 };