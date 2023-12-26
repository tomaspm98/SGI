import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyCircuit } from "./circuit/MyCircuit.js";
import { MyVehicle } from "./vehicle/MyVehicle.js";
import { collisionDetection, checkVehicleOnTrack } from "./collisions/collisions.js";
import { MyRTree } from "./collisions/MyRTree.js";


/**
 *  This class contains the contents of out application
 */
class MyContents {
<<<<<<< 021613ad2e9de0597c8b1ea597c55202902da72e
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

        this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle1/vehicle1.xml")
        this.app.scene.add(this.vehicle.mesh)

        this.rTree = new MyRTree()
        this.rTree.insertMany(this.circuit.activatables)

        document.addEventListener('keydown', (event) => this.vehicle.controlCar(event))
        document.addEventListener('keyup', (event) => this.vehicle.controlCar(event))
=======
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


    const circuit = new MyCircuit("scene/circuits/circuit1.xml")
    circuit.build()
    this.app.scene = circuit.scene

    this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle1/vehicle1.xml")
    //this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle2/vehicle2.xml")
    //this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle3/vehicle3.xml")
    //this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle_test/vehicleTest.xml")
    this.app.scene.add(this.vehicle.mesh)

    document.addEventListener('keydown', (event) => this.vehicle.controlCar(event))
    document.addEventListener('keyup', (event) => this.vehicle.controlCar(event))

    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
>>>>>>> f51999db3e63e6fac9ef9e04a1589ccb6dd3e017
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