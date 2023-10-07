import * as THREE from 'three';

class MyGlass {

    build(glassRadiusTop, glassRadiusBottom, glassHeight, glassMaterial) {

        const glass = new THREE.CylinderGeometry(glassRadiusTop, glassRadiusBottom, glassHeight, 32, 1, true);
        const glassMesh = new THREE.Mesh(glass, glassMaterial);

        const bottom = new THREE.Mesh(new THREE.CircleGeometry(glassRadiusBottom, 32), glassMaterial);
        bottom.position.y = -glassHeight / 2;
        bottom.rotation.x = Math.PI / 2;
        glassMesh.add(bottom);
        return glassMesh

    }
}

export { MyGlass };