import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

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

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        const data = {
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
        };

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder('Plane');
        planeFolder.addColor(data, 'diffuse color').onChange((value) => { this.contents.updateDiffusePlaneColor(value) });
        planeFolder.addColor(data, 'specular color').onChange((value) => { this.contents.updateSpecularPlaneColor(value) });
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange((value) => { this.contents.updatePlaneShininess(value) });
        planeFolder.close();

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', ['Perspective', 'Left', 'Top', 'Front']).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.close()
    }
}

export { MyGuiInterface };