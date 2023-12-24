import * as THREE from 'three';
import { MyActivatable } from "./MyActivatable.js";

class MyPowerUp1 extends MyActivatable {
    constructor(position, rotation, scale, duration) {
        super(position, rotation, scale)
        this.duration = duration
    }

    _constructMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const cube = new THREE.Mesh(geometry, material);
        return cube
    }

    activate(vehicle) {
        const originalTopSpeed = vehicle.topSpeed
        const originalActualSpeed = vehicle.actualSpeed
        vehicle.actualSpeed = originalActualSpeed * 2
        vehicle.topSpeed = originalTopSpeed * 2
        setTimeout(() => {
            vehicle.actualSpeed = originalActualSpeed
            vehicle.topSpeed = originalTopSpeed
        }, this.duration);
    }
}

export { MyPowerUp1 };