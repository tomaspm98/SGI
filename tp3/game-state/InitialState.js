import { MyGameState } from "./MyGameState.js";
import * as THREE from 'three';

class InitialState extends MyGameState {
    constructor() {
        super();
    }

    _createScene() {
        const planeGeometry = new THREE.PlaneGeometry(1920, 1080); // Adjust size as needed
        const wallpaper = new THREE.TextureLoader().load("scene/wallpaper.jpg")
        const planeMaterial = new THREE.MeshBasicMaterial({ map: wallpaper });
        const interfacePlane = new THREE.Mesh(planeGeometry, planeMaterial);

        this.scene = new THREE.Scene();
        this.scene.add(interfacePlane);
    }

    _createCameras() {
        this.cameras = [];

        const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera1.position.set(0, 0, 600);

        this.cameras.push({ name: "Perspective", camera: camera1, locked: true });
    }

    setActiveCamera(name) {
        this.activeCameraName = name;
    }
}

export { InitialState };