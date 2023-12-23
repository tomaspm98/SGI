import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyCircuit } from "./circuit/MyCircuit.js";
import { MyVehicle } from "./vehicle/MyVehicle.js";


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

    this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle1/vehicle1.xml")
    this.app.scene.add(this.vehicle.mesh)

    this.activatablesMeshes = []
    for (const activatable of this.circuit.activatables) {
      this.activatablesMeshes.push(activatable.mesh)
      activatable.mesh.geometry.computeBoundingBox()
    }

    document.addEventListener('keydown', (event) => this.vehicle.controlCar(event))
    document.addEventListener('keyup', (event) => this.vehicle.controlCar(event))
  }

  collisionDetectionNarrowPhase(activeObject, passiveObjects) {
    const activeObjectBox = new THREE.Box3().setFromObject(activeObject)
    for (const passiveObject of passiveObjects) {
      const passiveObjectBox = new THREE.Box3().setFromObject(passiveObject.mesh)
      if (activeObjectBox.containsBox(passiveObjectBox)) {
        return true
      }
    }
    return false
  }


  /**
   * updates the contents
   * this method is called from the render method of the app
   */
  update() {
    this.vehicle.update()
    if (this.collisionDetectionNarrowPhase(this.vehicle.mesh, this.circuit.activatables)) {
      console.log("collision")
    }

  }
}

export { MyContents };