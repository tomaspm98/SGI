import * as THREE from 'three';
import { MyActivatable } from "./MyActivatable.js";

class MyObstacle1 extends MyActivatable {
    constructor(position, rotation, scale, duration) {
        super(position, rotation, scale, duration)
        this.effect = "invertedControls"
    }

    _constructMesh() {
        const geometry = new THREE.TorusGeometry(1.2, 0.4, 16, 100);
        const material = new THREE.MeshBasicMaterial({ color: 0x101116 });
        const mesh = new THREE.Mesh(geometry, material);
        return mesh
    }
}

class MyObstacle2 extends MyActivatable {
    constructor(position, rotation, scale, duration) {
        super(position, rotation, scale, duration)
        this.effect = "reducedSpeed"
    }

    _constructMesh() {
        const geometry = new THREE.CylinderGeometry(1, 1, 4, 32);
        const textureMetal = new THREE.TextureLoader().load('../scene/textures/metalTex2.jpg');
        const material = new THREE.MeshPhongMaterial({
            map: textureMetal,
            shininess: 20,
            specular: 0x7A7F80,
            color: 0x7A7F80, 
            side: THREE.DoubleSide
        });       
        const cube = new THREE.Mesh(geometry, material);
        return cube
    }
}

export { MyObstacle1, MyObstacle2 };