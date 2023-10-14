import * as THREE from 'three';

/**
 * A class representing a cable box object.
 */
class MyCableBox {

    /**
     * Builds a cable box object with the given parameters.
     * @param {number} boxWidth - The width of the cable box.
     * @param {number} boxHeight - The height of the cable box.
     * @param {number} boxDepth - The depth of the cable box.
     * @param {THREE.Material} boxMaterial - The material for the cable box.
     * @param {THREE.Material} powerMaterial - The material for the power button.
     * @returns {THREE.Mesh} The cable box object.
     */
    build(boxWidth, boxHeight, boxDepth, boxMaterial, powerMaterial) {
        const cableBox = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        const cableBoxMesh = new THREE.Mesh(cableBox, boxMaterial);
        cableBox.castShadow = false;
        cableBox.receiveShadow = false;

        const powerButton = new THREE.CylinderGeometry(boxDepth / 30, boxDepth / 30, boxDepth / 30, 32);
        const powerMesh = new THREE.Mesh(powerButton, powerMaterial);
        powerMesh.rotation.z = Math.PI / 2;
        powerMesh.position.x = boxWidth / 2;

        cableBoxMesh.add(powerMesh);

        return cableBoxMesh;
    }
}

export { MyCableBox };