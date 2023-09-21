import * as THREE from 'three';

class MyDish {

    build(dishRadiusTop, dishRadiusBottom, dishHeight, dishMaterial) {

        let dish = new THREE.CylinderGeometry(dishRadiusBottom,dishRadiusTop,dishHeight,32);
        this.dishMesh = new THREE.Mesh(dish, dishMaterial);
        this.dishMesh.rotation.x = -Math.PI/2;
        this.dishMesh.position.z = 4;

        return this.dishMesh

    }
}

export {MyDish};