import * as THREE from 'three';
import {MyOBB} from '../collisions/MyOBB.js';

class MyActivatable {
    constructor(position, rotation, scale, duration) {
        this.position = position
        this.rotation = rotation
        this.scale = scale
        this.duration = duration

        this.draw()

        this.obb = new MyOBB(this.mesh)
        this.active = false
    }

    /**
     * Function to construct the mesh of the activatable.
     */
    draw() {
        this.mesh = this._constructMesh()
        this.mesh.position.setX(this.position[0])
        this.mesh.position.setZ(this.position[2])
        this.mesh.rotation.set(...this.rotation)
        this.mesh.scale.set(...this.scale)
    }

    /**
     * Funtion to activate the effect of the activatable on the vehicle
     * @param {*} vehicle - The vehicle with the effect on.
     */
    activate(vehicle) {
        if (!this.active) {
            this.active = true
            this.mesh.visible = false
            vehicle.objectCollided = this
            vehicle.changeState(this.effect)
            setTimeout(() => {
                vehicle.changeState("normal")
                vehicle.objectCollided = null
                this.active = false
                this.mesh.visible = true
            }, this.duration)
        }
    }
}

export {MyActivatable};