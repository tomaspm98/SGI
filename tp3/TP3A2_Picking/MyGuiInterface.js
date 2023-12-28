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
        // add a folder to the gui interface for the box

        const data_pic_color = {
            'picking color': this.contents.pickingColor
        };

        const pickFolder = this.datgui.addFolder('Picking');
        pickFolder.addColor(data_pic_color, 'picking color').onChange((value) => { this.contents.updatePickingColor(value) });
        pickFolder.add(this.contents.raycaster, 'near', 0, 5)
        pickFolder.add(this.contents.raycaster, 'far', 5, 80)
        pickFolder.add(this.contents, 'selectedLayer', ['none', '1', '2', '3']).name("selected layer").onChange((value) => { this.contents.selectedLayers = value; this.contents.updateSelectedLayer() });
        pickFolder.open()
    }
}

export { MyGuiInterface };