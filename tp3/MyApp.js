import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js'
import { MyGameStateManager } from './game-state/MyGameStateManager.js';

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

        this.gameStateManager = null
    }

    /**
     * initializes the application
     */
    init() {

        // Create an empty scene
        this.stats = new Stats()
        this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

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

        this.gameStateManager = new MyGameStateManager(this);
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

            if (this.activeCamera.locked) {
                return
            }

            // are the controls yet?
            if (this.controls === null) {
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);
                this.controls.enableZoom = true;
                this.controls.update();
            } else {
                this.controls.object = this.activeCamera
            }

            if (this.activeCamera.positionTarget) {
                this.controls.target = new THREE.Vector3(...this.activeCamera.positionTarget)
            }
        }
    }

    updateCameraToFollowObject(object) {
        if (!object || !this.activeCamera) {
            return;
        }

        // Calculate the offset based on the vehicle's rotation
        const offset = new THREE.Vector3(0, 0, -this.activeCamera.followObjectDistance);
        offset.applyQuaternion(object.quaternion);
        offset.y += this.activeCamera.followObjectHeight;

        // Calculate the desired position of the camera
        const targetPosition = new THREE.Vector3();
        object.getWorldPosition(targetPosition);

        this.activeCamera.position.copy(targetPosition).add(offset);
        // Set the camera to look at the object
        this.activeCamera.position.lerp(this.activeCamera.position, 0.05); // Smooth transition
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
     * the main render function. Called in a requestAnimationFrame loop
     */
    render() {
        this.stats.begin()
        this.updateCameraIfRequired()


        if (this.activeCamera.followObject) {
            this.updateCameraToFollowObject(this.activeCamera.followObject)
            const objectPosition = new THREE.Vector3()
            this.activeCamera.followObject.getWorldPosition(objectPosition)
            this.controls.target = objectPosition
        }

        if (this.gameStateManager !== null) {
            this.gameStateManager.actualState.update()
        }

        // required if controls.enableDamping or controls.autoRotate are set to true
        if (!this.activeCamera.locked) {
            this.controls.update();
        }

        // render the scene
        this.renderer.render(this.scene, this.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame(this.render.bind(this));

        this.stats.end()
    }
}


export { MyApp };