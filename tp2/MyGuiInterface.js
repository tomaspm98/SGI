import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {MyApp} from './MyApp.js';
import {MyContents} from './MyContents.js';
import {MySceneGraph} from './MySceneGraph.js';

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

    setScenegraph(scenegraph) {
        this.scenegraph = scenegraph
    }

    /**
     * Initialize the gui interface
     */
    init() {
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [...this.contents.cameras_map.keys()]).name('Active Camera:');
        cameraFolder.close()

        const lightsFolder = this.datgui.addFolder('Lights');
        for (let [key, light] of this.contents.lights.entries()) {
            const lightState = {enabled: light.visible};
            lightsFolder.add(lightState, 'enabled').name(key).onChange(value => {
                light.visible = value;
            });
        }
        lightsFolder.close()

        const polygonalModesFolder = this.datgui.addFolder('Polygonal Mode')
        const defaultMode = {text: 'Default'} 
        polygonalModesFolder.add(defaultMode, 'text', ['Default', 'Force Fill', 'Force Wireframe']).name('Mode:').onChange(value => {
            this.app.contents.sceneGraph.updatePolygonalMode(value)
        })
        polygonalModesFolder.close()
        
        
    }


}

export {MyGuiInterface};

