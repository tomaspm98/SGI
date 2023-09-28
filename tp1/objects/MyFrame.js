import * as THREE from 'three';

class MyFrame{

    createFrame(frameWidth, frameHeight, frameDepth, frameMaterial, picture){
        const frameMesh = new THREE.Mesh();

        frameMesh.add(new THREE.Mesh(new THREE.PlaneGeometry(frameWidth, frameHeight), picture))

        const border1 = new THREE.Mesh(new THREE.BoxGeometry(frameWidth + frameDepth, frameDepth, frameDepth), frameMaterial);
        border1.position.y = frameWidth / 2;
        frameMesh.add(border1);

        const border2 = new THREE.Mesh(new THREE.BoxGeometry(frameWidth + frameDepth, frameDepth, frameDepth), frameMaterial);
        border2.position.y = -frameWidth / 2;
        frameMesh.add(border2);

        const border3 = new THREE.Mesh(new THREE.BoxGeometry(frameDepth, frameHeight, frameDepth), frameMaterial);
        border3.position.x = frameWidth / 2;
        frameMesh.add(border3);

        const border4 = new THREE.Mesh(new THREE.BoxGeometry(frameDepth, frameHeight, frameDepth), frameMaterial);
        border4.position.x = -frameWidth / 2;
        frameMesh.add(border4);

        return frameMesh;
    }

}

export { MyFrame };