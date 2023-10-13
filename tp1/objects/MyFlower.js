import * as THREE from 'three';
import { MyBeetle } from './MyBeetle.js';

class MyCircle {

    build(point, size, centerMaterial, color = "#ffffff", sampleSize = 30) {
        let beetle1 = new MyBeetle().buildSemiCircle(point, size, sampleSize, color)
        let beetle2 = new MyBeetle().buildSemiCircle(point, size, sampleSize, color)
        beetle2.rotation.x = Math.PI
        const circle = new THREE.Mesh()
        circle.add(beetle1)
        circle.add(beetle2)

        let points = [
            new THREE.Vector3(0.0, 0.0, 0.0), // starting point
            new THREE.Vector3(-1.0, 0.0, 0.0), // control point
            new THREE.Vector3(-1.0, 2.0, 0.0),  // ending point
            new THREE.Vector3(0.0, 3.0, 0.0)
        ]
        let curve = new THREE.CubicBezierCurve3(...points)
        this.lineMaterial = new THREE.MeshBasicMaterial({ color: "#007a00" })
        this.curveGeometry = new THREE.TubeGeometry(curve, 64, 0.05)
        this.lineObj = new THREE.Mesh(this.curveGeometry, this.lineMaterial)
        this.lineObj.position.set(point.x + size, -3 - size, point.z)
        circle.add(this.lineObj)

        const center = new THREE.SphereGeometry(size, 32, 16)
        const centerMesh = new THREE.Mesh(center, centerMaterial)
        centerMesh.position.x = size
        centerMesh.scale.set(1, 1, 0.25)
        circle.add(centerMesh)

        const petal = new THREE.CylinderGeometry(0.2, 0.1, 0.1, 32)

        const numberOfPetals = 8;
        const angleBetweenPetals = 2 * Math.PI / numberOfPetals;

        this.flowerMaterial = new THREE.LineBasicMaterial({ color: "#ffff00" })

        for (let i = 0; i < numberOfPetals; i++) {
            const petalMesh = new THREE.Mesh(petal, this.flowerMaterial);
            petalMesh.rotation.x = Math.PI / 2;
            petalMesh.position.x = size * Math.cos(i * angleBetweenPetals) + size;
            petalMesh.position.y = size * Math.sin(i * angleBetweenPetals);
            //petalMesh.rotation.z = -i * angleBetweenPetals; // Adjust rotation based on position
            circle.add(petalMesh);
        }
        return circle
    }
}

export { MyCircle };