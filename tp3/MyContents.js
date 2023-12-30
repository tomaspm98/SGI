import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyCircuit } from "./circuit/MyCircuit.js";
import { MyVehicle } from "./vehicle/MyVehicle.js";
import { collisionDetection, checkVehicleOnTrack } from "./collisions/collisions.js";
import { MyRTree } from "./collisions/MyRTree.js";
import { MyText3D } from "./MyText3D.js";
import { MyShader } from "./circuit/MyShader.js";

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
        //this.circuit = MyCircuit.create("scene/circuits/circuit1.xml")
        this.circuit = MyCircuit.create("scene/circuits/circuitTest.xml")

        console.log(this.circuit)
        this.app.scene = this.circuit.scene

        this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle1/vehicle1.xml")
        //this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle2/vehicle2.xml")
        //this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle3/vehicle3.xml")
        //this.vehicle = MyVehicle.createVehicle("scene/vehicles/vehicle_test/vehicleTest.xml")
        this.app.scene.add(this.vehicle.mesh)
        this.app.scene.add(this.vehicle.obb.helper)
        this.app.clock = new THREE.Clock()

        this.rTree = new MyRTree()
        console.log(this.circuit.activatables)

        this.shaderPulsate = new MyShader(this.app, 'Pulsating', "Load a texture and pulsate it", "circuit/shaders/pulsate.vert", "circuit/shaders/pulsate.frag", {
            normScale: { type: 'f', value: 0.1 },
            displacement: { type: 'f', value: 0.0 },
            normalizationFactor: { type: 'f', value: 1 },
            blendScale: { type: 'f', value: 0.5 },
            timeFactor: { type: 'f', value: 0.0 },
        });

        const textureScreen = new THREE.TextureLoader().load('scene/ferrari.jpg' )
        textureScreen.wrapS = THREE.RepeatWrapping;
        textureScreen.wrapT = THREE.RepeatWrapping;
        
        const textureScreenBW = new THREE.TextureLoader().load('scene/ferrari_bump.jpg' )

        this.shaderDisplay = new MyShader(this.app, 'Displacement Shader', 'Shader with Displacement Map',
        'circuit/shaders/bump.vert', 'circuit/shaders/bump.frag', {
            uTexture: { type: 'sampler2D', value: textureScreen },
            lgrayTexture: { type: 'sampler2D', value: textureScreenBW },
            normScale: { type: 'f', value: 0.1 },
            normalizationFactor: { type: 'f', value: 1 },
                blendScale: { type: 'f', value: 0.5 },
                timeFactor: { type: 'f', value: 0.0 },
                resolution: { type: 'vec2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        })

        this.shaderPulsate.onMaterialReady = (material) => {
            console.log(material);
            for (let i = 0; i < this.circuit.activatables.length; i++) {
                if (this.circuit.activatables[i].effect == "reducedSpeed") {
                    this.circuit.activatables[i].mesh.material = material;
                }
            }
        };

        this.shaderDisplay.onMaterialReady = (material) => {
            console.log(material)
            for (let i=0;i<this.circuit.scene.children.length;i++){
            if (this.circuit.scene.children[i].name == "scenario"){
                for (let j=0;j<this.circuit.scene.children[i].children.length;j++){
                    if (this.circuit.scene.children[i].children[j].name == "screen"){
                        console.log(this.circuit.scene.children[i].children[j])
                        this.circuit.scene.children[i].children[j].children[0].material = material;
                        this.circuit.scene.children[i].children[j].material = material;

                }
        }
    }
}
        }

        console.log(this.shaderDisplay)

        this.rTree.insertMany(this.circuit.activatables)

        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }



        document.addEventListener('keydown', (event) => this.vehicle.controlCar(event))
        document.addEventListener('keyup', (event) => this.vehicle.controlCar(event))
    }


    /**
     * updates the contents
     * this method is called from the render method of the app
     */
    update() {
        if (this.vehicle.update()) {
            collisionDetection(this.vehicle, this.rTree)
            checkVehicleOnTrack(this.vehicle, this.circuit.track)
        }
        let t = this.app.clock.getElapsedTime()
        if (this.shaderPulsate) {
            if (this.shaderPulsate.hasUniform("timeFactor")) {
                this.shaderPulsate.updateUniformsValue("timeFactor", t  );
            }
        }
    }



}

export { MyContents };