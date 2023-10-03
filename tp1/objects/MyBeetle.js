import * as THREE from 'three';

class MyBeetle {

    build(point, size, color = "0xffffff", sampleSize = 30) {
        return this.buildSemiCircle(point, size, sampleSize, color)
    }

    buildSemiCircle(point, radius, sampleSize = 30, color = "0xffffff") {
        const xValueInset = point.x + radius * 2 * 0.05
        const yValueOffset = point.y + radius * 4 / 3

        const points = [
            new THREE.Vector3(point.x, point.y, 0),
            new THREE.Vector3(xValueInset, yValueOffset, 0),
            new THREE.Vector3(2 * radius - xValueInset, yValueOffset, 0),
            new THREE.Vector3(point.x + 2 * radius, 0, 0),
        ];

        let curve = new THREE.CubicBezierCurve3(...points);
        let sampledPoints = curve.getPoints(sampleSize);
        let curveGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
        let lineMaterial = new THREE.LineBasicMaterial({ color: color });
        console.log(color)
        return new THREE.Line(curveGeometry, lineMaterial)
    }
}

export { MyBeetle };