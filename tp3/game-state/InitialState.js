import {MyGameState} from "./MyGameState.js";
import {MyText3D} from "../MyText3D.js";
import * as THREE from 'three';

class InitialState extends MyGameState {
    /**
     * Constructs an instance of InitialState.
     * @param {MyGameStateManager} gameStateManager - The game state manager.
     * @param {Object} stateInfo - Additional information for the state.
     */
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo);
        this.name = "initial";
    }

    /**
     * Creates the scene for InitialState.
     */
    createScene() {
        const planeGeometry = new THREE.PlaneGeometry(1920, 1080); // Adjust size as needed
        const wallpaper = new THREE.TextureLoader().load("scene/wallpaper.jpg")
        const planeMaterial = new THREE.MeshBasicMaterial({map: wallpaper});
        const interfacePlane = new THREE.Mesh(planeGeometry, planeMaterial);
        
        const author1Mesh = MyGameState.textWhite.transformString("Daniel Rodrigues", [50, 50]);
        const author2Mesh = MyGameState.textWhite.transformString("Tomas Maciel", [50, 50]);

        author1Mesh.position.set(550, -350, 1);
        author2Mesh.position.set(550, -400, 1);

        const feupLogo = new THREE.TextureLoader().load("scene/feup_logo.png");
        const feupLogoGeometry = new THREE.PlaneGeometry(300, 100);
        const feupLogoMaterial = new THREE.MeshBasicMaterial({map: feupLogo, transparent: true});
        const feupLogoMesh = new THREE.Mesh(feupLogoGeometry, feupLogoMaterial);
        feupLogoMesh.position.set(675, -250, 1);

        const f1Logo = new THREE.TextureLoader().load("scene/f1_logo.png");
        const f1LogoGeometry = new THREE.PlaneGeometry(800, 150);
        const f1LogoMaterial = new THREE.MeshBasicMaterial({map: f1Logo, transparent: true});
        const f1LogoMesh = new THREE.Mesh(f1LogoGeometry, f1LogoMaterial);
        f1LogoMesh.position.set(-450, 300, 1);

        const startText = MyGameState.textWhite.transformString("(Press ENTER to start)", [50, 50]);
        startText.position.set(-300, -400, 1);

        setInterval(() => {
            startText.visible = !startText.visible;
        }, 500);

        this.scene = new THREE.Scene();
        this.scene.add(interfacePlane);
        this.scene.add(author1Mesh);
        this.scene.add(author2Mesh);
        this.scene.add(feupLogoMesh);
        this.scene.add(f1LogoMesh);
        this.scene.add(startText);
    }

    /**
     * Creates the cameras for InitialState.
     */
    createCameras() {
        this.cameras = [];

        const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera1.position.set(0, 0, 600);
        
        camera1.name = "Perspective";
        camera1.locked = true;
        
        this.cameras[camera1.name] = camera1;
        this.activeCameraName = "Perspective";
    }
    
    /**
     * Creates the lights for InitialState.
     */
    _createDocumentListeners() {
        this.listeners.push({type: "keypress", handler: this.handleKeyPress.bind(this)})
    }

    /**
     * Handles key press events.
     */
    handleKeyPress(event) {
        if (event.code === "Enter") {
            this.gameStateManager.changeState({name: "chooseCircuit"});
        }
    }
}

export {InitialState};