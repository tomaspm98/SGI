import {MyText3D} from "../MyText3D.js";

class MyGameState {
    static textWhite = new MyText3D("scene/sprite_sheet_white.png", [1020, 1020], [102, 102]);
    static textRed = new MyText3D("scene/sprite_sheet.png", [1020, 1020], [102, 102]);

    /**
     * Constructs an instance of MyGameState.
     * @param {MyGameStateManager} gameStateManager - The game state manager.
     * @param {Object} stateInfo - Additional information for the state.
     */
    constructor(gameStateManager, stateInfo) {
        this.scene = null;
        this.cameras = [];
        this.activeCameraName = null;
        this.gameStateManager = gameStateManager;
        this.listeners = [];
        this.picking = null;
        this.stateInfo = stateInfo;


        this.createScene()
        this.createCameras()
        
        for(const camera of Object.values(this.cameras)) {
            this.scene.remove(camera)
            this.scene.add(camera)
        }
        
        this._createDocumentListeners()
    }

    /**
     * Updates the game state.
     */
    update() {
    }
    
    /**
     * Creates cameras for the game state.
     * To be overridden by subclasses.
     */
    createCameras() {
    }
    
    /**
     * Creates the scene for the game state.
     * To be overridden by subclasses.
     */
    createScene() {
    }

    /**
     * Creates document listeners for the game state.
     * To be overridden by subclasses.
     */
    _createDocumentListeners() {
    }

    /**
     * Starts document listeners for the game state.
     */
    startDocumentListeners() {
        this.listeners.forEach(listener => {
            document.addEventListener(listener.type, listener.handler);
        })
        if (this.picking) {
            this.picking.startListeners()
        }
    }

    /**
     * Stops document listeners for the game state.
     */
    stopDocumentListeners() {
        this.listeners.forEach(listener => {
            document.removeEventListener(listener.type, listener.handler);
        })
        if (this.picking) {
            this.picking.stopListeners()
        }
    }

    /**
     * Changes the active camera for the game state.
     * @param {string} name - The name of the new active camera.
     */
    changeActiveCamera(name) {
        this.activeCameraName = name;

        this.gameStateManager.updateActiveCamera();

        // If the game state has a picking object
        // We need to update the camera inside the object 
        if (this.picking) {
            const newCamera = this.getActiveCamera()
            this.picking.updateCamera(newCamera)
        }
    }


    /**
     * Gets the active camera for the game state.
     * @returns {THREE.Camera} - The active camera.
     */
    getActiveCamera() {
        return this.cameras[this.activeCameraName];
    }
    
    /**
     * Resets the game state.
     * To be overridden by subclasses.
     */
    reset(){

    }
    
     /**
     * Unpauses the game state.
     * To be overridden by subclasses.
     */
    unpause(){
    }
}

export {MyGameState}