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
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffusePlaneColor,
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess
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
        const pointLight = new THREE.PointLight(0xffffff, 500, 0);
        pointLight.position.set(0, 20, 0);
        this.app.scene.add(pointLight);

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        this.app.scene.add(pointLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);

        this.buildBox()

        /*let dish = new THREE.CylinderGeometry(0.5,0.7,0.15,32);
        this.dishMesh = new THREE.Mesh(dish, this.planeMaterial);
        this.dishMesh.rotation.x = -Math.PI/2;
        this.dishMesh.position.z = 4;

        let candle = new THREE.CylinderGeometry(0.025,0.025,0.20,32);
        this.candleMesh = new THREE.Mesh(candle,this.planeMaterial);
        this.candleMesh.position.y = -0.5;

        let wire = new THREE.CylinderGeometry(0.002,0.002,0.05,32);
        this.wireMesh = new THREE.Mesh(wire,this.planeMaterial);
        this.wireMesh.position.y = -0.1
        this.candleMesh.add(this.wireMesh);

        let flame = new THREE.ConeGeometry(0.015,0.05,32);
        this.flameMesh = new THREE.Mesh(flame, this.planeMaterial);
        this.flameMesh.position.y = -0.14;
        this.flameMesh.rotation.x = -Math.PI;
        this.candleMesh.add(this.flameMesh);

        this.dishMesh.add(this.candleMesh);

        this.planeMesh.add(this.dishMesh);*/

        //let table = new MyTable().build(12, 0.15, 16, this.planeMaterial)
        //this.app.scene.add(table);

        let cake = new MyCake().build(2, 3, this.planeMaterial)
        this.app.scene.add(cake);


        let dish = new MyDish().build(0.5,0.7,0.15,this.planeMaterial);
        
        this.app.scene.add(dish);

        let house = new MyHouse().build(20,20,20,15,this.planeMaterial,this.planeMaterial);
        this.app.scene.add(house);
        
        /*let dish = new MyDish().build(0.5,0.7,0.15,this.planeMaterial);
        
        this.house.scene.add(dish);*/

        let candle = new MyCandle().build(0.025,0.2,0.015,0.05,this.planeMaterial,this.planeMaterial);
        this.app.scene.add(candle);
        //this.app.scene.add(dish);

        

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

}

export { MyContents };