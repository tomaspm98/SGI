import * as THREE from 'three';

class MyLed {
    build(radius, height){
        const body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height), new THREE.MeshPhongMaterial(
            {color: 0x949494,
            specular: 0xbdbdbd,
            shininess: 0,}));
        const light = new THREE.Mesh(new THREE.CircleGeometry(radius*0.5, 32), new THREE.MeshPhongMaterial(
            {color: 0xf3ff85,
            specular: 0xf8ffba,
            shininess: 100,}));
        light.rotation.x = Math.PI/2;
        light.position.y = -height/1.9;
        body.add(light);

        body.castShadow = false;
        body.receiveShadow = false;
        light.castShadow = false;
        light.receiveShadow = false;

        return body;
    }
}

export { MyLed };