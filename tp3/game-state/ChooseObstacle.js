import {MyGameState} from "./MyGameState.js";
import {MyPicking} from "../MyPicking.js";
import {MyObstacle1, MyObstacle2} from "../circuit/MyObstacles.js";
import {createActivatable} from "../circuit/parser/utils.js";
import * as THREE from "three";

class ChooseObstacle extends MyGameState {
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo);
        this.name = "chooseOpponentCar";
        this.state = "pickingObstacle"
        this.picking = new MyPicking([], 0, 200, this.getActiveCamera(), this.handlePicking.bind(this), this.resetPickedObject.bind(this), ["pointerdown", "pointermove"]);
        this.picking.updateLayer(0)
        this.displayObstacles()
    }

    createScene() {
        this.circuit = this.stateInfo.circuit;
        this.scene = this.circuit.scene;
    }

    createCameras() {
        this.cameras = this.circuit.cameras
        this.activeCameraName = 'parkingLotCam3'
    }

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
            this.putObstacle(object.position)
        }
    }

    resetPickedObject(object) {
        object.traverse(child => {
            if (child.material) {
                child.material.color.set(child.material.originalColor)
                child.material.originalColor = null
            }
        })
    }


    _createDocumentListeners() {
        this.listeners.push({
            type: 'keydown',
            handler: this.keyHandler.bind(this)
        })
    }

    keyHandler(event) {
        if (event.code === "KeyB" && event.type === "keydown") {
            this.gameStateManager.goBack()
        }
    }

    createTrackSensors() {
        this.changeActiveCamera("general")
        this.picking.updateLayer(1)

        this.trackSensors = []

        const bbTrack = new THREE.Box3().setFromObject(this.circuit.track.mesh)

        let sensorMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2))

        for (let x = bbTrack.min.x; x < bbTrack.max.x; x += 2) {
            for (let z = bbTrack.min.z; z < bbTrack.max.z; z += 2) {
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

    reset() {
        this.circuit.scene.remove(this.obstacles)
        this.trackSensors.forEach(sensor => {
            this.circuit.scene.remove(sensor)
        })
    }
    
    putObstacle(pos) {
        console.log("Adding obstacle")
        console.log(pos)
        const posList = [pos.x, 0.2, pos.z]
        const newObstacle = createActivatable('obstacle', this.selectedObstacle.name, posList, 5000)
        this.circuit.rTree.insert(newObstacle)
        this.circuit.scene.add(newObstacle.mesh)
        this.gameStateManager.goBack()
    }
}

export {ChooseObstacle}