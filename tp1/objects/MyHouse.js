import * as THREE from 'three';
import { MyLed } from './MyLed.js';

/**
 * A class representing a house object.
 */
class MyHouse {

    /**
     * Builds a house object with the given parameters.
     * @param {number} floorWidth - The width of the floor.
     * @param {number} wallHeight - The height of the walls.
     * @param {THREE.Material} floorMaterial - The material for the floor.
     * @param {THREE.Material} wallMaterial - The material for the walls.
     * @param {number} windowWidth - The width of the window (optional).
     * @param {number} windowHeight - The height of the window (optional).
     */
    constructor(floorWidth, wallHeight, floorMaterial, wallMaterial, windowWidth = 0, windowHeight = 0) {
        this.floorWidth = floorWidth;
        this.wallHeight = wallHeight;
        this.floorMaterial = floorMaterial;
        this.wallMaterial = wallMaterial;
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        this.mesh = new THREE.Mesh();
        this.build();
    }

    /**
     * Builds the house object.
     */
    build() {
        // Create the floor
        const floor = new THREE.PlaneGeometry(this.floorWidth, this.floorWidth);
        this.floorMesh = new THREE.Mesh(floor, this.floorMaterial);
        this.floorMesh.receiveShadow = true;
        this.floorMesh.castShadow = false;
        this.floorMesh.rotation.x = -Math.PI / 2;

        // Create the roof
        const roofMesh = new THREE.Mesh(floor, this.wallMaterial);
        roofMesh.receiveShadow = false;
        roofMesh.castShadow = false;
        roofMesh.position.z = this.wallHeight;
        roofMesh.rotation.x = Math.PI;
        roofMesh.castShadow = true;
        this.floorMesh.add(roofMesh);

        // Create the walls
        const wall = new THREE.PlaneGeometry(this.floorWidth, this.wallHeight);

        this.wallMesh1 = new THREE.Mesh(wall, this.wallMaterial);
        this.wallMesh1.receiveShadow = true;
        this.wallMesh1.castShadow = false;
        this.wallMesh1.rotation.x = Math.PI / 2;
        this.wallMesh1.position.y = this.floorWidth / 2;
        this.wallMesh1.position.z = this.wallHeight / 2;
        this.floorMesh.add(this.wallMesh1);

        this.wallMesh2 = new THREE.Mesh(wall, this.wallMaterial);
        this.wallMesh2.receiveShadow = true;
        this.wallMesh2.castShadow = false;
        this.wallMesh2.rotation.x = -Math.PI / 2;
        this.wallMesh2.position.y = -this.floorWidth / 2;
        this.wallMesh2.position.z = this.wallHeight / 2;
        this.wallMesh2.rotation.z = Math.PI;
        this.floorMesh.add(this.wallMesh2);

        this.wallMesh4 = new THREE.Mesh(wall, this.wallMaterial);
        this.wallMesh4.receiveShadow = true;
        this.wallMesh4.castShadow = false;
        this.wallMesh4.rotation.x = Math.PI / 2;
        this.wallMesh4.rotation.y = Math.PI / 2;
        this.wallMesh4.position.x = -this.floorWidth / 2;
        this.wallMesh4.position.z = this.wallHeight / 2;
        this.wallMesh4.receiveShadow = true;
        this.floorMesh.add(this.wallMesh4);

        if (this.windowHeight === 0 || this.windowWidth === 0) {
            this.wallMesh3 = new THREE.Mesh(wall, this.wallMaterial);
        } else {
            const width1 = this.floorWidth;
            const height1 = (this.wallHeight - this.windowHeight) / 2;
            const width2 = (this.floorWidth - this.windowWidth) / 2;

            const topGeometry = new THREE.PlaneGeometry(width1, height1);
            const sideGeometry = new THREE.PlaneGeometry(width2, this.windowHeight);
            const wallMesh31 = new THREE.Mesh(topGeometry, this.wallMaterial);
            const wallMesh32 = new THREE.Mesh(topGeometry, this.wallMaterial);
            const wallMesh33 = new THREE.Mesh(sideGeometry, this.wallMaterial);
            const wallMesh34 = new THREE.Mesh(sideGeometry, this.wallMaterial);

            wallMesh31.position.y = 13.25;
            wallMesh32.position.y = -13.25;
            wallMesh33.position.x = -35;
            wallMesh34.position.x = 35;

            this.wallMesh3 = new THREE.Mesh();
            this.wallMesh3.add(wallMesh31);
            this.wallMesh3.add(wallMesh32);
            this.wallMesh3.add(wallMesh33);
            this.wallMesh3.add(wallMesh34);
        }
        this.wallMesh3.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = false;
            }
        });
        this.wallMesh3.rotation.x = Math.PI / 2;
        this.wallMesh3.rotation.y = -Math.PI / 2;
        this.wallMesh3.position.x = this.floorWidth / 2;
        this.wallMesh3.position.z = this.wallHeight / 2;

        this.floorMesh.add(this.wallMesh3);
        this.mesh.add(this.floorMesh);
    }

    /**
     * Creates lights for the house.
     * @param {string} color - The color of the lights.
     * @param {number} intensity - The intensity of the lights.
     * @param {number} distance - The distance of the lights.
     * @param {number} decay - The decay of the lights.
     */
    createLights(color = "#ffffff", intensity = 150, distance = 50, decay = 2) {
        const pointLightsPositions = [
            [-this.floorWidth / 4, this.wallHeight * 0.9, 0],
            [0, this.wallHeight * 0.9, this.floorWidth / 4],
            [0, this.wallHeight * 0.9, -this.floorWidth / 4],
            [this.floorWidth / 4, this.wallHeight * 0.9, 0],
            [this.floorWidth / 3, this.wallHeight * 0.9, this.floorWidth / 3],
            [this.floorWidth / 3, this.wallHeight * 0.9, -this.floorWidth / 3],
            [-this.floorWidth / 3, this.wallHeight * 0.9, this.floorWidth / 3],
            [-this.floorWidth / 3, this.wallHeight * 0.9, -this.floorWidth / 3]
        ];

        for (const pointLightPosition of pointLightsPositions) {
            const pointLight = new THREE.PointLight(color, intensity, distance, decay);
            pointLight.position.set(...pointLightPosition);
            const led = new MyLed().build(2, 0.7);
            led.position.y = 3.05;
            pointLight.add(led);
            this.mesh.add(pointLight);
        }
    }

    /**
     * Adds an object to a wall of the house.
     * @param {number} numWall - The number of the wall to add the object to.
     * @param {THREE.Object3D} object - The object to add.
     * @param {number} x - The x position of the object (optional).
     * @param {number} y - The y position of the object (optional).
     * @param {number} z - The z position of the object (optional).
     * @param {number} rotation - The rotation of the object (optional).
     */
    addObjectWall(numWall, object, x = 0, y = 0, z = 0.1, rotation = 0) {
        if (numWall === 1) {
            this.wallMesh1.add(object);
        } else if (numWall === 2) {
            this.wallMesh2.add(object);
        } else if (numWall === 3) {
            this.wallMesh3.add(object);
        } else if (numWall === 4) {
            this.wallMesh4.add(object);
        }

        object.position.set(x, y, z);
        object.rotation.y = rotation;
    }
}

export { MyHouse };