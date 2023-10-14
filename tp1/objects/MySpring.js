import * as THREE from 'three';

/**
 * A class representing a spring object.
 */
class MySpring {

    /**
     * Builds a spring object with the given parameters.
     * @param {THREE.Vector3} point - The starting point of the spring.
     * @param {number} width - The width of the spring.
     * @param {number} height - The height of the spring.
     * @param {number} sampleSize - The number of segments used to build the spring.
     * @param {string} color - The color of the spring.
     * @param {number} incrementHeight - The increment of the height of the spring.
     * @returns {THREE.Line} The spring object.
     */
    build(point, width, height, sampleSize = 500, color = "#ffffff", incrementHeight = 1) {
        const points = [];

        // Generate points along the spring
        for (let i = 0, j = 0; i < height; i += incrementHeight, j += Math.PI / 16) {
            const x = point.x + Math.cos(j) * width;
            const y = point.y + i;
            const z = point.z + Math.sin(j) * width;
            points.push(new THREE.Vector3(x, y, z));
        }

        // Create the spring curve
        const curve = new THREE.CatmullRomCurve3(points);

        // Create the spring geometry
        const curveGeometry = new THREE.TubeGeometry(curve, sampleSize, 0.03, sampleSize);

        // Create the spring material
        const lineMaterial = new THREE.MeshBasicMaterial({ color: color });

        // Create the spring mesh
        const springMesh = new THREE.Line(curveGeometry, lineMaterial);

        // Enable shadows for the spring mesh
        springMesh.castShadow = false;
        springMesh.receiveShadow = false;

        return springMesh;
    }
}

export { MySpring };