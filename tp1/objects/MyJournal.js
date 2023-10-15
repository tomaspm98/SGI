import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

/**
 * A class representing a journal object.
 */
class MyJournal {
    constructor() {
        this.builder = new MyNurbsBuilder();
        this.meshes = [];
        this.samplesU = 8;
        this.samplesV = 8;
    }

    /**
     * Builds a journal object with the given material.
     * @returns {THREE.Mesh} The journal object.
     */
    build() {
        const journalMesh = new THREE.Mesh();

        // Remove any existing meshes
        if (this.meshes !== null) {
            for (let i = 0; i < this.meshes.length; i++) {
                journalMesh.remove(this.meshes[i]);
            }
            this.meshes = []; // empty the array
        }

        this.journalTexturePage = new THREE.TextureLoader().load('textures/journal_texture.jpg')
        this.journalMaterialPage = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            //specular: "#ffffff",
            shininess: 50,
            map: this.journalTexturePage,
            side: THREE.DoubleSide,
        })
        

        this.journalTextureCover = new THREE.TextureLoader().load('textures/journal_cover_texture.png')
        this.journalMaterialCover = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            //specular: "#ffffff",
            shininess: 50,
            map: this.journalTextureCover,
            side: THREE.DoubleSide,
        })

        // Define the control points for the journal surface
        const controlPoints = [
            // U = 0
            [
                // V = 0..1;
                [-1.5, -1.0, 0.0, 1],
                [-1.5, 1.0, 0.0, 1],
            ],
            // U = 1
            [
                // V = 0..1
                [0, -1.0, 1.0, 1],
                [0, 1.0, 1.0, 1]
            ],
            // U = 2
            [
                // V = 0..1
                [1.5, -1.0, 0.0, 1],
                [1.5, 1.0, 0.0, 1]
            ]
        ];

        // Build the journal surface
        const orderU = 2;
        const orderV = 1;
        const surfaceData = this.builder.build(controlPoints, orderU, orderV, this.samplesU, this.samplesV, this.journalMaterialCover);
        const mesh1 = new THREE.Mesh(surfaceData, this.journalMaterialPage);
        mesh1.rotation.set(0, 0, 0);
        mesh1.scale.set(1, 1, 1);
        mesh1.position.set(0, 0, 0);
        journalMesh.add(mesh1);

        const mesh2 = new THREE.Mesh(surfaceData, this.journalMaterialCover);
        mesh2.position.x = 3;
        mesh1.add(mesh2);

        // Enable shadows for all meshes
        journalMesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });

        return journalMesh;
    }
}

export { MyJournal };