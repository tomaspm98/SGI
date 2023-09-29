import * as THREE from 'three';

class MyDoor{
    build(doorWidth, doorHeight, doorDepth, doorMaterial){
        const door = new THREE.BoxGeometry(doorWidth,doorHeight, doorDepth);
        const doorMesh= new THREE.Mesh(door,doorMaterial);

        return doorMesh;
    }
} export{MyDoor}