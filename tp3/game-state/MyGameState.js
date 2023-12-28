class MyGameState {
    constructor(gameStateManager) {
        this.scene = null;
        this.cameras = [];
        this.activeCameraName = null;
        this.gameStateManager = gameStateManager;

        this._createScene()
        this._createCameras()
        this._addDocumentListeners()
    }

    update() {

    }

    _createScene() {

    }

    _createCameras() {

    }

    _changeActiveCamera(name) {
        this.activeCameraName = name;
        this.gameStateManager.changeActiveCamera();

        // If the game state has a picking object
        // We need to update the camera inside the object 
        if (this.picking) {
            const newCamera = this.getActiveCamera()
            this.picking.updateCamera(newCamera)
        }
    }

    _addDocumentListeners() {

    }

    _changeState(stateInfo) {
        this.gameStateManager.changeState(stateInfo);
    }

    getActiveCamera() {
        return this.cameras[this.activeCameraName].camera;
    }
}

export { MyGameState }