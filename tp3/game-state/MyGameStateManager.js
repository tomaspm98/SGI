import { InitialState } from "./InitialState.js";
import { ChooseCircuitState } from "./ChooseCircuitState.js";
import {ConfigRaceState} from "./ConfigRaceState.js";

class MyGameStateManager {
    constructor(app) {
        this.app = app;
        this.actualState = this.createNewState({ name: "configRace", circuitName: "Yas Marina", circuitPath: "scene/circuit1.json" });
        this.actualState.startDocumentListeners();
        
        this.savedStates = [];
    }

    changeState(stateInfo) {
        this.actualState.stopDocumentListeners();
        this.savedStates.push(this.actualState);
        
        this.actualState = this.createNewState(stateInfo);
        this.actualState.startDocumentListeners();
        
        this.app.updateState()
    }

    changeActiveCamera() {
        this.app.updateActiveCamera();
    }

    goBack() {
        this.actualState.stopDocumentListeners();

        this.actualState = this.savedStates.pop();
        this.actualState.startDocumentListeners();

        this.app.updateState()
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
            default:
                throw new Error("Invalid state name");
        }
    }
}

export { MyGameStateManager }