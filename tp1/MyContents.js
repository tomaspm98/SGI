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
import { MyLamp } from './objects/MyLamp.js';
import { MyJar } from './objects/MyJar.js';
import { MyBeetle } from './objects/MyBeetle.js';
import { MyFlower } from './objects/MyFlower.js';
import { MySpring } from './objects/MySpring.js';
import { MyTelevision } from './objects/MyTelevision.js';
import { MyCoffeeTable } from './objects/MyCoffeeTable.js';
import { MySofa, MyArmchair } from './objects/MySofa.js';
import { MySideboard } from './objects/MySideboard.js';
import { MyCup } from './objects/MyCup.js';
import { MyBook } from './objects/MyBook.js';
import { MyRemote } from './objects/MyRemote.js';
import { MyCableBox } from './objects/MyCableBox.js';

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
        this.planeTexture = new THREE.TextureLoader().load('textures/floor_texture.jpg')
        this.planeTexture.wrapS = THREE.RepeatWrapping
        this.planeTexture.wrapT = THREE.RepeatWrapping
        this.planeTexture.repeat.set(5, 5)
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: "#deb887",
            specular: "#777777",
            shininess: 10,
            map:this.planeTexture,
            side: THREE.DoubleSide
        })

        //wall related attributes
        this.wallTexture = new THREE.TextureLoader().load('textures/wall_texture.png')
        this.wallMaterial = new THREE.MeshPhongMaterial({
            color: "#c4b39c",
            shininess: 0,
            side: THREE.DoubleSide,
            map:this.wallTexture
        })
        this.wallMaterial.receiveShadow = true;

        //dish related attributes
        this.dishMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            shininess: 0,
        })

        //cake related attributes
        this.cakeTexture = new THREE.TextureLoader().load('textures/cake_texture.jpg')
        this.cakeMaterial = new THREE.MeshPhongMaterial({
            color: "#49332b",
            shininess: 0,
            map:this.cakeTexture
        })


        this.candleMaterial = new THREE.MeshPhongMaterial({
            color: "#f4e1c0",
            specular: "#ffffff",
            shininess: 10
        })

        this.flameMaterial = new THREE.MeshPhongMaterial({
            color: "#ec8733",
            specular: "#ffed27",
            shininess: 10
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

        this.windowBoardTexture = new THREE.TextureLoader().load('textures/window_texture.jpg')
        this.windowBoardMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#000000",
            shininess: 5,
            map: this.windowBoardTexture
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
            specular: "#000000",
            shininess: 1,
            map: this.rugTexture
        })

        this.chairTexture = new THREE.TextureLoader().load('textures/chair_texture.jpg')
        this.chairTexture.wrapS = THREE.RepeatWrapping
        this.chairTexture.wrapT = THREE.RepeatWrapping
        this.chairMaterial = new THREE.MeshPhongMaterial({
            color: "#a0764b",
            specular: "#a0764b",
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
            side: THREE.DoubleSide, // Make sure the material is double sided so it renders on both sides
            // map: this.chairTexture  // If you want a texture, but for clear glass, this is optional
        })

        this.spotlightMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#111111",
            shininess: 1,
            side: THREE.DoubleSide,
        })

        this.jarMaterial = new THREE.MeshPhongMaterial({
            color: "#dc5200",
            specular: "#dc5200",
            shininess: 50,
            side: THREE.DoubleSide,
        })


        this.cupMaterial = new THREE.MeshPhongMaterial({
            color: "#c2b7b7",
            specular: "#c2b7b7",
            shininess: 50,
        })
        this.cupMaterial.side = THREE.DoubleSide;

        this.orangeTexture = new THREE.TextureLoader().load('textures/orange_texture.jpg')
        this.orangeMaterial = new THREE.MeshPhongMaterial({
            color: "#ffa500",
            specular: "#ffa500",
            shininess: 5,
            map: this.orangeTexture
        })

        this.pagesTexture = new THREE.TextureLoader().load('textures/pages_texture.jpg')
        this.pagesTexture.wrapS = THREE.RepeatWrapping
        this.pagesTexture.wrapT = THREE.RepeatWrapping
        this.pagesMaterial = new THREE.MeshPhongMaterial({
            color: "#aaaaaa",
            specular: "#aaaaaa",
            shininess: 1,
            map: this.pagesTexture
        })

        const video = document.getElementById('video')
        this.feupKaraokeVideoTexture = new THREE.VideoTexture(video)
        this.feupKaraokeVideoMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#000000",
            shininess: 5,
            map: this.feupKaraokeVideoTexture
        })

        this.flowerCenterMaterial = new THREE.MeshPhongMaterial({
            color: "#ae6f2f",
            specular: "#ae6f2f",
            shininess: 5,
        })

        this.remoteMaterial = new THREE.MeshPhongMaterial({
            color: "#888888",
            specular: "#111111",
            shininess: 0,
        })

        this.buttonMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#ffffff",
            shininess: 5,
        })

        this.powernMaterial = new THREE.MeshPhongMaterial({
            color: "#ff0000",
            specular: "#ff0000",
            shininess: 10,
        })

        this.frameMaterial = new THREE.MeshPhongMaterial({
            color: "#b8860b",
            specular: "#ffffff",
            shininess: 50,
        })

        this.sofaTexture = new THREE.TextureLoader().load('textures/sofa_texture.jpg');
        this.sofaMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#ffffff",
            shininess: 0,
            map: this.sofaTexture
        })

        this.sideboardTexture = new THREE.TextureLoader().load('textures/sideboard_texture.jpg');
        this.sideboardMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#eeeeee",
            shininess: 0,
            map: this.sideboardTexture
        })

        this.sofaSimpleTexture = new THREE.TextureLoader().load('textures/sofa_sit_texture.jpg');
        this.sofaSimpleMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#ffffff",
            shininess: 0,
            map: this.sofaSimpleTexture
        })

        this.armChairTexture = new THREE.TextureLoader().load('textures/armchair_texture.webp');
        this.armChairMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#ffffff",
            shininess: 0,
            map: this.armChairTexture
        })

        this.coverTexture = new THREE.TextureLoader().load('textures/book_cover.png');
        this.coverTexture.wrapS = THREE.RepeatWrapping;
        this.coverTexture.wrapT = THREE.RepeatWrapping;

        // Create the material using the loaded texture
        this.coverMaterial = new THREE.MeshPhongMaterial({
            map: this.coverTexture
        })

        this.spineTexture = new THREE.TextureLoader().load('textures/spine_book.png');
        this.spineTexture.wrapS = THREE.RepeatWrapping;
        this.spineTexture.wrapT = THREE.RepeatWrapping;
        this.spineTexture.rotation=Math.PI;

        // Create the material using the loaded texture
        this.spineMaterial = new THREE.MeshPhongMaterial({
            map: this.spineTexture
        })

        this.cover2Texture = new THREE.TextureLoader().load('textures/book2_cover.png');
        this.cover2Texture.wrapS = THREE.RepeatWrapping;
        this.cover2Texture.wrapT = THREE.RepeatWrapping;

        // Create the material using the loaded texture
        this.cover2Material = new THREE.MeshPhongMaterial({
            map: this.cover2Texture
        })

        this.spine2Texture = new THREE.TextureLoader().load('textures/book2_spine.png');
        this.spine2Texture.wrapS = THREE.RepeatWrapping;
        this.spine2Texture.wrapT = THREE.RepeatWrapping;

        // Create the material using the loaded texture
        this.spine2Material = new THREE.MeshPhongMaterial({
            map: this.spine2Texture
        })

        this.cover3Texture = new THREE.TextureLoader().load('textures/book3_cover.png');
        this.cover3Texture.wrapS = THREE.RepeatWrapping;
        this.cover3Texture.wrapT = THREE.RepeatWrapping;

        // Create the material using the loaded texture
        this.cover3Material = new THREE.MeshPhongMaterial({
            map: this.cover3Texture
        })

        this.spine3Texture = new THREE.TextureLoader().load('textures/book3_spine.png');
        this.spine3Texture.wrapS = THREE.RepeatWrapping;
        this.spine3Texture.wrapT = THREE.RepeatWrapping;

        // Create the material using the loaded texture
        this.spine3Material = new THREE.MeshPhongMaterial({
            map: this.spine3Texture
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
        this.app.scene.add(this.buildHouse())
    }

    buildHouse() {

        // ------------------------------------ CONSTANTS ------------------------------------

        const wallHeight = 35;
        const floorWidth = 100;
        const tableWidth = 14;
        const tableLength = 20;
        const tableHeight = 0.5;
        const tableLegRadius = 0.6;
        const tableLegHeight = 8;
        const chairWidth = 5;
        const chairLength = 5;
        const chairHeight = 6;
        const dishRadiusTop = 3.8;
        const dishRadiusBottom = 2.8;
        const dishHeight = 0.3;
        const cakeRadius = 3;
        const cakeHeight = 2;
        const cakeRadialSegments = 40;
        const cakeHeightSegments = 1;
        const cakeThetaLength = 5.5;
        const spotlightHeight = 18;
        const spotlightColor = new THREE.Color("#fffaf0");
        const spotlightIntensity = 1000;
        const spotlightDistance = 20;
        const spotlightDecay = 1;
        const spotlightAngle = 0.4;
        const spotlightPenumbra = 0.3;
        const frameSize = 12;
        const frameThickness = 0.5;
        const windowWidth = 40;
        const windowHeight = 18;
        const windowThickness = 0.5;
        const doorWidth = 15;
        const doorHeight = 25;
        const doorThickness = 1;
        const rugWidth = 30;
        const rugHeight = 25;
        const rugThickness = 0.2;
        const candleRadius = 0.09;
        const candleHeight = 1;
        const candleBaseHeight = 0.1;
        const candleFlameHeight = 0.15;
        const glassRadiusBottom = 0.4;
        const glassRadiusTop = 0.55;
        const glassHeight = 1.5;
        const lampRadius = 3;
        const lampHeight = 5;
        const lampWireHeight = 5;
        const beetleSize = 0.65;
        const beetleColor = "#FFA500";
        const springPosition = { x: -7, y: 0, z: -5 };
        const springRadius = 0.5;
        const springHeight = 3;
        const springSegments = 500;
        const springColor = "#706f6f";
        const springThickness = 0.009;
        const televisionWidth = 18.25;
        const televisionHeight = 32.25;
        const televisionThickness = 1;
        const televisionStandHeight = 0.5;
        const windowSpotlightColor = new THREE.Color("#ffe285");
        const windowSpotlightIntensity = 150;
        const windowSpotlightDistance = 200;
        const windowSpotlightDecay = 1;
        const windowSpotlightAngle = 0.50;
        const coffeeTableRadius = 6
        const coffeeTableHeight = 0.40
        const coffeeTableLegRadius = 0.5
        const coffeeTableLegHeight = 4
        const sideboardDepth = 7.5
        const sideboardHeight = 5.5
        const bookWidth = 2.5
        const bookHeight = 3.5
        const bookDepth = 0.7
        const coverWidth = 2.63
        const coverHeight = 3.6
        const coverDepth = 0.1
        const remoteWidth = 1.0
        const remoteHeight = 2.5
        const remoteDepth = 0.35
        const buttonSize = 0.15
        const cableBoxWidth = 4.0
        const cableBoxHeight = 1.0
        const cableBoxDepth = 3.0
        const sofaBaseWidth = 23
        const sofaBaseDepth = 7.5
        const sofaBaseHeight = 4.5
        const sofaArmWidth = 2.5
        const sofaArmHeight = 3
        const sofaBackHeight = 6.5
        const sofaBackDepth = 3
        const armchairBaseWidth = 6.5
        const armchairBaseDepth = 6.5
        const armchairBaseHeight = 2
        const armchairBackHeight = 7
        const armchairBackDepth = 2
        const armchairArmWidth = 2
        const armchairArmHeight = 2
        const armchairLegHeight = 5
        const armchairLegRadius = 0.6

        // ------------------------------------ END CONSTANTS ------------------------------------

        // ------------------------------------ HOUSE ------------------------------------

        const house = new MyHouse(floorWidth, wallHeight, this.planeMaterial, this.wallMaterial, windowWidth, windowHeight);
        house.receiveShadow = true;
        house.createLights();

        // ------------------------------------ END HOUSE ------------------------------------


        //-----------------------------------------------TABLE-----------------------------------------------
        const table = new MyTable().build(tableWidth, tableHeight, tableLength, this.tableMaterial, tableLegRadius, tableLegHeight, this.legMaterial);
        house.mesh.add(table);

        const chair1 = new MyChair().build(chairWidth, chairLength, chairHeight, this.chairMaterial);
        chair1.position.y = - (tableHeight + tableLegHeight) * 0.9;
        chair1.position.z = - tableWidth / 2;
        chair1.castShadow = true;
        table.add(chair1);

        const chair2 = new MyChair().build(chairWidth, chairLength, chairHeight, this.chairMaterial);
        chair2.position.y = - (tableHeight + tableLegHeight) * 0.9;
        chair2.position.z = tableWidth / 2;
        chair2.rotation.y = Math.PI;
        table.add(chair2);

        const chair3 = new MyChair().build(chairWidth, chairLength, chairHeight, this.chairMaterial);
        chair3.position.x = -tableLength / 2;
        chair3.position.y = - (tableHeight + tableLegHeight) * 0.9;
        chair3.rotation.y = Math.PI / 2;
        table.add(chair3);

        const chair4 = new MyChair().build(chairWidth, chairLength, chairHeight, this.chairMaterial);
        chair4.position.x = tableLength / 2;
        chair4.position.y = - (tableHeight + tableLegHeight) * 0.9;
        chair4.rotation.y = -Math.PI / 2;
        table.add(chair4);

        const dish = new MyDish().build(dishRadiusTop, dishRadiusBottom, dishHeight, this.dishMaterial);
        dish.position.y = dishHeight;
        table.add(dish);

        const cake = new MyCake().build(cakeRadius, cakeHeight, this.cakeMaterial, cakeRadialSegments, cakeHeightSegments, cakeThetaLength);
        cake.position.y = 0.5;
        dish.add(cake);

        const spotLightCake = new THREE.SpotLight(spotlightColor, spotlightIntensity, spotlightDistance, spotlightAngle, spotlightPenumbra, spotlightDecay);
        spotLightCake.castShadow = true;
        spotLightCake.position.y = spotlightHeight;
        spotLightCake.target = cake;
        table.add(spotLightCake);

        const candle = new MyCandle().build(candleRadius, candleHeight, candleBaseHeight, candleFlameHeight, this.candleMaterial, this.flameMaterial);
        candle.position.y = 1.4;
        candle.position.z = -0.1;
        cake.add(candle);

        const candle2 = new MyCandle().build(candleRadius, candleHeight, candleBaseHeight, candleFlameHeight, this.candleMaterial, this.flameMaterial);
        candle2.position.y = 1.4;
        candle2.position.z = -1;
        cake.add(candle2);

        const candle3 = new MyCandle().build(candleRadius, candleHeight, candleBaseHeight, candleFlameHeight, this.candleMaterial, this.flameMaterial);
        candle3.position.y = 1.4;
        candle3.position.x = 1;
        cake.add(candle3);

        const candle4 = new MyCandle().build(candleRadius, candleHeight, candleBaseHeight, candleFlameHeight, this.candleMaterial, this.flameMaterial);
        candle4.position.y = 1.4;
        candle4.position.x = -1;
        cake.add(candle4);

        const candle5 = new MyCandle().build(candleRadius, candleHeight, candleBaseHeight, candleFlameHeight, this.candleMaterial, this.flameMaterial);
        candle5.position.y = 1.4;
        candle5.position.z = -0.5;
        candle5.position.x = -0.5;
        cake.add(candle5);

        const candle6 = new MyCandle().build(candleRadius, candleHeight, candleBaseHeight, candleFlameHeight, this.candleMaterial, this.flameMaterial);
        candle6.position.y = 1.4;
        candle6.position.z = -0.5;
        candle6.position.x = 0.5;
        cake.add(candle6);

        const frame1 = new MyFrame().create(frameSize, frameSize, frameThickness, this.frameMaterial, this.picture1Material);
        house.addObjectWall(1, frame1, 10, 0, frameThickness);

        const frame2 = new MyFrame().create(frameSize, frameSize, frameThickness, this.frameMaterial, this.picture2Material);
        house.addObjectWall(1, frame2, -10, 0, frameThickness);

        const window1 = new MyWindow().create(windowWidth, windowHeight, windowThickness, this.windowBoardMaterial, this.glassMaterial);
        house.addObjectWall(3, window1, 0, 0, 0);

        const door = new MyDoor().build(doorWidth, doorHeight, doorThickness, this.doorMaterial);
        house.addObjectWall(4, door, 0, -5, doorThickness / 2 + 0.01);

        const journal = new MyJournal().build();
        journal.position.y = tableHeight / 2;
        journal.position.x = 5;
        journal.position.z = 5;
        journal.rotation.x = -Math.PI / 2
        table.add(journal);

        const glass1 = new MyGlass().build(glassRadiusTop, glassRadiusBottom, glassHeight, this.glassMaterial);
        glass1.position.y = glassHeight / 2 + tableHeight / 2 + 0.06;
        glass1.position.x = tableLength / 2 - 2;
        table.add(glass1);

        const glass2 = new MyGlass().build(glassRadiusTop, glassRadiusBottom, glassHeight, this.glassMaterial);
        glass2.position.y = glassHeight / 2 + tableHeight / 2 + 0.06;
        glass2.position.x = -tableLength / 2 + 2;
        table.add(glass2);

        const glass3 = new MyGlass().build(glassRadiusTop, glassRadiusBottom, glassHeight, this.glassMaterial);
        glass3.position.y = glassHeight / 2 + tableHeight / 2 + 0.06;
        glass3.position.z = -tableWidth / 2 + 2;
        table.add(glass3);

        const glass4 = new MyGlass().build(glassRadiusTop, glassRadiusBottom, glassHeight, this.glassMaterial);
        glass4.position.y = glassHeight / 2 + tableHeight / 2 + 0.06;
        glass4.position.z = tableWidth / 2 - 2;
        table.add(glass4);

        const spotlightLamp = new MyLamp().build(lampRadius, lampHeight, lampWireHeight, this.spotlightMaterial);
        spotlightLamp.position.y = 1.2;
        spotLightCake.add(spotlightLamp);

        const jar = new MyJar().build(this.jarMaterial);
        table.add(jar);
        jar.position.x = 7;
        jar.position.z = -5;
        jar.position.y = tableHeight + 1;

        const circleFlower = new MyFlower().build({ x: 0, y: 0 }, 0.5, this.flowerCenterMaterial);
        circleFlower.position.y = 3;
        jar.add(circleFlower);

        let cup = new MyCup().build(1.5, 64, 32, Math.PI, Math.PI, 0, Math.PI, this.cupMaterial)
        cup.rotation.x = -Math.PI / 2
        cup.position.y = tableHeight + 1.68
        cup.position.x = -tableWidth / 2
        cup.position.z = -tableLength / 4
        table.add(cup)
        cup.scale.set(1.3, 1.3, 1.3)

        let orange = new THREE.SphereGeometry(0.4, 64, 32, 0, 2 * Math.PI, 0, Math.PI)

        let orangeMesh1 = new THREE.Mesh(orange, this.orangeMaterial)
        orangeMesh1.position.z = -1.5 + 0.4 //-cupRadius + orangeRadius
        cup.add(orangeMesh1)

        let orangeMesh2 = new THREE.Mesh(orange, this.orangeMaterial)
        orangeMesh2.position.z = -1.1 + 0.4 //-cupRadius + orangeRadius
        orangeMesh2.position.y = 0.75
        cup.add(orangeMesh2)

        let orangeMesh3 = new THREE.Mesh(orange, this.orangeMaterial)
        orangeMesh3.position.z = -1.1 + 0.4 //-cupRadius + orangeRadius
        orangeMesh3.position.y = -0.75
        cup.add(orangeMesh3)

        let orangeMesh4 = new THREE.Mesh(orange, this.orangeMaterial)
        orangeMesh4.position.z = -1.1 + 0.4
        orangeMesh4.position.x = -0.75 //-cupRadius + orangeRadius
        cup.add(orangeMesh4)

        let orangeMesh5 = new THREE.Mesh(orange, this.orangeMaterial)
        orangeMesh5.position.z = -1.1 + 0.4
        orangeMesh5.position.x = 0.75 //-cupRadius + orangeRadius
        cup.add(orangeMesh5)

        const beetle = new MyBeetle().build({ x: 0, y: 0 }, beetleSize, beetleColor);
        const frameBeetle = new MyFrame().create(frameSize, frameSize, frameThickness, this.tableMaterial, beetle, true, { x: -5.15, y: -2.6, z: 0.5 });
        house.addObjectWall(1, frameBeetle, 30, 0, frameThickness);

        table.position.z = -25
        table.position.x = 25

        //-----------------------------------------------END OF TABLE-----------------------------------------------

        //-----------------------------------------------WINDOW-----------------------------------------------
        const landscape = new THREE.Mesh(new THREE.PlaneGeometry(160, 72), this.windowMaterial);
        landscape.rotation.y = - Math.PI / 2;
        landscape.position.x = +100;
        landscape.position.y = 20;
        this.app.scene.add(landscape);

        const spotLightWindow = new THREE.SpotLight(windowSpotlightColor, windowSpotlightIntensity, windowSpotlightDistance, windowSpotlightAngle, spotlightPenumbra, windowSpotlightDecay)
        spotLightWindow.position.set(100, 30, 0)
        spotLightWindow.target.position.set(0, -15, 0)
        spotLightWindow.castShadow = true;

        this.app.scene.add(spotLightWindow)

        //-----------------------------------------------END OF WINDOW-----------------------------------------------

        //-----------------------------------------------LIVING ROOM-----------------------------------------------

        const television = new MyTelevision().build(televisionWidth, televisionHeight, televisionThickness, televisionStandHeight, this.feupKaraokeVideoMaterial);
        house.addObjectWall(2, television, 0, 0, televisionThickness / 2 + 0.1);

        const rug = new MyRug().build(rugWidth, rugHeight, rugThickness, this.rugMaterial);
        rug.position.y = rugThickness / 2 * 1.05;
        rug.position.z = 25
        house.mesh.add(rug);

        const coffeeTable = new MyCoffeeTable().build(coffeeTableRadius, coffeeTableHeight, this.tableMaterial, coffeeTableLegRadius, coffeeTableLegHeight, this.legMaterial)
        coffeeTable.castShadow = true;
        coffeeTable.rotation.x = -Math.PI / 2
        coffeeTable.position.z = -(coffeeTableHeight + coffeeTableLegHeight) * 0.8

        rug.add(coffeeTable);

        const sideboard = new MySideboard().build(televisionWidth * 2.3, sideboardHeight, sideboardDepth, this.sideboardMaterial)
        sideboard.rotation.x = -Math.PI / 2
        sideboard.rotation.y = Math.PI
        sideboard.position.y = 21
        sideboard.position.z = -sideboardHeight / 2
        rug.add(sideboard)

        const book = new MyBook().build(bookWidth, bookHeight, bookDepth, this.pagesMaterial, coverWidth, coverHeight, coverDepth, this.coverMaterial,this.spineMaterial)
        book.rotation.x = Math.PI / 2
        book.position.y = coffeeTableHeight + 0.2
        book.position.z = -2
        book.position.x = -3
        coffeeTable.add(book)

        const book2 = new MyBook().build(bookWidth, bookHeight, bookDepth, this.pagesMaterial, coverWidth, coverHeight, coverDepth, this.cover2Material, this.spine2Material)
        book2.rotation.y = Math.PI / 2
        book2.position.x = 0.5
        book2.position.y = 1.85
        book2.position.z = -1
        sideboard.add(book2)

        const book3 = new MyBook().build(bookWidth, bookHeight, bookDepth, this.pagesMaterial, coverWidth, coverHeight, coverDepth, this.cover3Material, this.spine3Material)
        book3.rotation.y = Math.PI / 2
        book3.rotation.x = Math.PI
        book3.position.x = bookDepth + coverDepth + 0.7
        book3.position.y = 1.85
        book3.position.z = -1
        sideboard.add(book3)

        const book4 = new MyBook().build(bookWidth, bookHeight, bookDepth, this.pagesMaterial, coverWidth, coverHeight, coverDepth, this.cover3Material, this.spine3Material)
        book4.rotation.y = Math.PI / 2
        book4.position.x = (0.5 + bookDepth + coverDepth) * 2
        book4.position.y = 1.85
        book4.position.z = -1
        sideboard.add(book4)

        const book5 = new MyBook().build(bookWidth, bookHeight, bookDepth, this.pagesMaterial, coverWidth, coverHeight, coverDepth, this.cover2Material, this.spine2Material)
        book5.rotation.y = Math.PI / 2
        book5.rotation.x = Math.PI
        book5.position.x = (0.5 + bookDepth + coverDepth) * 3
        book5.position.y = 1.85
        book5.position.z = -1
        sideboard.add(book5)

        const book6 = new MyBook().build(bookWidth, bookHeight, bookDepth, this.pagesMaterial, coverWidth, coverHeight, coverDepth, this.cover2Material, this.spine2Material)
        book6.rotation.y = Math.PI / 2
        book6.position.x = (0.5 + bookDepth + coverDepth) * 4
        book6.position.y = 1.85
        book6.position.z = -1
        sideboard.add(book6)

        const book7 = new MyBook().build(bookWidth, bookHeight, bookDepth, this.pagesMaterial, coverWidth, coverHeight, coverDepth, this.cover3Material, this.spine3Material)
        book7.rotation.y = Math.PI / 2
        book7.rotation.x = Math.PI
        book7.position.x = (0.5 + bookDepth + coverDepth) * 5
        book7.position.y = 1.85
        book7.position.z = -1
        sideboard.add(book7)

        const spring = new MySpring().build(springPosition, springRadius, springHeight, springSegments, springColor, springThickness);
        spring.position.x = 3;
        spring.position.y = -4.1;
        spring.rotation.x = Math.PI / 2;
        sideboard.add(spring);

        const remote = new MyRemote().build(remoteWidth, remoteHeight, remoteDepth, this.remoteMaterial, buttonSize, this.buttonMaterial, this.powernMaterial);
        remote.rotation.x = -Math.PI / 2
        remote.position.x = -10;
        remote.position.y = remoteDepth;
        sideboard.add(remote);

        const cableBox = new MyCableBox().build(cableBoxWidth, cableBoxHeight, cableBoxDepth, this.remoteMaterial, this.powerMaterial);
        cableBox.rotation.y = -Math.PI / 2;
        cableBox.position.x = -13;
        cableBox.position.y = cableBoxHeight * 0.8;
        sideboard.add(cableBox);

        const sofa = new MySofa().build(sofaBaseWidth, sofaBaseDepth, sofaBaseHeight, sofaArmWidth, sofaArmHeight, sofaBackHeight, sofaBackDepth, this.sofaMaterial, this.sofaMaterial, this.sofaSimpleMaterial, this.sofaMaterial);
        sofa.rotation.x = -Math.PI / 2;
        sofa.position.y = -rugHeight / 2 - sofaBaseDepth / 2;
        sofa.position.z = -sofaBaseHeight / 2;
        sofa.castShadow = true;
        sofa.receiveShadow = true;
        rug.add(sofa);

        //build(baseWidth, baseDepth, baseHeight, armWidth, armHeight, backHeight, backDepth, legHeight, legRadius, legMaterial, baseMaterial, armMaterial, backMaterial)
        const armchair = new MyArmchair().build(armchairBaseWidth, armchairBaseDepth, armchairBaseHeight, armchairArmWidth, armchairArmHeight, armchairBackHeight, armchairBackDepth, armchairLegHeight, armchairLegRadius, this.tableMaterial, this.armChairMaterial, this.armChairMaterial, this.armChairMaterial);
        armchair.rotation.x = -Math.PI / 2;
        armchair.rotation.y = -Math.PI / 2;
        armchair.position.z = -(armchairBaseHeight + armchairBackHeight) / 2;
        armchair.position.x = rugWidth / 1.6
        armchair.castShadow = true;
        armchair.receiveShadow = true;
        rug.add(armchair);
        //-----------------------------------------------END OF LIVING ROOM-----------------------------------------------

        return house.mesh
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
}

export { MyContents };