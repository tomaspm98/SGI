import * as THREE from 'three';

class MyCandle {

    build(candleRadius, candleHeight, flameRadius, flameHeight, candleMaterial, flameMaterial) {

        const candle = new THREE.CylinderGeometry(candleRadius,candleRadius,candleHeight,32);
        const candleMesh = new THREE.Mesh(candle,candleMaterial);
        //this.candleMesh.position.y = -0.5;

        const diffuseWireColor = "#ffffff"
        const specularWireColor = "#777777"
        const wireShininess = 30
        const wireMaterial = new THREE.MeshPhongMaterial({
            color: diffuseWireColor,
            specular: diffuseWireColor, emissive: "#000000", shininess: wireShininess
        })
        const wire = new THREE.CylinderGeometry(0.002,0.002,0.025,32);
        const wireMesh = new THREE.Mesh(wire,wireMaterial);
        wireMesh.position.y = candleHeight/2;
        candleMesh.add(this.wireMesh);

        const flame = new THREE.ConeGeometry(flameRadius,flameHeight,32);
        const flameMesh = new THREE.Mesh(flame, flameMaterial);
        //this.flameMesh.position.y = -0.14;
        //this.flameMesh.rotation.x = -Math.PI;
        flameMesh.position.y = (candleHeight/2)+0.025+0.005;//wireLength + margin
        candleMesh.add(this.flameMesh);

        return candleMesh;

    }
}

export {MyCandle};