import * as THREE from 'three';
import { MyOBB } from '../collisions/MyOBB.js';

class MyActivatable {
    constructor(position, rotation, scale) {
        this.position = position
        this.rotation = rotation
        this.scale = scale
        this.draw()
        this.obb = new MyOBB(this.mesh)
        this.obb.createHelper()
    }

    draw() {
        this.mesh = this._constructMesh()
        this.mesh.position.set(...this.position)
        this.mesh.rotation.set(...this.rotation)
        this.mesh.scale.set(...this.scale)
    }
}

export { MyActivatable };