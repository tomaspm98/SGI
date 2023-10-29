import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {MyApp} from './MyApp.js';
import {MyContents} from './MyContents.js';

/**
 This class customizes the gui interface for the app
 */
class MyGuiInterface {

    /**
     *
     * @param {MyApp} app The application object
     */
    constructor(app) {
        this.app = app
        this.datgui = new GUI();
        this.contents = null
    }

    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [... this.contents.cameras_map.keys()]).name("active camera");
        cameraFolder.close()


        const lightsFolder = this.datgui.addFolder('Lights');
        this.contents.lights_map.forEach((light, name) => {
            const lightState = { enabled: light.visible };
            lightsFolder.add(lightState, 'enabled').name(name).onChange(value => {
              light.visible = value;
            });
          });
          lightsFolder.close()
    }
}

export {MyGuiInterface};

