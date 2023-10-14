import * as THREE from 'three';
import { MyBeetle } from './MyBeetle.js';

/**
 * A class representing a flower object.
 */
class MyFlower {

    /**
     * Builds a flower object with the given parameters.
     * @param {THREE.Vector3} point - The center point of the flower.
     * @param {number} size - The size of the flower.
     * @param {THREE.Material} centerMaterial - The material for the center of the flower.
     * @param {string} color - The color of the flower.
     * @param {number} sampleSize - The sample size for the beetle.
     * @returns {THREE.Mesh} The flower object.
     */
    build(point, size, centerMaterial, color = "#ffffff", sampleSize = 30) {
        const flower = new THREE.Mesh();

        // Create the semicircle for the top half of the flower
        const beetle1 = new MyBeetle().buildSemiCircle(point, size, sampleSize, color);
        flower.add(beetle1);

        // Create the semicircle for the bottom half of the flower
        const beetle2 = new MyBeetle().buildSemiCircle(point, size, sampleSize, color);
        beetle2.rotation.x = Math.PI;
        flower.add(beetle2);

        // Create the stem of the flower
        const points = [
            new THREE.Vector3(0.0, 0.0, 0.0), // starting point
            new THREE.Vector3(-1.0, 0.0, 0.0), // control point
            new THREE.Vector3(-1.0, 2.0, 0.0),  // ending point
            new THREE.Vector3(0.0, 3.0, 0.0)
        ];
        const curve = new THREE.CubicBezierCurve3(...points);
        const stemMaterial = new THREE.MeshBasicMaterial({ color: "#007a00" });
        const stemGeometry = new THREE.TubeGeometry(curve, 64, 0.05);
        const stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);
        stemMesh.position.set(point.x + size, -3 - size, point.z);
        flower.add(stemMesh);

        // Create the center of the flower
        const centerGeometry = new THREE.SphereGeometry(size, 32, 16);
        const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
        centerMesh.position.x = size;
        centerMesh.scale.set(1, 1, 0.25);
        flower.add(centerMesh);

        // Create the petals of the flower
        const petalGeometry = new THREE.CylinderGeometry(0.2, 0.1, 0.1, 32);
        const numberOfPetals = 8;
        const angleBetweenPetals = 2 * Math.PI / numberOfPetals;
        const petalMaterial = new THREE.LineBasicMaterial({ color: "#ffff00" });

        for (let i = 0; i < numberOfPetals; i++) {
            const petalMesh = new THREE.Mesh(petalGeometry, petalMaterial);
            petalMesh.rotation.x = Math.PI / 2;
            petalMesh.position.x = size * Math.cos(i * angleBetweenPetals) + size;
            petalMesh.position.y = size * Math.sin(i * angleBetweenPetals);
            flower.add(petalMesh);
        }

        // Enable shadows for all meshes
        flower.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });

        return flower;
    }
}

export { MyFlower };