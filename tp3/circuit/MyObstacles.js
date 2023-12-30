import * as THREE from 'three';
import { MyActivatable } from "./MyActivatable.js";
import { MyShader } from './MyShader.js';

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
        //this._constructShader() 
        console.log(this.shaderPulsate)
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