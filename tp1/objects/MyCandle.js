import * as THREE from 'three';

class MyCandle {

    build(candleRadius, candleHeight, flameRadius, flameHeight, candleMaterial, flameMaterial) {

        let candle = new THREE.CylinderGeometry(candleRadius,candleRadius,candleHeight,32);
        this.candleMesh = new THREE.Mesh(candle,candleMaterial);
        //this.candleMesh.position.y = -0.5;

        this.diffuseWireColor = "#ffffff"
        this.specularWireColor = "#777777"
        this.wireShininess = 30
        this.wireMaterial = new THREE.MeshPhongMaterial({
            color: this.diffuseWireColor,
            specular: this.diffuseWireColor, emissive: "#000000", shininess: this.wireShininess
        })
        let wire = new THREE.CylinderGeometry(0.002,0.002,0.025,32);
        this.wireMesh = new THREE.Mesh(wire,this.wireMaterial);
        this.wireMesh.position.y = candleHeight/2;
        this.candleMesh.add(this.wireMesh);

        let flame = new THREE.ConeGeometry(flameRadius,flameHeight,32);
        this.flameMesh = new THREE.Mesh(flame, flameMaterial);
        //this.flameMesh.position.y = -0.14;
        //this.flameMesh.rotation.x = -Math.PI;
        this.flameMesh.position.y = (candleHeight/2)+0.025+0.005;//wireLength + margin
        this.candleMesh.add(this.flameMesh);

        return this.candleMesh;

    }
}

export {MyCandle};