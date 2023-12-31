import { InitialState } from "./InitialState.js";
import { ChooseCircuitState } from "./ChooseCircuitState.js";
import { ConfigRaceState } from "./ConfigRaceState.js";
import { ChoosePlayerCar } from "./ChoosePlayerCar.js";
import { ChooseOpponentCar } from "./ChooseOpponentCar.js";
import { RaceState } from "./RaceState.js";
import { ResultState } from "./ResultState.js";

class MyGameStateManager {
    constructor(app) {
        this.app = app;
        this.actualState = this.createNewState({ name: "choosePlayerCar", circuitPath: "scene/circuits/circuitTest.xml", difficulty: "easy"});
        //this.actualState = this.createNewState({ name: "initial"});
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

    goBackTo(stateInfo) {
        const newSavedStates = []
        for(let i = 0; i < this.savedStates.length; i++) {
            if(this.savedStates[i].name === stateInfo.name) {
                this.actualState.stopDocumentListeners();
                this.actualState = this.savedStates[i];
                this.savedStates = newSavedStates;
                this.actualState.startDocumentListeners();
                this.updateApp()
                return
            }
            newSavedStates.push(this.savedStates[i])
        }
    }

    createNewState(stateInfo) {
        switch (stateInfo.name) {
            case "initial":
                return new InitialState(this);
            case "chooseCircuit":
                return new ChooseCircuitState(this, { path: "scene/circuits.json" });
            case "configRace":
                return new ConfigRaceState(this, stateInfo);
            case "choosePlayerCar":
                return new ChoosePlayerCar(this, stateInfo);
            case "chooseOpponentCar":
                return new ChooseOpponentCar(this, stateInfo);
            case "raceState":
                return new RaceState(this, stateInfo);
            case "result":
                return new ResultState(this, stateInfo);
            default:
                throw new Error("Invalid state name");
        }
    }

    updateApp() {
        this.app.scene = this.actualState.scene
        this.app.cameras = this.actualState.cameras
        this.updateActiveCamera()
    }

    updateActiveCamera() {
        this.app.lasActiveCameraName = this.app.activeCameraName
        this.app.activeCameraName = this.actualState.activeCameraName
        this.app.activeCamera = this.app.cameras[this.app.activeCameraName]
    }
}

export { MyGameStateManager }