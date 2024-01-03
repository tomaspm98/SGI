import {MyGameState} from "./MyGameState.js";
import {MyCircuit} from "../circuit/MyCircuit.js";
import {openJSON} from "../utils.js";
import {MyVehicle} from "../vehicle/MyVehicle.js";
import {MyPicking} from "../MyPicking.js";

class ChooseOpponentCar extends MyGameState {
    /**
     * Constructs an instance of ChooseOpponentCar.
     * @param {MyGameStateManager} gameStateManager - The game state manager.
     * @param {Object} stateInfo - Additional information for the state.
     */
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo);
        this.name = "chooseOpponentCar";
        this.picking = new MyPicking([], 0, 50, this.getActiveCamera(), this.handlePicking.bind(this), this.resetPickedObject.bind(this), ["pointerdown", "pointermove"]);
        this._displayVehicles()
    }

    /**
     * Creates the scene for ChooseOpponentCar.
     */
    createScene() {
        this.circuit = this.stateInfo.circuit;
        this.scene = this.circuit.scene;
        this.vehicles = this.stateInfo.vehicles;
    }

    /**
     * Creates cameras for ChooseOpponentCar.
     */
    createCameras() {
        this.cameras = this.circuit.cameras
        this.activeCameraName = 'parkingLotCam2'
    }


     /**
     * Displays available opponent vehicles in the scene.
     * Picks up vehicles for selection.
     */
    _displayVehicles() {
        const slotsAvailable = this.circuit.slots.filter(slot => slot.object === "parkingLot2")
        let vehicleArray = Object.values(this.vehicles)
        vehicleArray = vehicleArray.filter(vehicle => vehicle.name !== this.stateInfo.playerVehicle)

        for (let i = 0; i < slotsAvailable.length && i < vehicleArray.length; i++) {
            const vehicle = vehicleArray[i]
            const slot = slotsAvailable[i]
            vehicle.setRotation(slot.rotation)
            vehicle.setPosition({x: slot.position[0], y: slot.position[1], z: slot.position[2]})
            this.picking.addPickableObject(vehicle.mesh)
            this.scene.add(vehicle.mesh)
        }
    }

    /**
     * Handles object picking events.
     * @param {Object} object - The picked object.
     * @param {PointerEvent} event - The pointer event.
     */
    handlePicking(object, event) {
        if (event.type === "pointerdown") {
            this.gameStateManager.changeState({
                name: "race",
                circuit: this.circuit,
                vehicles: this.vehicles,
                playerVehicle: this.stateInfo.playerVehicle,
                opponentVehicle: object.name,
                circuitName: this.stateInfo.circuitName,
                playerName: this.stateInfo.playerName,
                difficulty: this.stateInfo.difficulty
            })
        } else if (event.type === "pointermove") {
            // It is necessary to traverse the object's children
            // Because the object itself is a group
            object.traverse(child => {
                if (child.material) {
                    // To save the original color of the object
                    // To later restore it when the object is no longer picked
                    if (!child.material.originalColor) {
                        child.material.originalColor = child.material.color.clone()
                    }
                    child.material.color.setHex(0x005ba6)
                }
            })
        }
    }

    /**
     * Resets the appearance of the picked object.
     * @param {Object} object - The picked object.
     */
    resetPickedObject(object) {
        object.traverse(child => {
            if (child.material) {
                child.material.color.set(child.material.originalColor)
                child.material.originalColor = null
            }
        })
    }


    /**
     * Creates document listeners for key events.
     */
    _createDocumentListeners() {
        this.listeners.push({
            type: 'keydown',
            handler: this.keyHandler.bind(this)
        })
    }

    /**
     * Handles key events for navigation.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    keyHandler(event) {
        if (event.code === 'KeyB' && event.type === 'keydown') {
            this.gameStateManager.goBack()
        }
    }

    /**
     * Resets the ChooseOpponentCar state.
     */
    reset() {
        for (const vehicle of Object.values(this.vehicles)) {
            this.scene.remove(vehicle.mesh)
        }
    }
}

export {ChooseOpponentCar}