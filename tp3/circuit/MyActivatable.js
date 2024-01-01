import * as THREE from 'three';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MyOBB } from '../collisions/MyOBB.js';

class MyActivatable {
    constructor(position, rotation, scale, duration) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.duration = duration;

        // Initialize MyOBB as null
        this.obb = null;

        // Set up a promise for the mesh loading process
        this.meshPromise = this._constructMesh().then((loadedMesh) => {
            if (loadedMesh) {
                this.mesh = loadedMesh;

                // Create the MyOBB instance after the mesh is fully loaded
                this.obb = new MyOBB(this.mesh);

                // Call draw after the mesh and MyOBB are fully loaded
                this.draw();
            } else {
                console.error("Error: Loaded mesh is null or undefined.");
            }

            // Return the loaded mesh for further use if needed
            return this.mesh;
        });

        this.active = false;
    }

    _constructMesh() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader();
            loader.load('./scene/circuits/powerup.glb', (gltf) => {
                console.log(gltf);
                const loadedMesh = gltf.scene;
                resolve(loadedMesh);
            },
            undefined,
            function (error) {
                console.error(error);
                reject(error);
            });
        });
    }

    draw() {
        // Ensure the mesh and MyOBB are loaded before trying to access their properties
        if (this.mesh && this.obb) {
            this.mesh.position.set(...this.position);
            this.mesh.rotation.set(...this.rotation);
            this.mesh.scale.set(...this.scale);
        }
    }

    async activate(vehicle) {
        // Wait for the mesh and MyOBB to be loaded before activating
        await this.meshPromise;

        if (!this.active && this.mesh) {
            this.active = true;
            this.mesh.visible = false;
            vehicle.changeState(this.effect);
            setTimeout(() => {
                vehicle.changeState("normal");
                this.active = false;
                this.mesh.visible = true;
            }, this.duration);
        }
    }
}

export { MyActivatable };
