import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './objects/MyTable.js';
import { MyCake } from './objects/MyCake.js';
import { MyDish } from './objects/MyDish.js';
import { MyHouse } from './objects/MyHouse.js';
import { MyCandle } from './objects/MyCandle.js';


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
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess
        })

        //wall related attributes
        this.diffuseWallColor = "#c4b39c"
        this.specularWallColor = "#000000"
        this.wallShininess = 0
        this.wallMaterial = new THREE.MeshPhongMaterial({
            color: this.diffuseWallColor,
            specular: this.diffuseWallColor, emissive: "#000000", shininess: this.wallShininess
        })

        //dish related attributes
        this.diffuseDishColor = "#ffffff"
        this.specularDishColor = "#777777"
        this.dishShininess = 30
        this.dishMaterial = new THREE.MeshPhongMaterial({
            color: this.diffuseDishColor,
            specular: this.diffuseDishColor, emissive: "#000000", shininess: this.dishShininess
        })

        //cake related attributes
        this.diffuseCakeColor = "#49332b"
        this.specularCakeColor = "#777777"
        this.cakeShininess = 30
        this.cakeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffuseCakeColor,
            specular: this.diffuseCakeColor, emissive: "#000000", shininess: this.cakeShininess
        })

        this.diffuseCandleColor = "#f4e1c0"
        this.specularCandleColor = "#777777"
        this.candleShininess = 30
        this.candleMaterial = new THREE.MeshPhongMaterial({
            color: this.diffuseCandleColor,
            specular: this.diffuseCandleColor, emissive: "#000000", shininess: this.candleShininess
        })

        this.diffuseFlameColor = "#f8bf61"
        this.specularFlameColor = "#777777"
        this.flameShininess = 30
        this.flameMaterial = new THREE.MeshPhongMaterial({
            color: this.diffuseFlameColor,
            specular: this.diffuseFlameColor, emissive: "#000000", shininess: this.flameShininess
        })

        this.tableTexture = new THREE.TextureLoader().load('textures/table.webp')
        this.tableTexture.wrapS=THREE.RepeatWrapping
        this.tableTexture.wrapT=THREE.RepeatWrapping

        this.diffuseTableColor = "#8b5a2b"
        this.specularTableColor = "#777777"
        this.tableShininess = 30
        this.tableMaterial = new THREE.MeshPhongMaterial({
            color: this.diffuseTableColor,
            specular: this.diffuseTableColor, emissive: "#000000", shininess: this.tableShininess, map:this.tableTexture
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

        // add a point light on top of the model
        const pointLight = new THREE.PointLight(0xffffff, 350, 0);
        pointLight.position.set(0, 20, 0);
        this.app.scene.add(pointLight);

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        this.app.scene.add(pointLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);

        const spotLightCake = new THREE.SpotLight(0xffffff,200,25,0.09,0,0)
        spotLightCake.position.set(0,30,0)
        this.app.scene.add(spotLightCake)

        const helperSpot = 0.5
        const spotLightHelper = new THREE.SpotLightHelper(spotLightCake,helperSpot)
        this.app.scene.add(spotLightHelper)

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

    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }

    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        //this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z

    }

    buildHouse(){
        const house = new MyHouse().build(30,20,this.planeMaterial,this.wallMaterial);

        let table = new MyTable().build(8, 0.25, 12, this.tableMaterial)
    

        let dish = new MyDish().build(1.5,2.5,0.2,this.dishMaterial);
        table.add(dish);
        dish.position.y = 0.20

        let cake = new MyCake().build(2, 1, this.cakeMaterial, 30, 1, 5.5)
        dish.add(cake);
        cake.position.y = 0.5

        let candle = new MyCandle().build(0.06,0.6,0.05,0.1,this.candleMaterial,this.flameMaterial);
        cake.add(candle);
        candle.position.y = 0.8
        candle.position.z = -0.1

        house.add(table);
        return house;
    }

}

export { MyContents };