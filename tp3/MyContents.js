import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyCircuit } from "./circuit/MyCircuit.js";
import { MyVehicle } from "./vehicle/MyVehicle.js";
import { collisionDetection, checkVehicleOnTrack } from "./collisions/collisions.js";
import { MyRTree } from "./collisions/MyRTree.js";
import { MyText3D } from "./MyText3D.js";
import { MyAutonomousVehicle } from "./vehicle/MyAutonomousVehicle.js";


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

        this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle1/vehicle1.xml", { x: 0, y: 0, z: 0 }, 0)
        //this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle2/vehicle2.xml")
        //this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle3/vehicle3.xml")
        //this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle_test/vehicleTest.xml")
        this.app.scene.add(this.vehicle.mesh)
        this.app.scene.add(this.vehicle.obb.helper)
        this.opponent = MyAutonomousVehicle.createVehicle("scene/vehicles/vehicle2/vehicle2.xml", this.circuit.track.pointsGeoJSON, this.circuit.track._getPath(), { x: 0, y: 0, z: 0 }, 0)
        this.app.scene.add(this.opponent.mesh)
        this.rTree = new MyRTree()
        this.rTree.insertMany(this.circuit.activatables)

        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }


        document.addEventListener('keydown', (event) => this.vehicle.controlCar(event))
        document.addEventListener('keyup', (event) => this.vehicle.controlCar(event))
    }


    /**
     * updates the contents
     * this method is called from the render method of the app
     */
    update() {
        if (this.vehicle.update()) {
            collisionDetection(this.vehicle, this.rTree)
            checkVehicleOnTrack(this.vehicle, this.circuit.track)
        }

        this.opponent.update();
    }


}

export { MyContents };