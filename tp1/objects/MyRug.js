import * as THREE from 'three';

class MyRug{
    build(rugWidth, rugHeight, rugDepth, rugMaterial){
        const rug = new THREE.BoxGeometry(rugWidth,rugHeight, rugDepth);
        const rugMesh= new THREE.Mesh(rug,rugMaterial);

        return rugMesh;
    }
} export{MyRug}