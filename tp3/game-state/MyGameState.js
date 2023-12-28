class MyGameState {
    constructor(gameStateManager) {
        this.scene = null;
        this.cameras = [];
        this.activeCameraName = null;
        this.gameStateManager = gameStateManager;
        this.listeners = [];
        this.picking = null;

        this._createScene()
        this._createCameras()
        this._createDocumentListeners()
        this.startDocumentListeners()
    }

    update() {
    }

    _createScene() {
    }

    _createCameras() {
    }
    
    _createDocumentListeners() {
    }
    
    startDocumentListeners() {
        this.listeners.forEach(listener => {
            document.addEventListener(listener.type, listener.handler);
        })
    }
    
    stopDocumentListeners() {
        this.listeners.forEach(listener => {
            document.removeEventListener(listener.type, listener.handler);
        })
        if(this.picking) {
            this.picking.stopListeners()
        }
    }

    changeActiveCamera(name) {
        this.activeCameraName = name;
        this.gameStateManager.changeActiveCamera();

        // If the game state has a picking object
        // We need to update the camera inside the object 
        if (this.picking) {
            const newCamera = this.getActiveCamera()
            this.picking.updateCamera(newCamera)
        }
    }


    getActiveCamera() {
        return this.cameras[this.activeCameraName].camera;
    }
}

export {MyGameState}