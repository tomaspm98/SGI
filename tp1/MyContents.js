import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './objects/MyTable.js';
import { MyCake } from './objects/MyCake.js';
import { MyDish } from './objects/MyDish.js';
import { MyHouse } from './objects/MyHouse.js';
import { MyCandle } from './objects/MyCandle.js';
import { MyFrame } from "./objects/MyFrame.js";
import { MyWindow } from "./objects/MyWindow.js";
import { MyDoor } from './objects/MyDoor.js';
import { MyRug } from './objects/MyRug.js';
import { MyChair } from './objects/MyChair.js';
import { MyJournal } from './objects/MyJournal.js';
import { MyGlass } from './objects/MyGlass.js';
import { MySpotlight } from './objects/MySpotlight.js';
import { MyJar } from './objects/MyJar.js';
import { MyBeetle } from './objects/MyBeetle.js';
import { MyCircle } from './objects/MyCircle.js';

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
            specular: "#000000",
            shininess: 5,
            map: this.picture1Texture,
        })

        this.picture2Texture = new THREE.TextureLoader().load('textures/tomas.jpg')
        this.picture2Material = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#000000",
            shininess: 5,
            map: this.picture2Texture
        })

        this.windowTexture = new THREE.TextureLoader().load('textures/windows.jpg')
        this.windowMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#000000",
            shininess: 5,
            map: this.windowTexture
        })

        this.doorTexture = new THREE.TextureLoader().load('textures/door_texture.png')
        this.doorMaterial = new THREE.MeshPhongMaterial({
            color: "#666666",
            specular: "#b47943",
            shininess: 1,
            map: this.doorTexture
        })

        this.rugTexture = new THREE.TextureLoader().load('textures/rug_texture.jpg')
        this.rugTexture.wrapS = THREE.RepeatWrapping
        this.rugTexture.wrapT = THREE.RepeatWrapping
        this.rugMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "000000",
            shininess: 1,
            map: this.rugTexture
        })

        this.chairTexture = new THREE.TextureLoader().load('textures/chair_texture.jpg')
        this.chairTexture.wrapS = THREE.RepeatWrapping
        this.chairTexture.wrapT = THREE.RepeatWrapping
        this.chairMaterial = new THREE.MeshPhongMaterial({
            color: "#a0764b",
            specular: "#000000",
            shininess: 1,
            map: this.chairTexture
        })

        this.glassMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff, // Neutral color for glass  // Add environment map for reflections
            refractionRatio: 0.98, // You can play with this value
            reflectivity: 0.9,  // Again, adjust to your liking
            transparent: true, // Make the material transparent
            opacity: 0.5,      // Adjust opacity to your liking
            shininess: 1,    // To give it a shiny effect
            specular: 0x222222,
            // map: this.chairTexture  // If you want a texture, but for clear glass, this is optional
        })

        this.spotlightMaterial = new THREE.MeshPhongMaterial({
            color: "#333333",
            specular: "#111111",
            shininess: 1,
        })

        this.journalTexture = new THREE.TextureLoader().load('textures/journal_texture.jpg')
        this.journalMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#ffffff",
            shininess: 50,
            map: this.journalTexture
        })

        this.jarMaterial = new THREE.MeshPhongMaterial({
            color: "#dc5200",
            specular: "#dc5200",
            shininess: 50,
        })
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

        const wallHeight = 35
        const floorWidth = 100
        const cakeHeight = 2
        const tableWidth = 14
        const tableLength = 20
        const tableHeight = 0.5
        const glassHeight = 1

        const house = new MyHouse(floorWidth, wallHeight, this.planeMaterial, this.wallMaterial)
        house.createLights()

        let table = new MyTable().build(tableWidth, tableHeight, tableLength, this.tableMaterial, this.legMaterial);

        let chair1 = new MyChair().build(5, 6, 5, this.chairMaterial)
        chair1.position.z = - tableWidth / 2

        let chair2 = new MyChair().build(5, 6, 5, this.chairMaterial)
        chair2.position.z = tableWidth / 2
        chair2.rotation.y = Math.PI
        let chair3 = new MyChair().build(5, 6, 5, this.chairMaterial)
        chair3.rotation.y = Math.PI / 2
        chair3.position.x = -tableLength / 2
        let chair4 = new MyChair().build(5, 6, 5, this.chairMaterial)
        chair4.rotation.y = -Math.PI / 2
        chair4.position.x = tableLength / 2

        let dish = new MyDish().build(2.8, 3.8, 0.3, this.dishMaterial);
        table.add(dish);
        dish.position.y = 0.3

        let cake = new MyCake().build(3, cakeHeight, this.cakeMaterial, 40, 1, 5.5)
        dish.add(cake);
        cake.position.y = 0.5

        const spotLightCake = new THREE.SpotLight("#ff00ff", 500, 27, 0.19, 0.1)
        spotLightCake.position.y = 18
        cake.add(spotLightCake)

        const spotLightHelper = new THREE.SpotLightHelper(spotLightCake)
        cake.add(spotLightHelper)

        let candle = new MyCandle().build(0.09, 1, 0.1, 0.15, this.candleMaterial, this.flameMaterial);
        cake.add(candle);
        candle.position.y = 1.4
        candle.position.z = -0.1

        let frame1 = new MyFrame().create(12, 12, 0.5, this.tableMaterial, this.picture1Material);
        let frame2 = new MyFrame().create(12, 12, 0.5, this.tableMaterial, this.picture2Material);
        house.addObjectWall(1, frame1, 10, 0);
        house.addObjectWall(1, frame2, -10, 0);

        let window1 = new MyWindow().create(40, 18, 0.5, this.tableMaterial, this.windowMaterial);
        house.addObjectWall(3, window1);

        house.mesh.add(table);
        house.mesh.add(chair1)
        house.mesh.add(chair2)
        house.mesh.add(chair3)
        house.mesh.add(chair4)

        house.addObjectWall(4, new MyDoor().build(15, 25, 1, this.doorMaterial), 0, -5);
        let mirror = new MyFrame().create(12, 12, 0.5, this.tableMaterial, this.planeMaterial);
        house.addObjectWall(4, mirror, 40, 0, 0);

        let rug = new MyRug().build(30, 25, 0.5, this.rugMaterial)
        rug.rotation.x = Math.PI / 2
        rug.position.x = 30
        house.mesh.add(rug)

        let journal = new MyJournal().build(this.journalMaterial)
        journal.position.y = table.position.y + tableHeight / 2 + 1.5
        journal.position.x = 8
        journal.position.z = 5
        house.mesh.add(journal)

        let glass1 = new MyGlass().build(0.4, 0.3, glassHeight, this.glassMaterial)
        glass1.position.y = table.position.y + tableHeight / 2 + glassHeight / 2
        glass1.position.x = tableLength / 2 - 2
        house.mesh.add(glass1)

        let glass2 = new MyGlass().build(0.4, 0.3, glassHeight, this.glassMaterial)
        glass2.position.y = table.position.y + tableHeight / 2 + glassHeight / 2
        glass2.position.z = tableWidth / 2 - 2
        house.mesh.add(glass2)

        let glass3 = new MyGlass().build(0.4, 0.3, glassHeight, this.glassMaterial)
        glass3.position.y = table.position.y + tableHeight / 2 + glassHeight / 2
        glass3.position.z = -tableWidth / 2 + 2
        house.mesh.add(glass3)

        let glass4 = new MyGlass().build(0.4, 0.3, glassHeight, this.glassMaterial)
        glass4.position.y = table.position.y + tableHeight / 2 + glassHeight / 2
        glass4.position.x = -tableLength / 2 + 2
        house.mesh.add(glass4)

        let spotlight = new MySpotlight().build(3, 10, 2, this.spotlightMaterial)
        spotlight.position.y = wallHeight - 5
        house.mesh.add(spotlight)

        let jar = new MyJar().build(this.jarMaterial)
        jar.position.y = table.position.y + 1.5 + tableHeight / 2
        jar.position.x = 7
        jar.position.z = -5
        let circleFlower = new MyCircle().build({ x: 0, y: 0 }, 0.5)
        circleFlower.position.y = 3
        jar.add(circleFlower);
        house.mesh.add(jar)



        return house.mesh
    }

}

export { MyContents };