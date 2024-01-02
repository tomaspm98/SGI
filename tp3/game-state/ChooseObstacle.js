import {MyGameState} from "./MyGameState.js";
import {MyCircuit} from "../circuit/MyCircuit.js";
import {openJSON} from "../utils.js";
import {MyVehicle} from "../vehicle/MyVehicle.js";
import {MyPicking} from "../MyPicking.js";

class ChooseObstacle extends MyGameState {
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo);
        this.name = "chooseOpponentCar";
        this.picking = new MyPicking([], 0, 50, this.getActiveCamera(), this.handlePicking.bind(this), this.resetPickedObject.bind(this), ["pointerdown", "pointermove"]);
    }

    createScene() {
        this.circuit = this.stateInfo.circuit;
        this.scene = this.circuit.scene;
    }

    createCameras() {
        this.cameras = this.circuit.cameras
        this.activeCameraName = 'parkingLotCam3'
    }

    handlePicking(object, event) {
    }

    resetPickedObject(object) {

    }


    _createDocumentListeners() {
        this.listeners.push({
            type: 'keydown',
            handler: this.keyHandler.bind(this)
        })
    }

    keyHandler(event) {

    }

    reset() {

    }
}

export {ChooseObstacle}