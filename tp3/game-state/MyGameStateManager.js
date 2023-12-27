import { InitialState } from "./InitialState.js";

class MyGameStateManager {
    constructor() {
        this.actualState = this.createNewState({ name: "initial" });
        this.savedStates = [];
    }

    changeState(stateInfo) {
        this.savedStates.push(this.actualState);
        this.actualState = this.createNewState(stateInfo);
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
                return new InitialState(stateInfo);
            default:
                throw new Error("Invalid state name");
        }
    }
}

export { MyGameStateManager }