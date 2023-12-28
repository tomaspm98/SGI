import { MyGameState } from "./MyGameState.js";
import { MyText3D } from "../MyText3D.js";
import { MyPicking } from "../MyPicking.js";
import * as THREE from 'three';

class ChooseCircuitState extends MyGameState {
    constructor(gameStateManager, pathToJSON) {
        super(gameStateManager);

        this.circuits = this._openJSON(pathToJSON);
        this.name = "chooseMap";

        this.picking = new MyPicking([], 0, 2000, this.cameras[0].camera, this._handlePicking, ["pointerdown", "pointermove"]);
        this.lastPickedObject = null

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
            planeCircuit.name = this.circuits[i].name;
            planeCircuit.path = this.circuits[i].path;
            planeCircuit.position.set(-500 + col * 1000, 150 - row * 200, 0);
            this.picking.addPickableObject(planeCircuit);

            const circuitName = text.transformString(this.circuits[i].name, [800, 150]);
            circuitName.position.set(-700 + col * 1000, 150 - row * 200, 0)
            
            this.scene.add(planeCircuit);
            this.scene.add(circuitName)
        }
    }

    _handlePicking(intersects, event) {
        if (intersects.length > 0) {
            if (event.type === "pointerdown") {
                console.log(intersects[0].object.name)
                console.log(intersects[0].object.path)
                //this._changeState({ name: "game", path: intersects[0].object.path });
            } else if (event.type === "pointermove") {
                intersects[0].object.material.opacity = 0.85;
            }
            this.lastPickedObject = intersects[0].object
        } else {
            if (this.lastPickedObject) {
                this.lastPickedObject.material.opacity = 0.5
                this.lastPickedObject = null
            }
        }
    }


}

export { ChooseCircuitState }