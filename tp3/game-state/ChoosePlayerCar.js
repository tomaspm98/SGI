import {MyGameState} from "./MyGameState";

class ChoosePlayerCar extends MyGameState{
    constructor(gameStateManager, stateInfo) {
        super();
        this.stateInfo = stateInfo;
    }

    _createScene(){
    }

    _createCameras() {
    }


}

export {ChoosePlayerCar}