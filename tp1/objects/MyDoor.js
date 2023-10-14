import * as THREE from 'three';

/**
 * A class representing a door object.
 */
class MyDoor {

    /**
     * Builds a door object with the given parameters.
     * @param {number} doorWidth - The width of the door.
     * @param {number} doorHeight - The height of the door.
     * @param {number} doorDepth - The depth of the door.
     * @param {THREE.Material} doorMaterial - The material for the door.
     * @returns {THREE.Mesh} The door object.
     */
    build(doorWidth, doorHeight, doorDepth, doorMaterial) {
        // Create the door geometry
        const door = new THREE.BoxGeometry(doorWidth, doorHeight, doorDepth);
        // Create the door mesh
        const doorMesh = new THREE.Mesh(door, doorMaterial);

        // Enable shadows for the mesh
        doorMesh.castShadow = false;
        doorMesh.receiveShadow = false;

        return doorMesh;
    }
}

export { MyDoor };