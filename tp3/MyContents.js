import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyCircuitReader } from "./circuit/MyCircuitReader.js";


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

    const circuitReader = new MyCircuitReader()
    const circuitScene = circuitReader.buildCircuitGraph('scene/circuits/circuit1.xml')
    this.app.scene = circuitScene
  }


  /**
   * updates the contents
   * this method is called from the render method of the app
   */
  update() {
  }
}

export { MyContents };