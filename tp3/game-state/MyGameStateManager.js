import { InitialState } from "./InitialState.js";
import { ChooseCircuitState } from "./ChooseCircuitState.js";

class MyGameStateManager {
    constructor(app) {
        this.actualState = this.createNewState({ name: "chooseCircuit" });
        this.savedStates = [];
        this.app = app;
    }

    changeState(stateInfo) {
        this.savedStates.push(this.actualState);
        this.actualState = this.createNewState(stateInfo);
        this.app.updateState()
    }

    changeActiveCamera() {
        this.app.updateActiveCamera();
    }

    goBack() {
        this.actualState = this.savedStates.pop();
    }

    goBackTo(stateInfo) {
        while (this.actualState.name !== stateInfo.name) {
            if (this.savedStates.length === 0) {
                throw new Error("State not found");
            }
            this.goBack();
        }
    }

    createNewState(stateInfo) {
        switch (stateInfo.name) {
            case "initial":
                return new InitialState(this);
            case "chooseCircuit":
                return new ChooseCircuitState(this, "../scene/circuits.json");
            default:
                throw new Error("Invalid state name");
        }
    }
}

export { MyGameStateManager }