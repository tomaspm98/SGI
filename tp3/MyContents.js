import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyTrack } from './track/MyTrack.js';
import { readTrackJSON } from './track/MyTrackReader.js';


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

    // add a point light on top of the model
    const pointLight = new THREE.PointLight(0xffffff, 600, 0, 1);
    pointLight.position.set(0, 100, 0);
    this.app.scene.add(pointLight);

    // add an ambient light
    const ambientLight = new THREE.AmbientLight(0xaaaaaa);
    this.app.scene.add(ambientLight);

    this.test()
  }

  async test() {
    const trackData = await readTrackJSON('scene/f1-circuits/ae-2009.geojson');
    const myTrack = new MyTrack(trackData["points"], 10, 500, 2.5, "scene/textures/asphalt-texture1.jpg");
    this.app.scene.add(myTrack.draw())
  }

  /**
   * updates the contents
   * this method is called from the render method of the app
   */
  update() {
  }
}

export { MyContents };