import {MyGameState} from "./MyGameState.js";
import {MyCircuit} from "../circuit/MyCircuit.js";
import {openJSON} from "../utils.js";
import {MyVehicle} from "../vehicle/MyVehicle.js";
import {MyPicking} from "../MyPicking.js";

class ChoosePlayerCar extends MyGameState {
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo);
        this.name = "choosePlayerCar";
        this.picking = new MyPicking([], 0, 50, this.getActiveCamera(), this.handlePicking.bind(this), this.resetPickedObject.bind(this), ["pointerdown", "pointermove"]);
        this._loadVehicles()
        this._displayVehicles()
    }

    _createScene() {
        this.circuit = MyCircuit.create(this.stateInfo.circuitPath);
        this.scene = this.circuit.scene;
    }

    _createCameras() {
        this.cameras = this.circuit.cameras
        this.activeCameraName = 'parkingLotCam1'
    }

    _loadVehicles() {
        this.vehicles = []
        const vehiclePaths = openJSON('scene/vehicles.json')
        for (const vehiclePath of vehiclePaths) {
            const newVehicle = MyVehicle.create(vehiclePath)
            this.vehicles[newVehicle.name] = newVehicle
        }
    }

    _displayVehicles() {
        const slotsAvailable = this.circuit.slots.filter(slot => slot.object === "parkingLot1")
        let vehicleArray = Object.values(this.vehicles)
        for (let i = 0; i < slotsAvailable.length && i < vehicleArray.length; i++) {
            const vehicle = vehicleArray[i]
            const slot = slotsAvailable[i]
            vehicle.setRotation(slot.rotation)
            vehicle.setPosition({x: slot.position[0], y: slot.position[1], z: slot.position[2]})
            this.picking.addPickableObject(vehicle.mesh)
            this.scene.add(vehicle.mesh)
        }
    }

    handlePicking(object, event) {
        if(event.type === "pointerdown") {
            //this.gameStateManager.changeState("choosePlayerCar", {vehicle: object.name})
        }else if(event.type === "pointermove"){
            console.log(object)
        }
    }
    
    resetPickedObject(object) {
    
    }
}

export {ChoosePlayerCar}