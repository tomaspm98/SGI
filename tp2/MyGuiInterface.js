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
        for (let light of this.contents.lights.values()) {
            //const lightSubFolder = lightsFolder.addFolder(light.name)

        }

        /*for (let [key, light] of this.contents.lights.entries()) {
            const lightState = {enabled: light.visible};
            lightsFolder.add(lightState, 'enabled').name(key).onChange(value => {
                light.visible = value;
            });
        }*/
        lightsFolder.close()

        const polygonalModesFolder = this.datgui.addFolder('Polygonal Mode')
        const controllerPolygonal = polygonalModesFolder.add({text: 'Default'}, 'text', ['Default', 'Force Fill', 'Force Wireframe']).name('Mode:').onChange(value => {
            this.app.contents.sceneGraph.updatePolygonalMode(value)
        })
        polygonalModesFolder.close()

        const shadowModesFolder = this.datgui.addFolder('Shadow Mode on Meshes')
        const controllerShadow = shadowModesFolder.add({text: 'Default'}, 'text', ['Default', 'Force Shadows On', 'Force Shadows Off']).name('Mode:').onChange(value => {
            this.app.contents.sceneGraph.updateShadowMode(value)
        })
        shadowModesFolder.close()
        
        this.datgui.add({
            'Reset': () => {
                controllerShadow.setValue('Default')
                controllerPolygonal.setValue('Default')
            }
        }, 'Reset')
    }
}

export {MyGuiInterface};

