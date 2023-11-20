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
    
    /**
     * Initialize the gui interface
     */
    init() {
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [...this.contents.cameras_map.keys()]).name('Active Camera:');
        cameraFolder.close()

        //Save the default values of the lights
        //This is used to reset the values of the lights
        const lightBackup = []
        for (let light of this.contents.lights.values()) {
            lightBackup.push({
                name: light.name,
                enabled: light.visible,
                castShadow: light.castShadow,
                color: light.color.getHex(),
                intensity: light.intensity
            })
        }
        
        //Create the controllers for the lights
        const lightControllers = []
        const lightsFolder = this.datgui.addFolder('Lights');
        for (let light of this.contents.lights.values()) {
            const lightSubFolder = lightsFolder.addFolder(light.name)

            const lightVisibleController = lightSubFolder.add({enabled: light.visible}, 'enabled').name('Enabled').onChange(value => {
                light.visible = value;
            })
            const lightShadowController = lightSubFolder.add({enabled: light.castShadow}, 'enabled').name('Cast Shadow').onChange(value => {
                light.castShadow = value;
            })
            const lightColorController = lightSubFolder.addColor({color: light.color.getHex()}, 'color').name('Color').onChange(value => {
                light.color.setHex(value);
            })
            const lightIntensityController = lightSubFolder.add({intensity: light.intensity}, 'intensity').name('Intensity').onChange(value => {
                light.intensity = value;
            })
            lightControllers[light.name] = {
                'visible': lightVisibleController,
                'shadow': lightShadowController,
                'color': lightColorController,
                'intensity': lightIntensityController
            }
            lightSubFolder.close()
        }
        lightsFolder.close()

        //Create the controllers for the polygonal mode
        const polygonalModesFolder = this.datgui.addFolder('Polygonal Mode')
        const controllerPolygonal = polygonalModesFolder.add({text: 'Default'}, 'text', ['Default', 'Force Fill', 'Force Wireframe']).name('Mode:').onChange(value => {
            this.app.contents.sceneGraph.updatePolygonalMode(value)
        })
        polygonalModesFolder.close()

        //Create the controllers for the shadow mode
        const shadowModesFolder = this.datgui.addFolder('Shadow Mode on Meshes')
        const controllerShadow = shadowModesFolder.add({text: 'Default'}, 'text', ['Default', 'Force Shadows On', 'Force Shadows Off']).name('Mode:').onChange(value => {
            this.app.contents.sceneGraph.updateShadowMode(value)
        })
        shadowModesFolder.close()

        //Reset button
        //Put the default values (the ones that were saved before) on the controllers
        this.datgui.add({
            'Reset': () => {
                controllerShadow.setValue('Default')
                controllerPolygonal.setValue('Default')
                for (const i in lightBackup) {
                    const light = lightBackup[i]
                    lightControllers[light.name].visible.setValue(light.enabled)
                    lightControllers[light.name].shadow.setValue(light.castShadow)
                    lightControllers[light.name].color.setValue(light.color)
                    lightControllers[light.name].itensity.setValue(light.intensity)
                }
            }
        }, 'Reset')
    }
}

export {MyGuiInterface};

