import {MyGameState} from "./MyGameState.js";
import {MyPicking} from "../MyPicking.js";
import {MyObstacle1, MyObstacle2} from "../circuit/MyObstacles.js";
import {createActivatable} from "../circuit/parser/utils.js";
import * as THREE from "three";

class ChooseObstacle extends MyGameState {
    /**
     * Constructs an instance of ChooseObstacle.
     * @param {MyGameStateManager} gameStateManager - The game state manager.
     * @param {Object} stateInfo - Additional information for the state.
     */
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo);
        this.name = "chooseOpponentCar";
        this.state = "pickingObstacle"
        this.picking = new MyPicking([], 0, 200, this.getActiveCamera(), this.handlePicking.bind(this), this.resetPickedObject.bind(this), ["pointerdown", "pointermove"]);
        this.picking.updateLayer(0)
        this.displayObstacles()
        this.clock = new THREE.Clock()
    }

    /**
     * Creates the scene for ChooseObstacle.
     */
    createScene() {
        this.circuit = this.stateInfo.circuit;
        this.scene = this.circuit.scene;
    }

    /**
     * Creates cameras for ChooseObstacle.
     */
    createCameras() {
        this.cameras = this.circuit.cameras
        this.activeCameraName = 'parkingLotCam3'
    }

    /**
     * Displays obstacles in the scene and adds them to the picking system.
     */
    displayObstacles() {
        this.avaibleSlots = this.circuit.slots.filter(slot => slot.object === "parkingLot3")
        this.obstacles = new THREE.Group()
        this.obstacles.name = "obstacles"

        const obstacle1 = new MyObstacle1(this.avaibleSlots[0].position, [0, 0, 0], [1, 1, 1], 5000)
        this.picking.addPickableObject(obstacle1.mesh)
        obstacle1.mesh.layers.enable(0)
        this.obstacles.add(obstacle1.mesh)

        const obstacle2 = new MyObstacle2(this.avaibleSlots[1].position, [0, 0, 0], [1, 1, 1], 5000)
        this.picking.addPickableObject(obstacle2.mesh)
        obstacle2.mesh.layers.enable(0)
        this.obstacles.add(obstacle2.mesh)

        this.scene.add(this.obstacles)
    }

    /**
     * Handles object picking events.
     * @param {Object} object - The picked object.
     * @param {PointerEvent} event - The pointer event.
     */
    handlePicking(object, event) {
        if (event.type === "pointermove" && this.state === "pickingObstacle") {
            object.traverse((child) => {
                if (child.material) {
                    if (!child.material.originalColor) {
                        child.material.originalColor = child.material.color.clone()
                    }
                    child.material.color.setHex(0xc2db02)
                }
            })
        } else if (event.type === "pointerdown" && this.state === "pickingObstacle") {
            this.selectedObstacle = object
            this.state = "pickingPosition"
            this.createTrackSensors()
        } else if (event.type === "pointerdown" && this.state === "pickingPosition") {
            console.log(this.selectedObstacle)
            console.log(object)
            this.animation(object)
            setTimeout(() => {
                this.putObstacle(object.position)
            }, 7200);
        }
    }
    

    /**
     * Resets the appearance of the picked object.
     * @param {Object} object - The picked object.
     */
    resetPickedObject(object) {
        object.traverse(child => {
            if (child.material) {
                child.material.color.set(child.material.originalColor)
                child.material.originalColor = null
            }
        })
    }


    /**
     * Creates document listeners for key events.
     */
    _createDocumentListeners() {
        this.listeners.push({
            type: 'keydown',
            handler: this.keyHandler.bind(this)
        })
    }

    /**
     * Handles key events for navigation.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    keyHandler(event) {
        if (event.code === "KeyB" && event.type === "keydown") {
            this.gameStateManager.goBack()
        }
    }

    /**
     * Creates track sensors for obstacle placement.
     */
    createTrackSensors() {
        this.changeActiveCamera("general")
        this.picking.updateLayer(1)

        this.trackSensors = []

        const bbTrack = new THREE.Box3().setFromObject(this.circuit.track.mesh)

        let sensorMesh = new THREE.Mesh(new THREE.BoxGeometry(5, 0.1, 5))

        for (let x = bbTrack.min.x; x < bbTrack.max.x; x += 5) {
            for (let z = bbTrack.min.z; z < bbTrack.max.z; z += 5) {
                const sensor = sensorMesh.clone()
                sensor.position.set(x, 0, z)
                sensor.visible = false
                sensor.layers.enable(1)

                this.picking.addPickableObject(sensor)
                this.trackSensors.push(sensor)
                this.scene.add(sensor)
            }
        }
    }

    
    /**
     * Resets the ChooseObstacle state.
     */
    reset() {
        this.circuit.scene.remove(this.obstacles)
        this.trackSensors.forEach(sensor => this.circuit.scene.remove(sensor))
    }
    
    /**
     * Places the selected obstacle in the scene.
     * @param {Vector3} pos - The position to place the obstacle.
     */
    putObstacle(pos) {
        console.log("Adding obstacle")
        console.log(pos)
        const posList = [pos.x, 0.2, pos.z]
        const newObstacle = createActivatable('obstacle', this.selectedObstacle.name, posList, 5000)
        this.circuit.rTree.insert(newObstacle)
        this.circuit.scene.add(newObstacle.mesh)
        this.gameStateManager.goBack()
    }

     /**
     * Initiates the animation for obstacle placement.
     * @param {Object} object - The target object for the animation.
     */
    animation(object){
        let kf = []

        kf.push(...this.selectedObstacle.position)
        kf.push(this.selectedObstacle.position.x, this.selectedObstacle.position.y+20, this.selectedObstacle.position.z)
        kf.push(object.position.x, object.position.y+20, object.position.z)
        kf.push(object.position.x, object.position.y+0.5, object.position.z)

        let times=[]
        times.push(0)
        times.push(1)
        times.push(5)
        times.push(6)

        console.log(kf)

        const positionKF = new THREE.VectorKeyframeTrack('.position', times, kf, THREE.InterpolateLinear);
        this.mixer = new THREE.AnimationMixer(this.selectedObstacle);
        console.log(this.selectedObstacle)
        this.clip = new THREE.AnimationClip('positionAnimation', 10, [positionKF]);
        const action = this.mixer.clipAction(this.clip);
        action.play();
    }

    /**
     * Updates the state.
     */
    update(){
        const delta = this.clock.getDelta(); 
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }
}

export {ChooseObstacle}