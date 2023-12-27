import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyCircuit } from "./circuit/MyCircuit.js";
import { MyVehicle } from "./vehicle/MyVehicle.js";
import { collisionDetection, checkVehicleOnTrack } from "./collisions/collisions.js";
import { MyRTree } from "./collisions/MyRTree.js";
import { MyText3D } from "./spritesheet/MyText3D.js";


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
        this.circuit = MyCircuit.create("scene/circuits/circuit1.xml")
        this.app.scene = this.circuit.scene

        this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle_test/vehicleTest.xml")
        //this.app.scene.add(this.vehicle.mesh)
        //this.app.scene.add(this.vehicle.obb.helper)

        this.rTree = new MyRTree()
        this.rTree.insertMany(this.circuit.activatables)

        this.text = new MyText3D("spritesheet/sprite_sheet.png", 640, 640, 64, 64)
        const textMesh = this.text.transformString("w x", [10, 10])
        this.app.scene.add(textMesh)

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
    }


}

export { MyContents };