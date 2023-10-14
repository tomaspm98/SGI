import * as THREE from 'three';

/**
 * A class representing a coffee table object.
 */
class MyCoffeeTable {

    /**
     * Builds a coffee table object with the given parameters.
     * @param {number} tableRadius - The radius of the table top.
     * @param {number} tableHeight - The height of the table top.
     * @param {THREE.Material} tableMaterial - The material for the table top.
     * @param {number} legRadius - The radius of the table legs.
     * @param {number} legHeight - The height of the table legs.
     * @param {THREE.Material} legMaterial - The material for the table legs.
     * @param {number} radialSegments - The number of radial segments for the table top and legs.
     * @returns {THREE.Mesh} The coffee table object.
     */
    build(tableRadius, tableHeight, tableMaterial, legRadius, legHeight, legMaterial, radialSegments = 32) {
        const coffeeTable = new THREE.Mesh();

        // Create the table top
        const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(tableRadius, tableRadius, tableHeight, radialSegments), tableMaterial);
        coffeeTable.add(tableTop);

        // Create the table legs
        const legPositions = [
            { x: tableRadius / 2, y: -legHeight / 2 + tableHeight / 3.5, z: 0, rotationX: 0, rotationZ: Math.PI / 8 },
            { x: -tableRadius / 2, y: -legHeight / 2 + tableHeight / 3.5, z: 0, rotationX: 0, rotationZ: -Math.PI / 8 },
            { x: 0, y: -legHeight / 2 + tableHeight / 3.5, z: tableRadius / 2, rotationX: -Math.PI / 8, rotationZ: 0 },
            { x: 0, y: -legHeight / 2 + tableHeight / 3.5, z: -tableRadius / 2, rotationX: Math.PI / 8, rotationZ: 0 }
        ];

        for (const legPosition of legPositions) {
            const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(legRadius, legRadius, legHeight, radialSegments), legMaterial);
            tableLeg.position.set(legPosition.x, legPosition.y, legPosition.z);
            tableLeg.rotation.x = legPosition.rotationX;
            tableLeg.rotation.z = legPosition.rotationZ;
            coffeeTable.add(tableLeg);
        }

        // Enable shadows for all meshes
        coffeeTable.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        return coffeeTable;
    }
}

export { MyCoffeeTable };