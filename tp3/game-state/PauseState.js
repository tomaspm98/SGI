import {MyGameState} from "./MyGameState.js";
import {MyPicking} from "../MyPicking.js";
import * as THREE from 'three';

class PauseState extends MyGameState {
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo);
        this.name = "pause";

        this.picking = new MyPicking([], 0, 2000, this.getActiveCamera(), this.handlePicking.bind(this), this.resetPickedObject.bind(this), ["pointerdown", "pointermove"]);

        this._createResume();
        this._createReset();
        this._createExit();
        this._createObstacle();
    }

    createScene() {
        const planeGeometry = new THREE.PlaneGeometry(1920, 1080); // Adjust size as needed
        const wallpaper = new THREE.TextureLoader().load("scene/wallpaper.jpg")
        const planeMaterial = new THREE.MeshBasicMaterial({map: wallpaper});
        const interfacePlane = new THREE.Mesh(planeGeometry, planeMaterial);

        const title = MyGameState.textRed.transformString("Pause", [150, 150]);
        title.position.set(-100, 350, 0);

        this.scene = new THREE.Scene();
        this.scene.add(interfacePlane);
        this.scene.add(title);
    }

    createCameras() {
        this.cameras = [];

        const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera1.position.set(0, 0, 600);

        camera1.name = "Perspective";
        camera1.locked = true;

        this.cameras[camera1.name] = camera1;
        this.activeCameraName = "Perspective";
    }

    handlePicking(object, event) {
        if (event.type === "pointerdown") {
            if (object.name === "resume") {
                this.gameStateManager.goBack()
            } else if (object.name === "reset") {
                this.gameStateManager.goBackToAndReplace("race", {
                    name: "race",
                    playerVehicle: this.stateInfo.playerVehicle,
                    circuit: this.stateInfo.circuit,
                    vehicles: this.stateInfo.vehicles,
                    opponentVehicle: this.stateInfo.opponentVehicle,
                    circuitName: this.stateInfo.circuitName,
                    playerName: this.stateInfo.playerName,
                    difficulty: this.stateInfo.difficulty,
                })
            } else {
                this.gameStateManager.changeState({name: "initial"})
            }
        } else if (event.type === "pointermove") {
            object.material.opacity = 0.85;
        }
    }

    resetPickedObject(object) {
        object.material.opacity = 0.5;
    }

    _createResume() {
        const resumeGeometry = new THREE.PlaneGeometry(500, 100);
        const resumeMaterial = new THREE.MeshBasicMaterial({color: "#000000", transparent: true, opacity: 0.5});
        const resume = new THREE.Mesh(resumeGeometry, resumeMaterial);
        resume.name = "resume"
        const resumeText = MyGameState.textWhite.transformString("Resume", [100, 100])

        resume.position.set(0, 150, 0)
        resumeText.position.set(-70, 155, 0)

        this.picking.addPickableObject(resume)
        this.scene.add(resume)
        this.scene.add(resumeText)
    }

    _createReset() {
        const resetGeometry = new THREE.PlaneGeometry(500, 100);
        const resetMaterial = new THREE.MeshBasicMaterial({color: "#000000", transparent: true, opacity: 0.5});
        const reset = new THREE.Mesh(resetGeometry, resetMaterial);
        reset.name = "reset"
        const resetText = MyGameState.textWhite.transformString("Reset", [100, 100])

        reset.position.set(0, 20, 0)
        resetText.position.set(-45, 25, 0)

        this.picking.addPickableObject(reset)
        this.scene.add(reset)
        this.scene.add(resetText)
    }

    _createObstacle(){
        const obstacleGeometry = new THREE.PlaneGeometry(500, 100);
        const obstacleMaterial = new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.5 });
        const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        obstacle.name = "obstacle"
        const obstacleText = MyGameState.textWhite.transformString("Obstacle", [100, 100])

        obstacle.position.set(0, -110, 0)
        obstacleText.position.set(-100, -105, 0)

        this.picking.addPickableObject(obstacle)
        this.scene.add(obstacle)
        this.scene.add(obstacleText)
    }

    _createExit(){
        const exitGeometry = new THREE.PlaneGeometry(500, 100);
        const exitMaterial = new THREE.MeshBasicMaterial({color: "#000000", transparent: true, opacity: 0.5});
        const exit = new THREE.Mesh(exitGeometry, exitMaterial);
        exit.name = "exit"
        const exitText = MyGameState.textWhite.transformString("Exit", [100, 100])

        exit.position.set(0, -240, 0)
        exitText.position.set(-30, -235, 0)

        this.picking.addPickableObject(exit)
        this.scene.add(exit)
        this.scene.add(exitText)
    }

    
}

export {PauseState}