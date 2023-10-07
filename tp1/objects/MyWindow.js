import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

class MyWindow{

    create(windowWidth, windowHeight, windowDepth, borderMaterial, picture, intensity = 300, colorLight = "#ffffff" ){
        const windowMesh = new THREE.Mesh();

        const glass = new THREE.Mesh(new THREE.PlaneGeometry(windowWidth, windowHeight), picture);
        glass.rotation.y = Math.PI;
        windowMesh.add(glass)

        const border1 = new THREE.Mesh(new THREE.BoxGeometry(windowWidth + windowDepth, windowDepth, windowDepth), borderMaterial);
        border1.position.y = windowHeight / 2;
        windowMesh.add(border1);

        const border2 = new THREE.Mesh(new THREE.BoxGeometry(windowWidth + windowDepth, windowDepth, windowDepth), borderMaterial);
        border2.position.y = -windowHeight / 2;
        windowMesh.add(border2);

        const border3 = new THREE.Mesh(new THREE.BoxGeometry(windowDepth, windowHeight, windowDepth), borderMaterial);
        border3.position.x = windowWidth / 2;
        windowMesh.add(border3);

        const border4 = new THREE.Mesh(new THREE.BoxGeometry(windowDepth, windowHeight, windowDepth), borderMaterial);
        border4.position.x = -windowWidth / 2;
        windowMesh.add(border4);

        const border5 = new THREE.Mesh(new THREE.BoxGeometry(windowDepth, windowHeight, windowDepth), borderMaterial);
        windowMesh.add(border5);

        return windowMesh;
    }

}

export { MyWindow };