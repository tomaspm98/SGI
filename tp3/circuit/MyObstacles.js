import * as THREE from 'three';
import { MyActivatable } from "./MyActivatable.js";

class MyObstacle1 extends MyActivatable {
    constructor(position, rotation, scale, duration) {
        super(position, rotation, scale)
        this.duration = duration
    }

    _constructMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        return cube
    }

    activate(vehicle) {
        const originalTopSpeed = vehicle.topSpeed
        const originalActualSpeed = vehicle.actualSpeed
        vehicle.actualSpeed = originalActualSpeed * 0.5
        vehicle.topSpeed = originalTopSpeed * 0.9
        setTimeout(() => {
            vehicle.actualSpeed = originalActualSpeed
            vehicle.topSpeed = originalTopSpeed
            console.log("Obstacle1 desactivated")
        }, 5000);
    }
}

export { MyObstacle1 };