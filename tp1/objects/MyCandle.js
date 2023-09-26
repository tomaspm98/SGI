import * as THREE from 'three';

class MyCandle {

    build(candleRadius, candleHeight, flameRadius, flameHeight, candleMaterial, flameMaterial) {

        const candle = new THREE.CylinderGeometry(candleRadius,candleRadius,candleHeight,32);
        const candleMesh = new THREE.Mesh(candle,candleMaterial);

        const diffuseWireColor = "#ffffff"
        const wireShininess = 30
        const wireMaterial = new THREE.MeshPhongMaterial({
            color: diffuseWireColor,
            specular: diffuseWireColor, emissive: "#000000", shininess: wireShininess
        })
        

        const wire = new THREE.CylinderGeometry(0.002,0.002,0.05,32);
        const wireMesh = new THREE.Mesh(wire,wireMaterial);
        wireMesh.position.y = candleHeight/2;
        candleMesh.add(wireMesh);

        const flame = new THREE.ConeGeometry(flameRadius,flameHeight,32);
        const flameMesh = new THREE.Mesh(flame, flameMaterial);
    
        flameMesh.position.y = (candleHeight/2)+0.05+0.025;//wireLength + margin
        candleMesh.add(flameMesh);

        return candleMesh;

    }
}

export {MyCandle};