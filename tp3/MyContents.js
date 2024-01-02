import * as THREE from "three";
import {MyAxis} from "./MyAxis.js";
import {MyCircuit} from "./circuit/MyCircuit.js";
import {MyVehicle} from "./vehicle/MyVehicle.js";
import {collisionDetection, checkVehicleOnTrack} from "./collisions/collisions.js";
import {MyRTree} from "./collisions/MyRTree.js";
import {MyText3D} from "./MyText3D.js";
import {MyShader} from "./circuit/MyShader.js";

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
        this.clock = new THREE.Clock();
        this.clock.start();
    }

    /**
     * initializes the contents
     */
    async init() {
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
            normScale: {type: 'f', value: 0.1},
            displacement: {type: 'f', value: 0.0},
            normalizationFactor: {type: 'f', value: 1},
            blendScale: {type: 'f', value: 0.5},
            timeFactor: {type: 'f', value: 0.0},
        });

        const textureScreen = new THREE.TextureLoader().load('scene/ferrari.jpg')
        textureScreen.wrapS = THREE.RepeatWrapping;
        textureScreen.wrapT = THREE.RepeatWrapping;

        const textureScreenBW = new THREE.TextureLoader().load('scene/ferrari_bump.jpg')

        this.shaderPulsate.onMaterialReady = async (material) => {
            console.log(this.circuit.activatables)
            for (let i = 0; i < this.circuit.activatables.length; i++) {
                await this.circuit.activatables[i].meshPromise;
                if (this.circuit.activatables[i].effect == "reducedSpeed") {
                    console.log(this.circuit.activatables[i])
                    this.circuit.activatables[i].mesh.material = material;
                    this.circuit.activatables[i].mesh.material.needsUpdate = true;
                }
            }
        };

        this.shaderDisplay = new MyShader(this.app, 'Displacement Shader', 'Shader with Displacement Map',
            'circuit/shaders/bump.vert', 'circuit/shaders/bump.frag', {
                uTexture: {type: 'sampler2D', value: textureScreen},
                lgrayTexture: {type: 'sampler2D', value: textureScreenBW},
                normScale: {type: 'f', value: 0.1},
                blendScale: {type: 'f', value: 0.5},
                timeFactor: {type: 'f', value: 0.0},
                resolution: {type: 'vec2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
            })

        this.shaderDisplay.onMaterialReady = (material) => {
            console.log(material)
            for (let i = 0; i < this.circuit.scene.children.length; i++) {
                if (this.circuit.scene.children[i].name == "scenario") {
                    console.log(this.circuit.scene.children[i].children)
                    for (let j = 0; j < this.circuit.scene.children[i].children.length; j++) {
                        if (this.circuit.scene.children[i].children[j].name == "screenFull") {
                            console.log(this.circuit.scene.children[i].children[j])
                            this.circuit.scene.children[i].children[j].children[0].children[0].material = material;
                            this.circuit.scene.children[i].children[j].children[0].children[0].material.needsUpdate = true;
                        }
                    }
                }
            }
        }

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
    async update() {
        if (this.vehicle.update()) {
            collisionDetection(this.vehicle, this.rTree)
            checkVehicleOnTrack(this.vehicle, this.circuit.track)
        }
        let t = this.app.clock.getElapsedTime()
        if (this.shaderPulsate) {
            if (this.shaderPulsate.hasUniform("timeFactor")) {
                this.shaderPulsate.updateUniformsValue("timeFactor", t);
            }
        }

        if (this.shaderDisplay) {
            if (this.shaderDisplay.hasUniform("timeFactor")) {
                this.shaderDisplay.updateUniformsValue("timeFactor", t);
            }
        }
        
        if(this.clock.getElapsedTime() > 30){
            console.log("30 seconds")
            this.clock.stop();
            this.clock.start();
            
            const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
            this.app.renderer.setRenderTarget(renderTarget)
            this.app.renderer.render(this.app.scene, this.app.activeCamera);
            this.app.renderer.setRenderTarget(null)
            
            const texture = renderTarget.texture;
            const depthTexture = renderTarget.depthTexture;
            
            this.shaderDisplay.updateUniformsValue("uTexture", texture);
            this.shaderDisplay.updateUniformsValue("lgrayTexture", depthTexture);
            this.shaderDisplay.updateUniformsValue("timeFactor", t);
        }
        
    }
}


export {MyContents};