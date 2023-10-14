import * as THREE from 'three';

/**
 * A class representing a table object.
 */
class MyTable {

    /**
     * Builds a table object with the given parameters.
     * @param {number} tableWidth - The width of the table.
     * @param {number} tableHeight - The height of the table.
     * @param {number} tableLength - The length of the table.
     * @param {THREE.Material} tableMaterial - The material for the table top.
     * @param {number} legRadius - The radius of the table legs.
     * @param {number} legHeight - The height of the table legs.
     * @param {THREE.Material} legMaterial - The material for the table legs.
     * @returns {THREE.Mesh} The table object.
     */
    build(tableWidth, tableHeight, tableLength, tableMaterial, legRadius, legHeight, legMaterial) {
        const tableMesh = new THREE.Mesh();

        // Create the table top
        const tableTop = new THREE.BoxGeometry(tableHeight, tableLength, tableWidth);
        const tableTopMesh = new THREE.Mesh(tableTop, tableMaterial);
        tableTopMesh.rotation.z = -Math.PI / 2;

        // Create the table legs
        const tableLeg = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 20);
        const slack = tableLength / 12;

        const tableLegMesh1 = new THREE.Mesh(tableLeg, legMaterial);
        tableLegMesh1.rotation.z = -Math.PI / 2;
        tableLegMesh1.position.x = legHeight / 2;
        tableLegMesh1.position.y = -tableLength / 2 + slack;
        tableLegMesh1.position.z = -tableWidth / 2 + slack;

        const tableLegMesh2 = tableLegMesh1.clone();
        tableLegMesh2.position.z = tableWidth / 2 - slack;

        const tableLegMesh3 = tableLegMesh1.clone();
        tableLegMesh3.position.y = tableLength / 2 - slack;
        tableLegMesh3.position.z = -tableWidth / 2 + slack;

        const tableLegMesh4 = tableLegMesh1.clone();
        tableLegMesh4.position.y = tableLength / 2 - slack;
        tableLegMesh4.position.z = tableWidth / 2 - slack;

        // Add the table top and legs to the table mesh
        tableTopMesh.add(tableLegMesh1);
        tableTopMesh.add(tableLegMesh2);
        tableTopMesh.add(tableLegMesh3);
        tableTopMesh.add(tableLegMesh4);
        tableMesh.add(tableTopMesh);

        // Position the table mesh
        tableMesh.position.y = legHeight;

        // Enable shadows for all meshes
        tableMesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        return tableMesh;
    }
}

export { MyTable };