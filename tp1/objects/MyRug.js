import * as THREE from 'three';

/**
 * A class representing a rug object.
 */
class MyRug {

    /**
     * Builds a rug object with the given parameters.
     * @param {number} rugWidth - The width of the rug.
     * @param {number} rugHeight - The height of the rug.
     * @param {number} rugDepth - The depth of the rug.
     * @param {THREE.Material} rugMaterial - The material for the rug.
     * @returns {THREE.Mesh} The rug object.
     */
    build(rugWidth, rugHeight, rugDepth, rugMaterial) {
        const rug = new THREE.BoxGeometry(rugWidth, rugHeight, rugDepth);
        const rugMesh = new THREE.Mesh(rug, rugMaterial);

        // Rotate the rug mesh to make it lie flat on the ground
        rugMesh.rotation.x = Math.PI / 2;

        // Enable shadows for the rug mesh
        rugMesh.castShadow = false;
        rugMesh.receiveShadow = true;

        return rugMesh;
    }
}

export { MyRug };