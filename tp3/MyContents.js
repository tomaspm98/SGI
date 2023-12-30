import * as THREE from "three";

import { MyCircuit } from "./circuit/MyCircuit.js";
import { MyVehicle } from "./vehicle/MyVehicle.js";
import { MyAutonomousVehicle } from "./vehicle/MyAutonomousVehicle.js";
import {MyControllableVehicle} from "./vehicle/MyControllableVehicle.js";


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
        this.axis = null;
    }

    /**
     * initializes the contents
     */
    init() {
        // create once
        //this.circuit = MyCircuit.create("scene/circuits/circuit1.xml")
        this.circuit = MyCircuit.create("scene/circuits/circuitTest.xml")

        console.log(this.circuit.track._getPath())
        this.app.scene = this.circuit.scene

        this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle1/vehicle1.xml")
        //this.playerVehicle = MyControllableVehicle.fromVehicle(this.vehicle)
        this.opponentVehicle = MyAutonomousVehicle.fromVehicle(this.vehicle, this.circuit.track.pointsGeoJSON, this.circuit.track._getPath(), 'easy')
        this.app.scene.add(this.opponentVehicle.mesh)
        
        //this.app.scene.add(this.vehicle.mesh)
        //this.app.scene.add(this.playerVehicle.mesh)
        //document.addEventListener('keydown', (event) => this.playerVehicle.controlCar(event))
        //document.addEventListener('keyup', (event) => this.playerVehicle.controlCar(event))
    }


    /**
     * updates the contents
     * this method is called from the render method of the app
     */
    update() {
        this.opponentVehicle.update()
        //this.playerVehicle.update()
    }


}

export { MyContents };