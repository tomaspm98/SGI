import * as THREE from 'three';

class MyDish {

    build(dishRadiusTop, dishRadiusBottom, dishHeight, dishMaterial) {

        const dish = new THREE.CylinderGeometry(dishRadiusBottom, dishRadiusTop, dishHeight, 32);
        const dishMesh = new THREE.Mesh(dish, dishMaterial);

        return dishMesh

    }
}

export { MyDish };