import {InitialState} from "./InitialState.js";
import {ChooseCircuitState} from "./ChooseCircuitState.js";
import {ConfigRaceState} from "./ConfigRaceState.js";
import {ChoosePlayerCar} from "./ChoosePlayerCar.js";
import {ChooseOpponentCar} from "./ChooseOpponentCar.js";
import {RaceState} from "./RaceState.js";
import {ResultState} from "./ResultState.js";
import {PauseState} from "./PauseState.js";
import {ChooseObstacle} from "./ChooseObstacle.js";

class MyGameStateManager {
    /**
     * Constructs an instance of MyGameStateManager.
     * @param {MyApp} app - The main application.
     */
    constructor(app) {
        this.app = app;
        //this.actualState = this.createNewState({name: "initial"});
        this.actualState = this.createNewState({ name: "choosePlayerCar", circuitPath: "scene/circuits/circuitTest.xml", difficulty: "easy", playerName: "Daniel Rodrigues", circuitName: "Yas Marina"});
        this.actualState.startDocumentListeners();
        this.savedStates = [];
        this.updateApp()
    }

    /**
     * Changes the current game state.
     * @param {Object} stateInfo - Information about the new state.
     */
    changeState(stateInfo) {
        this.actualState.reset()
        this.actualState.stopDocumentListeners();
        this.savedStates.push(this.actualState);

        this.actualState = this.createNewState(stateInfo);
        this.actualState.startDocumentListeners();

        this.updateApp()
    }

    /**
     * Goes back to the previous game state.
     */
    goBack() {
        this.actualState.stopDocumentListeners();
        this.actualState.reset()
        
        this.actualState = this.savedStates.pop();
        this.actualState.startDocumentListeners();
        this.actualState.unpause()

        this.updateApp()
    }

    /**
     * Goes back to a specific game state.
     * @param {Object} stateInfo - Information about the target state.
     */
    goBackTo(stateInfo) {
        const newSavedStates = []
        for (let i = 0; i < this.savedStates.length; i++) {
            if (this.savedStates[i].name === stateInfo.name) {
                this.actualState.reset()
                this.actualState.stopDocumentListeners();
                this.actualState = this.savedStates[i];
                this.savedStates = newSavedStates;
                this.actualState.startDocumentListeners();
                this.actualState.unpause()
                this.updateApp()
                return
            }
            newSavedStates.push(this.savedStates[i])
        }
        throw new Error("State not found on stack")
    }

    /**
     * Goes back to a specific game state and replaces it with a new state.
     * @param {string} nameState - The name of the state to go back to.
     * @param {Object} newStateInfo - Information about the new state.
     */
    goBackToAndReplace(nameState, newStateInfo) {
        const newSavedStates = []
        for (let i = 0; i < this.savedStates.length; i++) {
            if (this.savedStates[i].name === nameState) {
                this.actualState.reset()
                this.actualState.stopDocumentListeners();
                this.actualState = this.createNewState(newStateInfo);
                this.savedStates = newSavedStates;
                this.actualState.startDocumentListeners();
                this.updateApp()
                return
            }
            newSavedStates.push(this.savedStates[i])
        }
        throw new Error("State not found on stack")
    }

     /**
     * Creates a new instance of a game state based on the provided state information.
     * @param {Object} stateInfo - Information about the new state.
     * @returns {MyGameState} - The new game state instance.
     */
    createNewState(stateInfo) {
        switch (stateInfo.name) {
            case "initial":
                return new InitialState(this);
            case "chooseCircuit":
                return new ChooseCircuitState(this, {path: "scene/circuits.json"});
            case "configRace":
                return new ConfigRaceState(this, stateInfo);
            case "choosePlayerCar":
                return new ChoosePlayerCar(this, stateInfo);
            case "chooseOpponentCar":
                return new ChooseOpponentCar(this, stateInfo);
            case "race":
                return new RaceState(this, stateInfo);
            case "result":
                return new ResultState(this, stateInfo);
            case "pause":
                return new PauseState(this, stateInfo);
            case "chooseObstacle":
                return new ChooseObstacle(this, stateInfo);
            default:
                throw new Error("Invalid state name");
        }
    }

    /**
     * Updates the application with the current game state.
     */
    updateApp() {
        this.app.scene = this.actualState.scene
        this.app.cameras = this.actualState.cameras
        this.updateActiveCamera()
    }

     /**
     * Updates the active camera in the application based on the current game state.
     */
    updateActiveCamera() {
        this.app.activeCameraName = this.actualState.activeCameraName
        this.app.activeCamera = this.app.cameras[this.actualState.activeCameraName]
    }
}

export {MyGameStateManager}