import * as THREE from 'three';
//import { MyTable } from './MyTable';

class MyDish {

    build(dishRadiusTop, dishRadiusBottom, dishHeight, dishMaterial) {

        let dish = new THREE.CylinderGeometry(dishRadiusBottom,dishRadiusTop,dishHeight,32);
        this.dishMesh = new THREE.Mesh(dish, dishMaterial);
        this.dishMesh.rotation.y = -Math.PI/2;
        this.dishMesh.position.y = 8.15; //tableHeight + tableLegHeight

        return this.dishMesh

    }
}

export {MyDish};