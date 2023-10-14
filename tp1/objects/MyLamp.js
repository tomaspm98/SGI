import * as THREE from 'three';

/**
 * A class representing a lamp object.
 */
class MyLamp {

    /**
     * Builds a lamp object with the given parameters.
     * @param {number} lampRadius - The radius of the lamp.
     * @param {number} lampHeight - The height of the lamp.
     * @param {number} wireHeight - The height of the wire.
     * @param {THREE.Material} lampMaterial - The material for the lamp.
     * @returns {THREE.Mesh} The lamp object.
     */
    build(lampRadius, lampHeight, wireHeight, lampMaterial) {
        const lamp = new THREE.Mesh();

        // Create the wire mesh
        const wireMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, wireHeight, 32), lampMaterial);
        wireMesh.position.y = wireHeight;
        lamp.add(wireMesh);

        // Create the lamp geometry
        const lampGeometry = new THREE.CylinderGeometry(0.4 * lampRadius, lampRadius, lampHeight, 32, 1, true);

        // Create the lamp mesh
        const lampMesh = new THREE.Mesh(lampGeometry, lampMaterial);
        lampMesh.position.y = -wireHeight / 2 + lampHeight / 2;
        lamp.add(lampMesh);

        // Create the light bulb mesh
        const lightBulb = new THREE.Mesh(new THREE.SphereGeometry(lampRadius * 0.4, 32, 32), new THREE.MeshPhongMaterial({ color: "#fff29e", shininess: 100 }));
        lightBulb.position.y = lampHeight / 4;
        lampMesh.add(lightBulb);

        // Create the top mesh
        const top = new THREE.Mesh(new THREE.CircleGeometry(lampRadius * 0.4, 32), lampMaterial);
        top.position.y = lampHeight / 2;
        top.rotation.x = Math.PI / 2;
        lampMesh.add(top);

        // Enable shadows for all meshes
        lamp.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });

        return lamp;
    }
}

export { MyLamp };