import * as THREE from 'three';
import {MyOBB} from '../collisions/MyOBB.js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class MyActivatable {
    constructor(position, rotation, scale, duration) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.duration = duration;

        this.obb = null;
        this.meshPromise = this._constructMesh().then(async (loadedMesh) => {
            if (loadedMesh) {
                this.mesh = loadedMesh;

                // Call draw after the mesh and MyOBB are fully loaded
                this.draw();

                // Create the MyOBB instance after the mesh is fully loaded
                this.obb = new MyOBB(this.mesh);
            } else {
                console.error("Error: Loaded mesh is null or undefined.");
            }

            // Return the loaded mesh for further use if needed
            return this.mesh;
        });

        this.active = false;
    }

    /**
     * Function to construct the mesh of the activatable.
     */
    draw() {
        if (this.mesh) {
            this.mesh.position.set(...this.position);
            this.mesh.rotation.set(...this.rotation);
            this.mesh.scale.set(...this.scale);
        }
    }


    /**
     * Funtion to activate the effect of the activatable on the vehicle
     * @param {*} vehicle - The vehicle with the effect on.
     */
    async activate(vehicle) {
        await this.meshPromise;

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

    update(){
        
    }
}

export {MyActivatable};