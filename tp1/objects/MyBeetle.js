import * as THREE from 'three';

class MyBeetle {

    /**
     * Builds a beetle object with the given parameters.
     * @param {THREE.Vector3} point - The center point of the beetle.
     * @param {number} size - The size of the beetle.
     * @param {string} color - The color of the beetle.
     * @param {number} sampleSize - The number of samples to take when building the beetle.
     * @returns {THREE.Group} The beetle object.
     */
    build(point, size, color = "#ffffff", sampleSize = 30) {
        const beetle = new THREE.Group();

        // Build the two semi-circles and add them to the beetle group
        const semiCircle1 = this.buildSemiCircle(point, 3 * size, sampleSize, color);
        const semiCircle2 = semiCircle1.clone();
        beetle.add(semiCircle1);
        beetle.add(semiCircle2);
        semiCircle2.position.x = 10 * size;

        // Build the quarter circle and add it to the beetle group
        const quarterCircle1 = this.buildQuarterCircle(point, 8 * size, sampleSize, color);
        beetle.add(quarterCircle1);

        // Build two more quarter circles and add them to the beetle group
        const quarterCircle2 = this.buildQuarterCircle(point, 4 * size, sampleSize, color);
        const quarterCircle3 = quarterCircle2.clone();
        quarterCircle2.rotation.z = - Math.PI / 2;
        quarterCircle2.position.x = 8 * size;
        quarterCircle2.position.y = 8 * size;
        quarterCircle3.rotation.z = - Math.PI / 2;
        quarterCircle3.position.x = 12 * size;
        quarterCircle3.position.y = 4 * size;
        beetle.add(quarterCircle2);
        beetle.add(quarterCircle3);

        return beetle;
    }

    /**
     * Builds a semi-circle with the given parameters.
     * @param {THREE.Vector3} point - The center point of the semi-circle.
     * @param {number} radius - The radius of the semi-circle.
     * @param {number} sampleSize - The number of samples to take when building the semi-circle.
     * @param {string} color - The color of the semi-circle.
     * @returns {THREE.Line} The semi-circle object.
     */
    buildSemiCircle(point, radius, sampleSize = 30, color = "#ffffff") {
        const xValueInset = point.x + radius * 2 * 0.05;
        const yValueOffset = point.y + radius * 4 / 3;

        // Define the points for a cubic bezier curve that approximates a semi-circle
        const points = [
            new THREE.Vector3(point.x, point.y, 0),
            new THREE.Vector3(xValueInset, yValueOffset, 0),
            new THREE.Vector3(2 * radius - xValueInset, yValueOffset, 0),
            new THREE.Vector3(point.x + 2 * radius, 0, 0),
        ];

        // Create a cubic bezier curve from the points and sample it to create a line geometry
        const curve = new THREE.CubicBezierCurve3(...points);
        const sampledPoints = curve.getPoints(sampleSize);
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
        const lineMaterial = new THREE.LineBasicMaterial({ color: color });

        // Create a line mesh from the geometry and material and return it
        return new THREE.Line(curveGeometry, lineMaterial);
    }

    /**
     * Builds a quarter circle with the given parameters.
     * @param {THREE.Vector3} initPoint - The starting point of the quarter circle.
     * @param {number} radius - The radius of the quarter circle.
     * @param {number} sampleSize - The number of samples to take when building the quarter circle.
     * @param {string} color - The color of the quarter circle.
     * @returns {THREE.Line} The quarter circle object.
     */
    buildQuarterCircle(initPoint, radius, sampleSize = 30, color = "#ff0000") {

        // Define the points for a quadratic bezier curve that approximates a quarter circle
        const points = [
            new THREE.Vector3(initPoint.x, initPoint.y, 0),
            new THREE.Vector3(initPoint.x + 0.12 * radius, initPoint.y + radius * 0.95, 0),
            new THREE.Vector3(initPoint.x + radius, initPoint.y + radius, 0),
        ];

        // Create a quadratic bezier curve from the points and sample it to create a line geometry
        const curve = new THREE.QuadraticBezierCurve3(...points);
        const sampledPoints = curve.getPoints(sampleSize);
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
        const lineMaterial = new THREE.LineBasicMaterial({ color: color });

        // Create a line mesh from the geometry and material and return it
        return new THREE.Line(curveGeometry, lineMaterial);
    }
}

export { MyBeetle };