import {MyGameState} from "./MyGameState.js";
import {MyText3D} from "../MyText3D.js";
import {MyPicking} from "../MyPicking.js";
import * as THREE from 'three';

class ConfigRaceState extends MyGameState {
    /**
     * Constructs an instance of ConfigRaceState.
     * @param {MyGameStateManager} gameStateManager - The game state manager.
     * @param {Object} stateInfo - Additional information for the state.
     */
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo);
        this.name = "configRace";

        this.picking = new MyPicking([], 0, 2000, this.getActiveCamera(), this.handlePicking.bind(this), this.resetPickedObject.bind(this), ["pointerdown", "pointermove"]);

        this.playerName = ""
        this.difficulty = null

        this._createGoBack();
        this._displayCircuitName()
        this._displayDifficulty()
        this._createNext()
    }
    /**
     * Creates the scene for ConfigRaceState.
     */
    createScene() {
        const planeGeometry = new THREE.PlaneGeometry(1920, 1080); // Adjust size as needed
        const wallpaper = new THREE.TextureLoader().load("scene/wallpaper.jpg")
        const planeMaterial = new THREE.MeshBasicMaterial({map: wallpaper});
        const interfacePlane = new THREE.Mesh(planeGeometry, planeMaterial);

        const title = MyGameState.textRed.transformString("Race Configuration", [150, 150]);
        title.position.set(-450, 350, 0);

        const circuitText = MyGameState.textWhite.transformString("Circuit: ", [150, 150]);
        circuitText.position.set(-825, 225, 0);

        const playerText = MyGameState.textWhite.transformString("Player: ", [150, 150]);
        playerText.position.set(-825, 100, 0);

        const difficultyText = MyGameState.textWhite.transformString("Difficulty: ", [150, 150]);
        difficultyText.position.set(-825, -25, 0);

        this.scene = new THREE.Scene();
        this.scene.add(interfacePlane);
        this.scene.add(title);
        this.scene.add(circuitText);
        this.scene.add(playerText);
        this.scene.add(difficultyText);
    }

    /**
     * Displays the circuit name.
     */
    _displayCircuitName() {
        const circuitName = MyGameState.textWhite.transformString(this.stateInfo.circuitName, [150, 150]);
        circuitName.position.set(-300, 225, 0);

        this.scene.add(circuitName);
    }

    /**
     * Displays the player name.
     * @param {*} name - The player name.
     */
    _displayPlayerName(name) {
        for (const child of this.scene.children) {
            if (child.name === "playerName") {
                this.scene.remove(child)
                break
            }
        }

        const playerName = MyGameState.textWhite.transformString(this.playerName, [150, 150]);
        playerName.position.set(-300, 100, 0);
        playerName.name = "playerName"

        this.scene.add(playerName);
    }

    /**
     * Displays the difficulty options.
     */
    _displayDifficulty() {
        const easyText = MyGameState.textWhite.transformString("Easy", [150, 150]);
        easyText.position.set(-800, -150, 1);

        const rectangleMaterial = new THREE.MeshBasicMaterial({color: "#000000", transparent: true, opacity: 0.25});

        const easyRectangleGeometry = new THREE.PlaneGeometry(300, 125);
        const easyRectangle = new THREE.Mesh(easyRectangleGeometry, rectangleMaterial.clone());
        easyRectangle.position.set(-750, -160, 0);
        easyRectangle.difficulty = "easy"


        const mediumText = MyGameState.textWhite.transformString("Medium", [150, 150]);
        mediumText.position.set(-400, -150, 1);

        const mediumRectangleGeometry = new THREE.PlaneGeometry(400, 125);
        const mediumRectangle = new THREE.Mesh(mediumRectangleGeometry, rectangleMaterial.clone());
        mediumRectangle.position.set(-300, -160, 0);
        mediumRectangle.difficulty = "medium"

        const hardText = MyGameState.textWhite.transformString("Hard", [150, 150]);
        hardText.position.set(75, -150, 1);

        const hardRectangleGeometry = new THREE.PlaneGeometry(300, 125);
        const hardRectangle = new THREE.Mesh(hardRectangleGeometry, rectangleMaterial.clone());
        hardRectangle.position.set(125, -160, 0);
        hardRectangle.difficulty = "hard"

        this.scene.add(easyRectangle);
        this.scene.add(mediumRectangle);
        this.scene.add(hardRectangle);
        this.scene.add(easyText);
        this.scene.add(mediumText);
        this.scene.add(hardText);

        this.picking.addPickableObject(easyRectangle)
        this.picking.addPickableObject(mediumRectangle)
        this.picking.addPickableObject(hardRectangle)
    }

    /**
     * Creates the "Next" button.
     */
    _createNext() {
        const nextGeometry = new THREE.PlaneGeometry(275, 125);
        const nextMaterial = new THREE.MeshBasicMaterial({color: "#000000", transparent: true, opacity: 0.5});
        const next = new THREE.Mesh(nextGeometry, nextMaterial);
        next.name = "next"
        const nextText = MyGameState.textWhite.transformString("Next", [150, 150])

        next.position.set(750, -350, 0)
        nextText.position.set(700, -340, 0)

        this.picking.addPickableObject(next)
        this.scene.add(next)
        this.scene.add(nextText)
    }

    /**
     * Creates the cameras for ConfigRaceState.
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
     * Handles picking events for interactive objects.
     * @param {Object} object - The picked object.
     * @param {PointerEvent} event - The pointer event.
     */
    handlePicking(object, event) {
        object.material.opacity = 0.7;
        if (object.name === "goBack" && event.type === "pointerdown") {
            this.gameStateManager.goBack();
        } else if (object.difficulty && event.type === "pointerdown") {
            this.picking.clearPickedHelpers()
            this.picking.addPickedHelper(object)
            this.difficulty = object.difficulty
        } else if (object.name === "next" && event.type === "pointerdown" && this.playerName !== "" && this.difficulty) {
            this.gameStateManager.changeState({
                name: "choosePlayerCar",
                circuitPath: this.stateInfo.circuitPath,
                circuitName: this.stateInfo.circuitName,
                playerName: this.playerName,
                difficulty: this.difficulty
            })
        }
    }

    /**
     * Resets the appearance of the picked object.
     * @param {Object} object - The picked object.
     */
    resetPickedObject(object) {
        object.material.opacity = 0.25;
    }

    /**
     * Creates the "Go Back" button in the scene.
     */
    _createGoBack() {
        const text = new MyText3D("scene/sprite_sheet_white.png", [1020, 1020], [102, 102]);

        const goBackGeometry = new THREE.PlaneGeometry(100, 100);
        const goBackMaterial = new THREE.MeshBasicMaterial({color: "#000000", transparent: true, opacity: 0.5});
        const goBack = new THREE.Mesh(goBackGeometry, goBackMaterial);
        goBack.name = "goBack"
        const goBackText = text.transformChar("<", [200, 200])

        goBack.position.set(-850, 350, 0)
        goBackText.position.set(-790, 360, 0)

        this.picking.addPickableObject(goBack)
        this.scene.add(goBack)
        this.scene.add(goBackText)
    }

    /**
     * Handles text input for player name.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    handleTextInput(event) {
        if (event.code === "Backspace" && this.playerName.length > 0) {
            this.playerName = this.playerName.slice(0, -1)
            this._displayPlayerName(this.playerName)
        } else if (event.key.length === 1 && event.key.charCodeAt(0) >= 32 && event.key.charCodeAt(0) <= 126) {
            this.playerName += event.key
            this._displayPlayerName(this.playerName)
        }
    }

    /**
     * Creates document listeners for key events.
     */
    _createDocumentListeners() {
        this.listeners.push({type: "keydown", handler: this.handleTextInput.bind(this)})
    }
}

export {ConfigRaceState}