import * as THREE from 'three';

/**
 * A class representing a glass object.
 */
class MyGlass {

    /**
     * Builds a glass object with the given parameters.
     * @param {number} glassRadiusTop - The top radius of the glass.
     * @param {number} glassRadiusBottom - The bottom radius of the glass.
     * @param {number} glassHeight - The height of the glass.
     * @param {THREE.Material} glassMaterial - The material for the glass.
     * @returns {THREE.Mesh} The glass object.
     */
    build(glassRadiusTop, glassRadiusBottom, glassHeight, glassMaterial) {
        // Create the glass geometry
        const glass = new THREE.CylinderGeometry(glassRadiusTop, glassRadiusBottom, glassHeight, 32, 1, true);
        // Create the glass mesh
        const glassMesh = new THREE.Mesh(glass, glassMaterial);

        // Create the bottom of the glass
        const bottomGeometry = new THREE.CircleGeometry(glassRadiusBottom, 32);
        const bottomMesh = new THREE.Mesh(bottomGeometry, glassMaterial);
        bottomMesh.position.y = -glassHeight / 2;
        bottomMesh.rotation.x = Math.PI / 2;
        glassMesh.add(bottomMesh);

        // Enable shadows for all meshes
        glassMesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });

        return glassMesh;
    }
}

export { MyGlass };