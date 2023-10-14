import * as THREE from 'three';

/**
 * A class representing a candle object.
 */
class MyCandle {

    /**
     * Builds a candle object with the given parameters.
     * @param {number} candleRadius - The radius of the candle.
     * @param {number} candleHeight - The height of the candle.
     * @param {number} flameRadius - The radius of the flame.
     * @param {number} flameHeight - The height of the flame.
     * @param {THREE.Material} candleMaterial - The material for the candle.
     * @param {THREE.Material} flameMaterial - The material for the flame.
     * @returns {THREE.Mesh} The candle object.
     */
    build(candleRadius, candleHeight, flameRadius, flameHeight, candleMaterial, flameMaterial) {
        const candleGeometry = new THREE.CylinderGeometry(candleRadius, candleRadius, candleHeight, 32);
        const candleMesh = new THREE.Mesh(candleGeometry, candleMaterial);
        candleMesh.castShadow = true;
        candleMesh.receiveShadow = false;

        const wireColor = "#ffffff";
        const wireShininess = 30;
        const wireMaterial = new THREE.MeshPhongMaterial({
            color: wireColor,
            specular: wireColor,
            emissive: "#000000",
            shininess: wireShininess
        });

        const wireGeometry = new THREE.CylinderGeometry(0.002, 0.002, 0.05, 32);
        const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
        wireMesh.position.y = candleHeight / 2;
        wireMesh.castShadow = false;
        wireMesh.receiveShadow = false;
        candleMesh.add(wireMesh);

        const flameGeometry = new THREE.ConeGeometry(flameRadius, flameHeight, 32);
        const flameMesh = new THREE.Mesh(flameGeometry, flameMaterial);
        flameMesh.position.y = (candleHeight / 2) + 0.05 + 0.025; // wireLength + margin
        flameMesh.castShadow = false;
        flameMesh.receiveShadow = false;
        candleMesh.add(flameMesh);

        return candleMesh;
    }
}

export { MyCandle };