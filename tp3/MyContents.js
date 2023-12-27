import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyCircuit } from "./circuit/MyCircuit.js";
import { MyVehicle } from "./vehicle/MyVehicle.js";
import { collisionDetection, checkVehicleOnTrack } from "./collisions/collisions.js";
import { MyRTree } from "./collisions/MyRTree.js";
import { MyText3D } from "./MyText3D.js";
import { InitialState } from "./game-state/InitialState.js";


/**
 *  This class contains the contents of out application
 */
class MyContents {
    /**
     constructs the object
     @param {MyApp} app The application object
     */
    constructor(app) {
        this.app = app;
        this.gameStateManager = null;
        this.gameState = null;
    }

    /**
     * initializes the contents
     */
    init() {
        this.gameState = new InitialState();
        this.gameState.setActiveCamera("Perspective");

        this.app.scene = this.gameState.scene;

        this.app.setCameras(this.gameState.cameras);
        this.app.setActiveCamera("Perspective");
    }


    /**
     * updates the contents
     * this method is called from the render method of the app
     */
    update() {
        /*if (this.vehicle.update()) {
            collisionDetection(this.vehicle, this.rTree)
            checkVehicleOnTrack(this.vehicle, this.circuit.track)
        }*/
    }


}

export { MyContents };