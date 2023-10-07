import * as THREE from 'three';

class MyLamp {
    build(lampRadius, lampHeight, wireHeight, lampMaterial) {
        const lamp = new THREE.Mesh();

        const wireMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, wireHeight, 32), lampMaterial);
        wireMesh.position.y = wireHeight;
        lamp.add(wireMesh);

        const lampGeometry = new THREE.CylinderGeometry(0.4 * lampRadius, lampRadius, lampHeight, 32, 1, true);

        const lampMesh = new THREE.Mesh(lampGeometry, lampMaterial);
        lampMesh.position.y = -wireHeight / 2 + lampHeight / 2;
        lamp.add(lampMesh);

        const lightBulb = new THREE.Mesh(new THREE.SphereGeometry(lampRadius * 0.4, 32, 32), new THREE.MeshPhongMaterial({ color: "#fff29e", shininess: 100 }));
        lightBulb.position.y = lampHeight / 4;
        lampMesh.add(lightBulb);

        return lamp;
    }
}

export { MyLamp };