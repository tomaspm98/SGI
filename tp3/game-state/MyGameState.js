import { MyText3D } from "../MyText3D.js";

class MyGameState {
    static textWhite = new MyText3D("scene/sprite_sheet_white.png", [1020, 1020], [102, 102]);
    static textRed = new MyText3D("scene/sprite_sheet.png", [1020, 1020], [102, 102]);

    
    constructor(gameStateManager, stateInfo) {
        this.scene = null;
        this.cameras = [];
        this.activeCameraName = null;
        this.gameStateManager = gameStateManager;
        this.listeners = [];
        this.picking = null;
        this.stateInfo = stateInfo;

        
        this._createScene()
        this._createCameras()
        this._createDocumentListeners()
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
        if(this.picking) {
            this.picking.startListeners()
        }
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
        
        this.gameStateManager.updateActiveCamera();

        // If the game state has a picking object
        // We need to update the camera inside the object 
        if (this.picking) {
            const newCamera = this.getActiveCamera()
            this.picking.updateCamera(newCamera)
        }
    }


    getActiveCamera() {
        return this.cameras[this.activeCameraName];
    }
}

export {MyGameState}