import * as THREE from 'three';

/**
 * A class representing a cup object.
 */
class MyCup {

    /**
     * Builds a cup object with the given parameters.
     * @param {number} radius - The radius of the cup.
     * @param {number} widthSegments - The number of horizontal segments of the cup.
     * @param {number} heightSegments - The number of vertical segments of the cup.
     * @param {number} phiStart - The starting angle for the cup's horizontal sweep.
     * @param {number} phiLength - The size of the cup's horizontal sweep.
     * @param {number} thetaStart - The starting angle for the cup's vertical sweep.
     * @param {number} thetaLength - The size of the cup's vertical sweep.
     * @param {THREE.Material} cupMaterial - The material for the cup.
     * @returns {THREE.Mesh} The cup object.
     */
    build(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength, cupMaterial) {
        // Create the cup geometry
        const cup = new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
        // Create the cup mesh
        const cupMesh = new THREE.Mesh(cup, cupMaterial);

        return cupMesh;
    }

}

export { MyCup };