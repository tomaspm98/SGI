import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

/**
 * A class representing a jar object.
 */
class MyJar {
    constructor() {
        this.builder = new MyNurbsBuilder();
        this.meshes = [];
        this.samplesU = 8; // maximum defined in MyGuiInterface
        this.samplesV = 8; // maximum defined in MyGuiInterface
    }

    /**
     * Builds a jar object with the given material.
     * @param {THREE.Material} jarMaterial - The material for the jar.
     * @returns {THREE.Mesh} The jar object.
     */
    build(jarMaterial) {
        const jarMesh = new THREE.Mesh();

        // Remove any existing meshes
        if (this.meshes !== null) {
            for (let i = 0; i < this.meshes.length; i++) {
                jarMesh.remove(this.meshes[i]);
            }
            this.meshes = []; // empty the array
        }

        // Define the control points for the jar surface
        const controlPoints = [
            // U = 0
            [
                // V = 0..3;
                [-0.75, -1.5, 0.0, 1],
                [-1.0, -2.0, 0.0, 1],
                [-1.0, 2.0, 0.0, 1],
                [-0.25, 1.5, 0.0, 1]
            ],
            // U = 1
            [
                // V = 0..3
                [0.0, -1.5, 1.5, 1],
                [0.0, -2.0, 1.5, 1],
                [0.0, 2.0, 1.5, 1],
                [0.0, 1.5, 0.5, 1]
            ],
            // U = 2
            [
                // V = 0..3
                [0.75, -1.5, 0.0, 1],
                [1.0, -2.0, 0.0, 1],
                [1.0, 2.0, 0.0, 1],
                [0.25, 1.5, 0.0, 1]
            ]
        ];

        // Build the jar surface
        const orderU = 2;
        const orderV = 3;
        const surfaceData = this.builder.build(controlPoints, orderU, orderV, this.samplesU, this.samplesV, jarMaterial);
        const mesh1 = new THREE.Mesh(surfaceData, jarMaterial);
        const mesh2 = new THREE.Mesh(surfaceData, jarMaterial);
        mesh2.rotation.y = Math.PI;
        jarMesh.add(mesh1);
        jarMesh.add(mesh2);

        // Enable shadows for all meshes
        jarMesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });

        return jarMesh;
    }
}

export { MyJar };