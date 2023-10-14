import * as THREE from 'three';

/**
 * A class representing a chair object.
 */
class MyChair {

    /**
     * Builds a chair object with the given parameters.
     * @param {number} chairWidth - The width of the chair.
     * @param {number} chairHeight - The height of the chair.
     * @param {number} chairLength - The length of the chair.
     * @param {THREE.Material} chairMaterial - The material for the chair.
     * @returns {THREE.Mesh} The chair object.
     */
    build(chairWidth, chairHeight, chairLength, chairMaterial) {
        const chairMesh = new THREE.Mesh();

        // Create the chair seat
        const chairSeat = new THREE.BoxGeometry(chairLength, 0.4, chairWidth);
        const chairSeatMesh = new THREE.Mesh(chairSeat, chairMaterial);
        chairSeatMesh.position.y = chairHeight;
        chairMesh.add(chairSeatMesh);

        // Create the chair legs
        const chairLeg = new THREE.BoxGeometry(0.5, chairSeatMesh.position.y, 0.5);
        const slack = chairLength / 12;

        const chairLegMesh1 = new THREE.Mesh(chairLeg, chairMaterial);
        chairLegMesh1.position.y = chairSeatMesh.position.y / 2;
        chairLegMesh1.position.x = chairLength / 2 - slack;
        chairLegMesh1.position.z = chairWidth / 2 - slack;
        chairMesh.add(chairLegMesh1);

        const chairLegMesh2 = new THREE.Mesh(chairLeg, chairMaterial);
        chairLegMesh2.position.y = chairSeatMesh.position.y / 2;
        chairLegMesh2.position.x = chairLength / 2 - slack;
        chairLegMesh2.position.z = -chairWidth / 2 + slack;
        chairMesh.add(chairLegMesh2);

        const chairLegMesh3 = new THREE.Mesh(chairLeg, chairMaterial);
        chairLegMesh3.position.y = chairSeatMesh.position.y / 2;
        chairLegMesh3.position.x = -chairLength / 2 + slack;
        chairLegMesh3.position.z = -chairWidth / 2 + slack;
        chairMesh.add(chairLegMesh3);

        const chairLegMesh4 = new THREE.Mesh(chairLeg, chairMaterial);
        chairLegMesh4.position.y = chairSeatMesh.position.y / 2;
        chairLegMesh4.position.x = -chairLength / 2 + slack;
        chairLegMesh4.position.z = chairWidth / 2 - slack;
        chairMesh.add(chairLegMesh4);

        // Create the chair back
        const backHeight = 1.2 * chairLength;
        const chairBack = new THREE.BoxGeometry(chairLength, 0.4, backHeight);
        const chairBackMesh = new THREE.Mesh(chairBack, chairMaterial);
        chairBackMesh.position.y = chairSeatMesh.position.y + backHeight / 2;
        chairBackMesh.position.z = -chairWidth / 2 + 0.2;
        chairBackMesh.rotation.x = Math.PI / 2;
        chairMesh.add(chairBackMesh);

        // Enable shadows for all meshes
        chairMesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        return chairMesh;
    }
}

export { MyChair };