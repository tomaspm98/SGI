import * as THREE from 'three';

class MyRug{
    build(rugWidth, rugHeight, rugDepth, rugMaterial){
        const rug = new THREE.BoxGeometry(rugWidth,rugHeight, rugDepth);
        const rugMesh= new THREE.Mesh(rug,rugMaterial);

        rugMesh.rotation.x = Math.PI / 2;

        return rugMesh;
    }
} export{MyRug}