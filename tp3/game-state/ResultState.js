import { MyGameState } from "./MyGameState.js";

class ResultState extends MyGameState{
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo)
        this.name = "result"
    }

    _createScene(){
        this.scene = this.stateInfo.circuit.scene

    }

    _createCameras(){
        this.cameras = this.stateInfo.circuit.cameras
        this.activeCameraName = 'general'
    }
}

export { ResultState }