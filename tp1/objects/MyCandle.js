import * as THREE from 'three';

class MyCandle {

    build(candleRadius, candleHeight, flameRadius, flameHeight, candleMaterial, flameMaterial) {

        let candle = new THREE.CylinderGeometry(candleRadius,candleRadius,candleHeight,32);
        this.candleMesh = new THREE.Mesh(candle,candleMaterial);
        this.candleMesh.position.y = -0.5;

        let wire = new THREE.CylinderGeometry(0.002,0.002,0.05,32);
        this.wireMesh = new THREE.Mesh(wire,candleMaterial); //vai ter um material proprio todo preto
        this.wireMesh.position.y = -0.1
        this.candleMesh.add(this.wireMesh);

        let flame = new THREE.ConeGeometry(flameRadius,flameHeight,32);
        this.flameMesh = new THREE.Mesh(flame, flameMaterial);
        this.flameMesh.position.y = -0.14;
        this.flameMesh.rotation.x = -Math.PI;
        this.candleMesh.add(this.flameMesh);

        return this.candleMesh;

    }
}

export {MyCandle};