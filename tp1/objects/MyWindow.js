import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

/**
 * A class representing a window object.
 */
class MyWindow {

    /**
     * Builds a window object with the given parameters.
     * @param {number} windowWidth - The width of the window.
     * @param {number} windowHeight - The height of the window.
     * @param {number} windowDepth - The depth of the window.
     * @param {THREE.Material} borderMaterial - The material for the window borders.
     * @param {THREE.Material} picture - The material for the window glass.
     * @param {number} intensity - The intensity of the window light.
     * @param {string} colorLight - The color of the window light.
     * @returns {THREE.Mesh} The window object.
     */
    create(windowWidth, windowHeight, windowDepth, borderMaterial, picture, intensity = 300, colorLight = "#ffffff") {
        const windowMesh = new THREE.Mesh();

        // Create the window glass
        const glass = new THREE.Mesh(new THREE.PlaneGeometry(windowWidth, windowHeight), picture);
        glass.rotation.y = Math.PI;
        windowMesh.add(glass);

        // Create the window borders
        const border1 = new THREE.Mesh(new THREE.BoxGeometry(windowWidth + windowDepth, windowDepth, windowDepth), borderMaterial);
        border1.position.y = windowHeight / 2;
        windowMesh.add(border1);

        const border2 = border1.clone();
        border2.position.y = -windowHeight / 2;
        windowMesh.add(border2);

        const border3 = border1.clone();
        border3.geometry = new THREE.BoxGeometry(windowDepth, windowHeight, windowDepth);
        border3.position.x = windowWidth / 2;
        windowMesh.add(border3);

        const border4 = border3.clone();
        border4.position.x = -windowWidth / 2;
        windowMesh.add(border4);

        const border5 = border3.clone();
        windowMesh.add(border5);


        // Enable shadows for all meshes
        windowMesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });

        return windowMesh;
    }
}

export { MyWindow };