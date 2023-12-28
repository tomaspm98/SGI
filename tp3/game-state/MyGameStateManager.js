import { InitialState } from "./InitialState.js";
import { ChooseCircuitState } from "./ChooseCircuitState.js";
import {ConfigRaceState} from "./ConfigRaceState.js";

class MyGameStateManager {
    constructor(app) {
        this.app = app;
        this.actualState = this.createNewState({ name: "initial"});
        this.actualState.startDocumentListeners();
        this.savedStates = [];
        this.updateApp()
    }

    changeState(stateInfo) {
        this.actualState.stopDocumentListeners();
        this.savedStates.push(this.actualState);
        
        this.actualState = this.createNewState(stateInfo);
        this.actualState.startDocumentListeners();
        
        this.updateApp()
    }

    goBack() {
        this.actualState.stopDocumentListeners();

        this.actualState = this.savedStates.pop();
        this.actualState.startDocumentListeners();

        this.updateApp()
    }

    /*goBackTo(stateInfo) {
        while (this.actualState.name !== stateInfo.name) {
            if (this.savedStates.length === 0) {
                throw new Error("State not found");
            }
            this.goBack();
        }
    }*/

    createNewState(stateInfo) {
        switch (stateInfo.name) {
            case "initial":
                return new InitialState(this);
            case "chooseCircuit":
                return new ChooseCircuitState(this, "scene/circuits.json");
            case "configRace":
                return new ConfigRaceState(this, stateInfo);
            case "choosePlayerCar":
                console.log("choosePlayerCar");
                break;
            default:
                throw new Error("Invalid state name");
        }
    }
    
    updateApp(){
        this.app.scene = this.actualState.scene
        this.app.cameras = this.actualState.cameras
        this.updateActiveCamera()
    }
    
    updateActiveCamera() {
        this.app.activeCameraName = this.actualState.activeCameraName
        this.app.activeCamera = this.app.cameras[this.app.activeCameraName]
    }
}

export { MyGameStateManager }