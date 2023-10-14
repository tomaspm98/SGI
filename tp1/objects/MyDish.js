import * as THREE from 'three';

/**
 * A class representing a dish object.
 */
class MyDish {

    /**
     * Builds a dish object with the given parameters.
     * @param {number} dishRadiusTop - The top radius of the dish.
     * @param {number} dishRadiusBottom - The bottom radius of the dish.
     * @param {number} dishHeight - The height of the dish.
     * @param {THREE.Material} dishMaterial - The material for the dish.
     * @returns {THREE.Mesh} The dish object.
     */
    build(dishRadiusTop, dishRadiusBottom, dishHeight, dishMaterial) {
        // Create the dish geometry
        const dish = new THREE.CylinderGeometry(dishRadiusTop, dishRadiusBottom, dishHeight, 32);
        // Create the dish mesh
        const dishMesh = new THREE.Mesh(dish, dishMaterial);

        // Enable shadows for the mesh
        dishMesh.castShadow = false;
        dishMesh.receiveShadow = true;

        return dishMesh;
    }
}

export { MyDish };