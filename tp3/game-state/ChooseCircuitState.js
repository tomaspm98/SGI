import { MyGameState } from "./MyGameState.js";
import { MyText3D } from "../MyText3D.js";
import * as THREE from 'three';

class ChooseCircuitState extends MyGameState {
    constructor(gameStateManager, pathToJSON) {
        super(gameStateManager);

        this.circuits = this._openJSON(pathToJSON);
        this.name = "chooseMap";
        this._displayCircuits();
    }

    _createScene() {
        const planeGeometry = new THREE.PlaneGeometry(1920, 1080); // Adjust size as needed
        const wallpaper = new THREE.TextureLoader().load("scene/wallpaper.jpg")
        const planeMaterial = new THREE.MeshBasicMaterial({ map: wallpaper });
        const interfacePlane = new THREE.Mesh(planeGeometry, planeMaterial);

        const text = new MyText3D("scene/sprite_sheet.png", [1020, 1020], [102, 102]);

        const title = text.transformString("Choose a map", [1000, 150]);
        title.position.set(-250, 350, 0);


        this.scene = new THREE.Scene();
        this.scene.add(interfacePlane);
        this.scene.add(title);
    }

    _createCameras() {
        this.cameras = [];

        const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera1.position.set(0, 0, 600);

        this.cameras.push({ name: "Perspective", camera: camera1, locked: true });
        this.activeCameraName = "Perspective";
    }

    _openJSON(file) {
        var request = new XMLHttpRequest();
        request.open('GET', file, false);
        request.send(null);

        if (request.status === 200) {
            return JSON.parse(request.responseText);
        } else {
            throw new Error('Failed to load file: ' + file);
        }
    }

    _displayCircuits() {
        const text = new MyText3D("scene/sprite_sheet_white.png", [1020, 1020], [102, 102]);

        let row, col
        for (let i = 0; i < this.circuits.length && i < 6; i++) {
            row = Math.floor(i / 2)
            col = i % 2

            const planeCircuitGeometry = new THREE.PlaneGeometry(800, 150);
            const planeCircuitMaterial = new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.5 });
            const planeCircuit = new THREE.Mesh(planeCircuitGeometry, planeCircuitMaterial);
    
            const circuitName = text.transformString(this.circuits[i].name, [800, 150]);
            planeCircuit.add(circuitName);
            circuitName.position.set(-200, 0, 1);

            planeCircuit.position.set(-500 + col * 1000, 150 - row * 200, 0);
            this.scene.add(planeCircuit);
        }
    }
}

export { ChooseCircuitState }