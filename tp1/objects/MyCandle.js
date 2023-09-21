import * as THREE from 'three';

class MyCandle {

    build(candleRadius, candleHeight, flameRadius, flameHeight, candleMaterial, flameMaterial) {

        const candle = new THREE.CylinderGeometry(candleRadius, candleRadius, candleHeight, 32);
        const candleMesh = new THREE.Mesh(candle, candleMaterial);

        const wire = new THREE.CylinderGeometry(0.002, 0.002, 0.05, 32);
        const wireMesh = new THREE.Mesh(wire, candleMaterial); //vai ter um material proprio todo preto
        wireMesh.position.y = -0.1
        candleMesh.add(wireMesh);

        const flame = new THREE.ConeGeometry(flameRadius, flameHeight, 32);
        const flameMesh = new THREE.Mesh(flame, flameMaterial);
        flameMesh.position.y = -0.14;
        flameMesh.rotation.x = -Math.PI;
        candleMesh.add(flameMesh);

        candleMesh.rotation.x = -Math.PI;

        return candleMesh;

    }
}

export { MyCandle };