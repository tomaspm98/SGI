import * as THREE from 'three';

/**
 * A class representing a cake object.
 */
class MyCake {

    /**
     * Builds a cake object with the given parameters.
     * @param {number} radius - The radius of the cake.
     * @param {number} height - The height of the cake.
     * @param {THREE.Material} cakeMaterial - The material for the cake.
     * @param {number} radialSegments - The number of segments around the circumference of the cake.
     * @param {number} heightSegments - The number of segments along the height of the cake.
     * @param {number} thetaLength - The angle of the cake slice in radians.
     * @returns {THREE.Mesh} The cake object.
     */
    build(radius, height, cakeMaterial, radialSegments = 20, heightSegments = 1, thetaLength = 2 * Math.PI) {
        const cakeGeometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments, heightSegments, false, 0, thetaLength);
        const cakeMesh = new THREE.Mesh(cakeGeometry, cakeMaterial);
        cakeMesh.castShadow = true;
        cakeMesh.receiveShadow = true;

        if (thetaLength === 2 * Math.PI) {
            return cakeMesh;
        }

        const face1Geometry = new THREE.PlaneGeometry(2 * radius, height);
        const face2Geometry = new THREE.PlaneGeometry(2 * radius, height);
        const face1Mesh = new THREE.Mesh(face1Geometry, cakeMaterial);
        const face2Mesh = new THREE.Mesh(face2Geometry, cakeMaterial);

        face1Mesh.rotation.y = -Math.PI / 2;
        face2Mesh.rotation.y = Math.PI / 2 + thetaLength;

        cakeMesh.add(face1Mesh);
        cakeMesh.add(face2Mesh);

        return cakeMesh;
    }
}

export { MyCake };