import { MyGameState } from "./MyGameState.js";
import { MyCircuit } from "../circuit/MyCircuit.js";
import { openJSON } from "../utils.js";
import { MyVehicle } from "../vehicle/MyVehicle.js";
import { MyPicking } from "../MyPicking.js";

class ChooseOpponentCar extends MyGameState {
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo);
        this.name = "chooseOpponentCar";
        this.picking = new MyPicking([], 0, 50, this.getActiveCamera(), this.handlePicking.bind(this), this.resetPickedObject.bind(this), ["pointerdown", "pointermove"]);
        this._displayVehicles()
    }

    _createScene() {
        this.circuit = this.stateInfo.circuit;
        this.scene = this.circuit.scene;
        this.vehicles = this.stateInfo.vehicles;
    }

    _createCameras() {
        this.cameras = this.circuit.cameras
        this.activeCameraName = 'parkingLotCam2'
    }


    _displayVehicles() {
        const slotsAvailable = this.circuit.slots.filter(slot => slot.object === "parkingLot2")
        let vehicleArray = Object.values(this.vehicles)
        for (let i = 0; i < slotsAvailable.length && i < vehicleArray.length; i++) {
            const vehicle = vehicleArray[i]
            const slot = slotsAvailable[i]
            vehicle.setRotation(slot.rotation)
            vehicle.setPosition({ x: slot.position[0], y: slot.position[1], z: slot.position[2] })
            this.picking.addPickableObject(vehicle.mesh)
            this.scene.add(vehicle.mesh)
        }
    }

    _removeVehiclesScene() {
        for (const vehicle of Object.values(this.vehicles)) {
            this.scene.remove(vehicle.mesh)
        }
    }

    handlePicking(object, event) {
        if (event.type === "pointerdown") {
            this._removeVehiclesScene()
            console.log("STARTING RACE")
        } else if (event.type === "pointermove") {
            // It is necessary to traverse the object's children
            // Because the object itself is a group
            object.traverse(child => {
                if (child.material) {
                    // To save the original color of the object
                    // To later restore it when the object is no longer picked
                    if(!child.material.originalColor){
                        child.material.originalColor = child.material.color.clone()
                    }
                    child.material.color.setHex(0x005ba6)
                }
            })
        }
    }

    resetPickedObject(object) {
        object.traverse(child => {
            if (child.material) {
                child.material.color.set(child.material.originalColor)
                child.material.originalColor = null
            }
        })
    }
}

export { ChooseOpponentCar }