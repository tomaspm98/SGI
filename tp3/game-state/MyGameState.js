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
    }

    _addDocumentListeners() {

    }

    _changeState(stateInfo) {
        this.gameStateManager.changeState(stateInfo);
    }
}

export { MyGameState }