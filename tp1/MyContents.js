import * as THREE from 'three';
import {MyAxis} from './MyAxis.js';
import {MyTable} from './objects/MyTable.js';
import {MyCake} from './objects/MyCake.js';
import {MyDish} from './objects/MyDish.js';
import {MyHouse} from './objects/MyHouse.js';
import {MyCandle} from './objects/MyCandle.js';
import {MyFrame} from "./objects/MyFrame.js";


/**
 *  This class contains the contents of out application
 */

class MyContents {

    /**
     constructs the object
     @param {MyApp} app The application object
     */
    constructor(app) {
        this.app = app
        this.axis = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0, 2, 0)

        // plane related attributes
        this.diffusePlaneColor = "#C19A6B"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffusePlaneColor,
            specular: this.diffusePlaneColor, 
            emissive: "#000000", 
            shininess: this.planeShininess
        })

        //wall related attributes
        this.wallMaterial = new THREE.MeshPhongMaterial({
            color: "#c4b39c", 
            shininess: 0
        })

        //dish related attributes
        this.dishMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff", 
            shininess: 0,
        })

        //cake related attributes
        this.cakeMaterial = new THREE.MeshPhongMaterial({
            color: "#49332b", 
            shininess: 0
        })


        this.candleMaterial = new THREE.MeshPhongMaterial({
            color: "#f4e1c0",
            specular: "#ffffff", 
            shininess: 10
        })
        
        this.flameMaterial = new THREE.MeshPhongMaterial({
            color: "#ec8733",
            specular: "#ffed27",
            shininess: 100
        })

        this.tableTexture = new THREE.TextureLoader().load('textures/table.webp')
        this.tableTexture.wrapS = THREE.RepeatWrapping
        this.tableTexture.wrapT = THREE.RepeatWrapping
        this.tableMaterial = new THREE.MeshPhongMaterial({
            color: "#8b5a2b",
            specular: "#b47943",
            shininess: 30,
            map: this.tableTexture
        })

        //create a specular material for the legs of the table
        this.legMaterial = new THREE.MeshPhongMaterial({
            color: "#873e23",
            specular: "#865e3c", emissive: "#000000", shininess: 50
        })

        this.picture1Texture = new THREE.TextureLoader().load('textures/daniel.jpg')
        this.picture1Material = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#f2e7b3",
            shininess: 3,
            map: this.picture1Texture
        })

        this.picture2Texture = new THREE.TextureLoader().load('textures/tomas.jpg')
        this.picture2Material = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#f2e7b3",
            shininess: 3,
            map: this.picture2Texture
        })
    }


    /**
     * builds the box mesh with material assigned
     */
    buildBox() {
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77",
            specular: "#000000", emissive: "#000000", shininess: 90
        })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(this.boxMeshSize, this.boxMeshSize, this.boxMeshSize);
        this.boxMesh = new THREE.Mesh(box, boxMaterial);
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    /**
     * initializes the contents
     */
    init() {

        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);

        this.buildBox()

        this.app.scene.add(this.buildHouse());
    }

    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }

    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }

    /**
     * updates the plane shininess and the material
     * @param {number} value
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }


    update() {

    }

    buildHouse() {
        const wallHeight = 25
        const cakeHeight = 1
        
        const house = new MyHouse(50, wallHeight, this.planeMaterial, this.wallMaterial)
        house.createLights()

        let table = new MyTable().build(8, 0.25, 12, this.tableMaterial, this.legMaterial);

        let dish = new MyDish().build(1.5, 2.5, 0.2, this.dishMaterial);
        table.add(dish);
        dish.position.y = 0.20

        let cake = new MyCake().build(2, cakeHeight, this.cakeMaterial, 30, 1, 5.5)
        dish.add(cake);
        cake.position.y = 0.5
        
        const spotLightCake = new THREE.SpotLight(0xffffff, 400, 19, 0.175, 0.1)
        spotLightCake.position.y = 11.6
        cake.add(spotLightCake)

        const spotLightHelper = new THREE.SpotLightHelper(spotLightCake)
        cake.add(spotLightHelper)

        let candle = new MyCandle().build(0.06, 0.6, 0.05, 0.1, this.candleMaterial, this.flameMaterial);
        cake.add(candle);
        candle.position.y = 0.8
        candle.position.z = -0.1
        
        let frame1 = new MyFrame().createFrame(7, 7, 0.5, this.tableMaterial, this.picture1Material);
        let frame2 = new MyFrame().createFrame(7, 7, 0.5, this.tableMaterial, this.picture2Material);
        house.addPicture(1, frame1, 10, 0);
        house.addPicture(1, frame2, -10, 0);
        
        house.mesh.add(table);
        return house.mesh;
    }

}

export {MyContents};