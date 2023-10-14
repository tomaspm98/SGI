import * as THREE from 'three';

/**
 * A class representing a frame object.
 */
class MyFrame {

    /**
     * Creates a frame object with the given parameters.
     * @param {number} frameWidth - The width of the frame.
     * @param {number} frameHeight - The height of the frame.
     * @param {number} frameDepth - The depth of the frame.
     * @param {THREE.Material} frameMaterial - The material for the frame.
     * @param {THREE.Object3D} picture - The picture to be framed.
     * @param {boolean} isLineGeo - Whether the picture is a line geometry.
     * @param {Object} delta - The position offset of the picture.
     * @returns {THREE.Mesh} The frame object.
     */
    create(frameWidth, frameHeight, frameDepth, frameMaterial, picture, isLineGeo = false, delta = { x: 0, y: 0, z: 0 }) {
        const frameMesh = new THREE.Mesh();

        if (isLineGeo) {
            picture.position.set(delta.x, delta.y, delta.z);
            frameMesh.add(picture);
        } else {
            const pictureMesh = new THREE.Mesh(new THREE.PlaneGeometry(frameWidth, frameHeight), picture);
            frameMesh.add(pictureMesh);
        }

        const borderGeometry = new THREE.BoxGeometry(frameWidth + frameDepth, frameDepth, frameDepth);
        const border1 = new THREE.Mesh(borderGeometry, frameMaterial);
        border1.position.y = frameHeight / 2;
        frameMesh.add(border1);

        const border2 = new THREE.Mesh(borderGeometry, frameMaterial);
        border2.position.y = -frameHeight / 2;
        frameMesh.add(border2);

        const border3 = new THREE.Mesh(new THREE.BoxGeometry(frameDepth, frameHeight, frameDepth), frameMaterial);
        border3.position.x = frameWidth / 2;
        frameMesh.add(border3);

        const border4 = new THREE.Mesh(new THREE.BoxGeometry(frameDepth, frameHeight, frameDepth), frameMaterial);
        border4.position.x = -frameWidth / 2;
        frameMesh.add(border4);

        // Enable shadows for all meshes
        frameMesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });

        return frameMesh;
    }

}

export { MyFrame };