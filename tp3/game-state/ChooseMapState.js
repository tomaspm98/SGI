import { MyGameState } from "./MyGameState.js";
import { MyText3D } from "../MyText3D.js";
import * as THREE from 'three';

class ChooseMapState extends MyGameState {
    constructor(gameStateManager) {
        super(gameStateManager);
        this.name = "chooseMap";
    }

    _createScene() {
        const planeGeometry = new THREE.PlaneGeometry(1920, 1080); // Adjust size as needed
        const wallpaper = new THREE.TextureLoader().load("scene/wallpaper.jpg")
        const planeMaterial = new THREE.MeshBasicMaterial({ map: wallpaper });
        const interfacePlane = new THREE.Mesh(planeGeometry, planeMaterial);

        const text = new MyText3D("scene/sprite_sheet.png", [1020, 1020], [102, 102]);

        this.scene = new THREE.Scene();
        this.scene.add(interfacePlane);
    }

    _createCameras() {
        this.cameras = [];

        const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera1.position.set(0, 0, 600);

        this.cameras.push({ name: "Perspective", camera: camera1, locked: true });
        this.activeCameraName = "Perspective";
    }

    setActiveCamera(name) {
        this.activeCameraName = name;
    }
}

export { ChooseMapState }