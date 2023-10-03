import * as THREE from 'three';

class MyGlass {

    build(glassRadiusTop, glassRadiusBottom, glassHeight, glassMaterial) {

        const glass = new THREE.CylinderGeometry(glassRadiusTop, glassRadiusBottom, glassHeight, 32);
        const glassMesh = new THREE.Mesh(glass, glassMaterial);

        return glassMesh

    }
}

export { MyGlass };