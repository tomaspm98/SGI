import { MyGameState } from "./MyGameState.js";
import { MyPicking } from "../MyPicking.js";
import * as THREE from 'three';

class ChooseCircuitState extends MyGameState {
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo);
        this.name = "chooseMap";
        
        this.circuits = this._openJSON(stateInfo.path);
        this.picking = new MyPicking([], 0, 2000, this.getActiveCamera(), this.handlePicking.bind(this), this.resetPickedObject.bind(this), ["pointerdown", "pointermove"]);

        this._displayCircuits();
        this._createGoBack();
    }

    _createScene() {
        const planeGeometry = new THREE.PlaneGeometry(1920, 1080); // Adjust size as needed
        const wallpaper = new THREE.TextureLoader().load("scene/wallpaper.jpg")
        const planeMaterial = new THREE.MeshBasicMaterial({ map: wallpaper });
        const interfacePlane = new THREE.Mesh(planeGeometry, planeMaterial);
        
        const title = MyGameState.textRed.transformString("Choose a map", [150, 150]);
        title.position.set(-250, 350, 0);

        this.scene = new THREE.Scene();
        this.scene.add(interfacePlane);
        this.scene.add(title);
    }

    _createCameras() {
        this.cameras = [];

        const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera1.position.set(0, 0, 600);
        
        camera1.name = "Perspective";
        camera1.locked = true;
        
        this.cameras[camera1.name] = camera1;
        this.activeCameraName = "Perspective";
    }

    _openJSON(file) {
        let request = new XMLHttpRequest();
        request.open('GET', file, false);
        request.send(null);

        if (request.status === 200) {
            return JSON.parse(request.responseText);
        } else {
            throw new Error('Failed to load file: ' + file);
        }
    }

    _displayCircuits() {
        let row, col
        for (let i = 0; i < this.circuits.length && i < 6; i++) {
            row = Math.floor(i / 2)
            col = i % 2

            const planeCircuitGeometry = new THREE.PlaneGeometry(800, 150);
            const planeCircuitMaterial = new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.5 });
            const planeCircuit = new THREE.Mesh(planeCircuitGeometry, planeCircuitMaterial);
            planeCircuit.name = this.circuits[i].name;
            planeCircuit.path = this.circuits[i].path;
            planeCircuit.position.set(-500 + col * 1000, 150 - row * 200, 0);
            this.picking.addPickableObject(planeCircuit);

            const circuitName = MyGameState.textWhite.transformString(this.circuits[i].name, [100, 100]);
            circuitName.position.set(-800 + col * 1000, 150 - row * 200, 0)

            this.scene.add(planeCircuit);
            this.scene.add(circuitName)
        }
    }

    handlePicking(object, event) {
        if (event.type === "pointerdown") {
            if (object.name === "goBack") {
                this.gameStateManager.goBack()
            } else {
                this.gameStateManager.changeState({ name: "configRace", circuitPath: object.path, circuitName: object.name })
            }
        } else if (event.type === "pointermove") {
            object.material.opacity = 0.85;
        }
    }

    resetPickedObject(object) {
        object.material.opacity = 0.5;
    }

    _createGoBack() {
        const goBackGeometry = new THREE.PlaneGeometry(100, 100);
        const goBackMaterial = new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.5 });
        const goBack = new THREE.Mesh(goBackGeometry, goBackMaterial);
        goBack.name = "goBack"
        const goBackText = MyGameState.textWhite.transformChar("<", [200, 200])

        goBack.position.set(-850, 350, 0)
        goBackText.position.set(-790, 360, 0)

        this.picking.addPickableObject(goBack)
        this.scene.add(goBack)
        this.scene.add(goBackText)
    }
}

export { ChooseCircuitState }