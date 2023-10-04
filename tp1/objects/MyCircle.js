import * as THREE from 'three';
import { MyBeetle } from './MyBeetle.js';

class MyCircle {

    build(point, size, color = "0xffffff", sampleSize = 30) {
        let beetle1 = new MyBeetle().build(point,size,color, sampleSize)
        let beetle2 = new MyBeetle().build(point,size,color, sampleSize)
        beetle2.rotation.x=Math.PI
        const circle = new THREE.Mesh()
        circle.add(beetle1)
        circle.add(beetle2)

        let points = [
            new THREE.Vector3( 0.0, 0.0, 0.0 ), // starting point
            new THREE.Vector3(-1.0, 0.0, 0.0 ), // control point
            new THREE.Vector3(-1.0, 2.0, 0.0 ),  // ending point
            new THREE.Vector3(0.0, 3.0, 0.0)
        ]
        let curve = new THREE.CubicBezierCurve3( points[0], points[1], points[2], points[3])
        let sampledPoints = curve.getPoints( sampleSize );
        this.curveGeometry =new THREE.BufferGeometry().setFromPoints( sampledPoints )
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0x007a00 } )
        this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
        this.lineObj.position.set(point.x+size,-3-size,point.z)
        circle.add(this.lineObj)
        
        const petal = new THREE.CylinderGeometry(0.2,0.1,0.1,32)
        
        const numberOfPetals = 8;
        const angleBetweenPetals = 2 * Math.PI / numberOfPetals;

        this.flowerMaterial = new THREE.LineBasicMaterial( { color: 0xffff00 } )

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