import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import {MyCircuit} from "./circuit/MyCircuit.js";


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
    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }

    const circuit = new MyCircuit("scene/circuits/circuit1.xml")
    circuit.build()
    this.app.scene = circuit.circuitScene
  }


  /**
   * updates the contents
   * this method is called from the render method of the app
   */
  update() {
  }
}

export { MyContents };