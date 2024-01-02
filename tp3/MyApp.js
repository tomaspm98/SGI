import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js'

/**
 * This class contains the application object
 */
class MyApp {
    /**
     * the constructor
     */
    constructor() {
        this.scene = null
        this.stats = null

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 20

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.contents == null
        this.vehicle = null
        this.contents = null
    }
    /**
     * initializes the application
     */
    init() {

        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x101010);

        this.stats = new Stats()
        this.stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        this.initCameras();
        this.setActiveCamera('Perspective')

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor("#000000");

        // Configure renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild(this.renderer.domElement);

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false);

        this.clock = new THREE.Clock()

    }

    updateCameraToFollowTarget(targetObject) {
        if (!targetObject || !this.activeCamera) {
            return;
        }

        const offsetDistance = 5; // Distance behind the vehicle
        const offsetHeight = 3; // Height above the ground

        // Calculate the offset based on the vehicle's rotation
        const offset = new THREE.Vector3(0, 0, - offsetDistance);
        offset.applyQuaternion(targetObject.quaternion);
        offset.y += offsetHeight;

        // Calculate the desired position of the camera
        this.targetPosition = new THREE.Vector3();
        targetObject.getWorldPosition(this.targetPosition);

        this.activeCamera.position.copy(this.targetPosition).add(offset);
        // Set the camera to look at the object
        this.activeCamera.position.lerp(this.activeCamera.position, 0.05); // Smooth transition
        //this.activeCamera.lookAt(targetPosition);
    }

    /**
     * initializes all the cameras
     */
    initCameras() {
        const aspect = window.innerWidth / window.innerHeight;

        // Create a basic perspective camera
        const perspective1 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspective1.position.set(10,10,10)
        this.cameras['Perspective'] = perspective1

        const parkingLot1 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        parkingLot1.position.set(10,15,-200)
        this.cameras['parking_Lot1'] = parkingLot1

        const parkingLot2 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        parkingLot2.position.set(30,15,-200.5)
        this.cameras['parking_Lot2'] = parkingLot2

        const parkingLot3 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        parkingLot3.position.set(40,10,-185)
        this.cameras['parking_Lot3'] = parkingLot3

    }

    /**
     * sets the active camera by name
     * @param {String} cameraName 
     */
    setActiveCamera(cameraName) {
        this.activeCameraName = cameraName
        this.activeCamera = this.cameras[this.activeCameraName]
    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {

        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName]
            document.getElementById("camera").innerHTML = this.activeCameraName

            // call on resize to update the camera aspect ratio
            // among other things
            this.onResize()

            // are the controls yet?
            if (this.controls === null) {
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);
                this.controls.enableZoom = true;
                this.controls.update();
            }
            else {
                this.controls.object = this.activeCamera
                if (this.activeCameraName === 'parking_Lot1') {
                    this.controls.target = new THREE.Vector3(0, 0, -200)
                } else if(this.activeCameraName === 'parking_Lot2') {
                    this.controls.target =new THREE.Vector3(20, 0, -200.5)
                }
                else if (this.activeCameraName === 'Perspective') {
                    this.controls.target = new THREE.Vector3(0, 0, 0)
                }
                else if(this.activeCameraName === 'parking_Lot3') {
                    this.controls.target = new THREE.Vector3(40, 0, -201)
                }


            }
        }
    }

    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    /**
     * 
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
        this.vehicle = this.contents.vehicle;
    }

    /**
     * @param {MyGuiInterface} contents the gui interface object
     */
    setGui(gui) {
        this.gui = gui
    }

    /*setVehicle(vehicle) {
        this.vehicle = vehicle;
    }*/

    /**
    * the main render function. Called in a requestAnimationFrame loop
    */
    render() {    
        this.stats.begin()
        this.updateCameraIfRequired()

        if (this.vehicle && this.vehicle.carMesh) {
            this.updateCameraToFollowTarget(this.vehicle.carMesh);
            const targetPosition = new THREE.Vector3();
            this.vehicle.carMesh.getWorldPosition(targetPosition);
            this.controls.target.copy(targetPosition);
        }

        // update the animation if contents were provided
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.contents.update()
        }

        /*if (this.vehicle) {
            this.vehicle.update();
        }*/

        // required if controls.enableDamping or controls.autoRotate are set to true
        this.controls.update();

        // render the scene
        this.renderer.render(this.scene, this.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame(this.render.bind(this));

        if (this.clock.getElapsedTime()>=60){
            this.clock.stop()
            this.clock.start()
            
            const rgbDataURL = this.renderer.domElement.toDataURL();
            const rgbImage = new Image();
            rgbImage.src = rgbDataURL;
            this.displayCapturedImage(rgbImage);
        }

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }

    displayCapturedImage(image) {
        // Create an HTML img element
        const imgElement = document.createElement('img');
        imgElement.src = image.src;
    
        // Append the img element to a container in the document
        //const container = document.getElementById('imageContainer'); // Replace with the actual container ID
        //container.appendChild(imgElement);
    }
}


export { MyApp };