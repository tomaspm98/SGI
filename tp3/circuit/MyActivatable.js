import * as THREE from 'three';

class MyActivatable {
    constructor(position, rotation, scale) {
        this.position = position
        this.rotation = rotation
        this.scale = scale
        this.draw()
    }

    draw() {
        this.mesh = this._constructMesh()
        this.mesh.position.set(...this.position)
        this.mesh.rotation.set(...this.rotation)
        this.mesh.scale.set(...this.scale)
    }
}

export { MyActivatable };