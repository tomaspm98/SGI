import {MyGameState} from "./MyGameState.js";
import * as THREE from 'three'
import {MyFirework} from "../MyFirework.js";
import {MyPicking} from "../MyPicking.js";

class ResultState extends MyGameState {
    /**
     * Constructs an instance of ResultState.
     * @param {MyGameStateManager} gameStateManager - The game state manager.
     * @param {Object} stateInfo - Information about the state.
     */
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo)
        this.name = "result"
        this.picking = new MyPicking([], 0, 50, this.getActiveCamera(), this.handlePicking.bind(this), this.resetPickedObject.bind(this), ["pointerdown", "pointermove"])
        this.displayResults()
        this.fireworks = []
        this.displayCars()
    }

    /**
     * Creates the scene for the result state.
     */
    createScene() {
        this.scene = this.stateInfo.circuit.scene
    }

    /**
     * Creates cameras for the result state.
     */
    createCameras() {
        this.cameras = this.stateInfo.circuit.cameras
        this.activeCameraName = 'podium'
    }

    /**
     * Displays the race results and podium information.
     */
    displayResults() {
        const activeCamera = this.getActiveCamera()

        const resultsInfo = new THREE.Group()
        resultsInfo.name = 'results'

        const title = MyGameState.textRed.transformString("Results", [0.3, 0.3])
        title.position.set(-0.2, 0.6, 0)
        resultsInfo.add(title)

        const [first, second] = this.displayPodium([0.15, 0.15])

        first.position.set(-1.4, 0.4, 0)
        resultsInfo.add(first)

        second.position.set(-1.4, 0.2, 0)
        resultsInfo.add(second)

        const circuit = MyGameState.textWhite.transformString(`Circuit: ${this.stateInfo.circuitName}`, [0.15, 0.15])
        const difficulty = MyGameState.textWhite.transformString(`Difficulty: ${this.stateInfo.difficulty}`, [0.15, 0.15])

        circuit.position.set(-1.4, 0, 0)
        resultsInfo.add(circuit)

        difficulty.position.set(-1.4, -0.2, 0)
        resultsInfo.add(difficulty)

        const restartText = MyGameState.textWhite.transformString("Restart", [0.15, 0.15])
        const restart = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.15), new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.3
        }))

        restartText.position.set(0.3, -0.6, 0.01)
        resultsInfo.add(restartText)

        restart.position.set(0.45, -0.61, 0)
        restart.name = 'restart'
        this.picking.addPickableObject(restart)
        resultsInfo.add(restart)

        const exitText = MyGameState.textWhite.transformString("Exit", [0.15, 0.15])
        const exit = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.15), new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.3
        }))

        exitText.position.set(-0.3, -0.6, 0.01)
        resultsInfo.add(exitText)

        exit.position.set(-0.25, -0.61, 0)
        exit.name = 'exit'
        this.picking.addPickableObject(exit)
        resultsInfo.add(exit)

        resultsInfo.position.set(0, 0, -1)
        activeCamera.clear()
        activeCamera.add(resultsInfo)
    }

    /**
     * Displays podium positions based on race results.
     * @param {Array} size - Size of the podium positions.
     * @returns {Array} - First and second podium positions.
     */
    displayPodium(size) {
        let player, opponent
        const playerTime = this._convertThreeTime(this.stateInfo.playerTime)
        const opponentTime = this._convertThreeTime(this.stateInfo.opponentTime)

        player = MyGameState.textWhite.transformString(`${this.stateInfo.playerTime < this.stateInfo.opponentTime ? "1" : "2"}. ${this.stateInfo.playerName} ${playerTime[0]}' ${playerTime[1]}'' ${playerTime[2]}''' (${this.stateInfo.playerVehicle})`, size)
        opponent = MyGameState.textWhite.transformString(`${this.stateInfo.playerTime > this.stateInfo.opponentTime ? "1" : "2"}. Opponent ${opponentTime[0]}' ${opponentTime[1]}'' ${opponentTime[2]}''' (${this.stateInfo.opponentVehicle})`, size)

        if (this.stateInfo.playerTime > this.stateInfo.opponentTime) {
            return [opponent, player]
        }
        return [player, opponent]
    }

    /**
     * Converts time in milliseconds to an array of minutes, seconds, and milliseconds.
     * @param {number} time - Time in milliseconds.
     * @returns {Array} - Array of minutes, seconds, and milliseconds.
     */
    _convertThreeTime(time) {
        const minutes = Math.floor(time / 60000)
        const seconds = Math.floor((time / 1000) % 60)
        const milliseconds = Math.floor(time % 1000)
        return [minutes, seconds, milliseconds]
    }

    /**
     * Updates the result state, adding fireworks to the scene.
     */
    update() {
        if (Math.random() < 0.05) {
            this.fireworks.push(new MyFirework(this.scene, 10, 120))
        }


        for (let i = 0; i < this.fireworks.length; i++) {
            // is firework finished?
            if (this.fireworks[i].done) {
                // remove firework
                this.fireworks.splice(i, 1)
                continue
            }
            // otherwise upsdate  firework
            this.fireworks[i].update()
        }
    }

    /**
     * Handles object picking events.
     * @param {Object} object - The picked object.
     * @param {Object} event - The picking event.
     */
    handlePicking(object, event) {
        if (event.type === "pointermove") {
            object.material.color.setHex(0x005ba6)
        } else if (event.type === "pointerdown" && object.name === "restart") {
            this.gameStateManager.goBackToAndReplace("race", {
                name: "race",
                circuit: this.stateInfo.circuit,
                vehicles: this.stateInfo.vehicles,
                playerVehicle: this.stateInfo.playerVehicle,
                opponentVehicle: this.stateInfo.opponentVehicle,
                circuitName: this.stateInfo.circuitName,
                playerName: this.stateInfo.playerName,
                difficulty: this.stateInfo.difficulty,
            })
        } else if (event.type === "pointerdown" && object.name === "exit") {
            this.gameStateManager.goBackTo({name: "initial"})
        }
    }

    /**
     * Resets the result state.
     */
    reset() {
        for (const firework of this.fireworks) {
            firework.reset()
        }
        this.getActiveCamera().clear()
        this.scene.remove(this.vehiclePlayer.mesh)
        this.scene.remove(this.opponentPlayer.mesh)
    }

    /**
     * Resets the material color when picking is finished.
     * @param {Object} object - The picked object.
     */
    resetPickedObject(object) {
        object.material.color.setHex(0x000000)
    }

    /**
     * Displays cars on the podium.
     */
    displayCars(){

        const slots = this.stateInfo.circuit.slots.filter(slot => slot.object === "podium")
        if (slots.length < 2) {
            throw new Error("Not enough slots")
        }

        this.vehiclePlayer = this.stateInfo.vehicles[this.stateInfo.playerVehicle]
        this.opponentPlayer = this.stateInfo.vehicles[this.stateInfo.opponentVehicle]

        console.log(this.vehiclePlayer)

        this.vehiclePlayer.setPosition({x: slots[0].position[0], y: slots[0].position[1], z: slots[0].position[2]})
        this.vehiclePlayer.setRotation(slots[0].rotation)

        this.opponentPlayer.setPosition({x: slots[1].position[0], y: slots[1].position[1], z: slots[1].position[2]})
        this.opponentPlayer.setRotation(slots[1].rotation)

        this.scene.add(this.vehiclePlayer.mesh)
        this.scene.add(this.opponentPlayer.mesh)
    }
}

export {ResultState}