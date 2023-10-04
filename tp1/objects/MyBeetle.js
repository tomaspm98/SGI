import * as THREE from 'three';

class MyBeetle {

    build(point, size, color = "#ffffff", sampleSize = 30) {
        const beetle = new THREE.Group()
        const semiCircle1 = this.buildSemiCircle(point, 3 * size, sampleSize, color)
        const semiCircle2 = semiCircle1.clone()

        beetle.add(semiCircle1)
        beetle.add(semiCircle2)
        semiCircle2.position.x = 10 * size

        const quarterCircle1 = this.buildQuarterCircle(point, 8 * size, sampleSize, color)
        beetle.add(quarterCircle1)

        const quarterCircle2 = this.buildQuarterCircle(point, 4 * size, sampleSize, color)
        const quarterCircle3 = quarterCircle2.clone()

        quarterCircle2.rotation.z = - Math.PI / 2
        quarterCircle2.position.x = 8 * size
        quarterCircle2.position.y = 8 * size

        quarterCircle3.rotation.z = - Math.PI / 2
        quarterCircle3.position.x = 12 * size
        quarterCircle3.position.y = 4 * size

        beetle.add(quarterCircle2)
        beetle.add(quarterCircle3)

        return beetle
    }

    buildSemiCircle(point, radius, sampleSize = 30, color = "#ffffff") {
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

        return new THREE.Line(curveGeometry, lineMaterial)
    }

    buildQuarterCircle(initPoint, radius, sampleSize = 30, color = "#ff0000") {

        const points = [
            new THREE.Vector3(initPoint.x, initPoint.y, 0),
            new THREE.Vector3(initPoint.x + 0.12 * radius, initPoint.y + radius * 0.95, 0),
            new THREE.Vector3(initPoint.x + radius, initPoint.y + radius, 0),
        ];

        let curve = new THREE.QuadraticBezierCurve3(...points);
        let sampledPoints = curve.getPoints(sampleSize);
        let curveGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
        let lineMaterial = new THREE.LineBasicMaterial({ color: color });
        return new THREE.Line(curveGeometry, lineMaterial)
    }
}

export { MyBeetle };