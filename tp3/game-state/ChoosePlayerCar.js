import { MyGameState } from "./MyGameState.js";
import { MyCircuit } from "../circuit/MyCircuit.js";

class ChoosePlayerCar extends MyGameState {
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo);
        this.name = "choosePlayerCar";
    }

    _createScene() {
        this.circuit = MyCircuit.create(this.stateInfo.circuitPath);
        this.scene = this.circuit.scene;
        console.log(this.scene)
    }

    _createCameras() {
        this.cameras = this.circuit.cameras
        this.activeCameraName = 'parkingLotCam1'
    }


}

export { ChoosePlayerCar }