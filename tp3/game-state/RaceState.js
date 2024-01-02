import {MyGameState} from "./MyGameState.js"
import {collisionDetection, checkVehicleOnTrack, checkCollisionVehicleOnVehicle} from "../collisions/collisions.js"
import {MyAutonomousVehicle} from "../vehicle/MyAutonomousVehicle.js";
import {MyControllableVehicle} from "../vehicle/MyControllableVehicle.js";

import * as THREE from 'three'

class RaceState extends MyGameState {
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo)
        this.name = "race"
        this.numLaps = 1

        this._loadVehicles()
        this._createPovCameras()
        this.setCheckPointsInfo()


        // The cars start beyond the first checkpoint
        // So we need to start the lap counter at -1
        this.playerLap = -1
        this.opponentLap = -1

        this.playerFinished = false
        this.opponentFinished = false

        this.time = new THREE.Clock()
        this.time.start()
    }

    createScene() {
        this.circuit = this.stateInfo.circuit
        this.scene = this.circuit.scene
    }

    createCameras() {
        this.cameras = this.circuit.cameras
        this.activeCameraName = 'podium'
    }

    _loadVehicles() {
        const slots = this.circuit.slots.filter(slot => slot.object === "track")
        if (slots.length < 2) {
            throw new Error("Not enough slots")
        }

        this.vehiclePlayer = MyControllableVehicle.fromVehicle(this.stateInfo.vehicles[this.stateInfo.playerVehicle])
        this.opponentVehicle = MyAutonomousVehicle.fromVehicle(this.stateInfo.vehicles[this.stateInfo.opponentVehicle], this.circuit.track.pointsGeoJSON, this.circuit.track._getPath(), this.stateInfo.difficulty)

        this.vehiclePlayer.setRotation(slots[0].rotation)
        this.vehiclePlayer.setPosition({x: slots[0].position[0], y: slots[0].position[1], z: slots[0].position[2]})

        this.opponentVehicle.setRotation(slots[1].rotation)
        this.opponentVehicle.setPosition({x: slots[1].position[0], y: slots[1].position[1], z: slots[1].position[2]})

        this.scene.add(this.vehiclePlayer.mesh)
        this.scene.add(this.opponentVehicle.mesh)
    }

    _createPovCameras() {
        const pov1 = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
        const pov2 = pov1.clone()
        const pov3 = pov1.clone()
        const pov4 = pov1.clone()

        pov1.followObject = this.vehiclePlayer.mesh
        pov1.followObjectDistance = 5
        pov1.followObjectHeight = 2

        pov2.followObject = this.vehiclePlayer.mesh
        pov2.followObjectDistance = 2
        pov2.followObjectHeight = 0.5

        pov3.followObject = this.vehiclePlayer.mesh
        pov3.followObjectDistance = 2
        pov3.followObjectHeight = 20

        pov4.followObject = this.vehiclePlayer.mesh
        pov4.followObjectDistance = -7
        pov4.followObjectHeight = 2

        this.cameras['pov1'] = pov1
        this.cameras['pov2'] = pov2
        this.cameras['pov3'] = pov3
        this.cameras['pov4'] = pov4

        this.orderCameras = ['pov2', 'pov3', 'pov4', 'general', 'pov1']
        this.changeActiveCamera('pov1')
    }

    _createDocumentListeners() {
        this.listeners.push({
            type: 'keydown',
            handler: this.keyHandler.bind(this)
        })
        this.listeners.push({
            type: 'keyup',
            handler: this.keyHandler.bind(this)
        })
    }

    keyHandler(event) {
        if (event.code === 'KeyV' && event.type === 'keydown') {
            this._changeCamera()
        }
        if (event.code === 'KeyT' && event.type === 'keydown') {
            this._tpToLastCheckpoint()
        } else if (event.code === 'Escape' && event.type === 'keydown') {
            this.gameStateManager.changeState({
                name: 'pause',
                playerVehicle: this.stateInfo.playerVehicle,
                circuit: this.stateInfo.circuit,
                vehicles: this.stateInfo.vehicles,
                opponentVehicle: this.stateInfo.opponentVehicle,
                circuitName: this.stateInfo.circuitName,
                playerName: this.stateInfo.playerName,
                difficulty: this.stateInfo.difficulty,
            })
        } else {
            this.vehiclePlayer.controlCar(event)
        }
    }

    _changeCamera() {
        const newActiveCamera = this.orderCameras.shift()
        this.changeActiveCamera(newActiveCamera)
        this.orderCameras.push(newActiveCamera)
    }

    update() {
        if (!this.opponentFinished) {
            this.opponentVehicle.update();

            // Check if the opponent finished a lap
            // By checking if the current key point is the first one
            if (this.opponentVehicle.currentKeyPointIndex === 0 && this.opponentVehicle.currentKeyPointIndex !== this.opponentVehicle.previousKeyPointIndex) {
                this.opponentLap++;
            }
        }

        if (!this.playerFinished && this.vehiclePlayer.update()) {
            this.updateCheckPoint();
            checkVehicleOnTrack(this.vehiclePlayer, this.circuit.track);
            if (!this.opponentFinished) {
                checkCollisionVehicleOnVehicle(this.vehiclePlayer, this.opponentVehicle);
            }
            collisionDetection(this.vehiclePlayer, this.circuit.rTree);
        }

        this.isGameOver();
    }

    setCheckPointsInfo() {
        this.checkPoints = this.circuit.track.checkPoints
        this.widthTrack = this.circuit.track.width
        this.activeCheckPoint = 0
        this.activeRayCheckPoint = new THREE.Raycaster(this.checkPoints[this.activeCheckPoint].pk1,
            this.checkPoints[this.activeCheckPoint].direction,
            0,
            this.widthTrack)
    }

    updateCheckPoint() {
        if (this.activeRayCheckPoint.intersectObject(this.vehiclePlayer.mesh).length > 0) {
            this.activeCheckPoint = (this.activeCheckPoint + 1) % this.checkPoints.length

            this.activeRayCheckPoint = new THREE.Raycaster(this.checkPoints[this.activeCheckPoint].pk1,
                this.checkPoints[this.activeCheckPoint].direction,
                0,
                this.widthTrack)

            console.log(`Checkpoint ${this.activeCheckPoint}`)
            if (this.activeCheckPoint === 1) {
                console.log("Player - Lap completed")
                this.playerLap++
            }
        }
    }

    _tpToLastCheckpoint() {
        const lastI = this.activeCheckPoint === 0 ? this.checkPoints.length - 1 : this.activeCheckPoint - 1
        const pos = this.checkPoints[lastI].center

        this.vehiclePlayer.setPosition(pos)
        this.vehiclePlayer.setSpeed(0)
    }

    isGameOver() {
        if (this.opponentLap >= this.numLaps && !this.opponentFinished) {
            this.opponentFinished = true
            this.opponentTime = this.time.getElapsedTime()
            this.scene.remove(this.opponentVehicle.mesh)
        }

        if (this.playerLap >= this.numLaps && !this.playerFinished) {
            this.playerFinished = true
            this.playerTime = this.time.getElapsedTime()
            this.scene.remove(this.vehiclePlayer.mesh)
            this.changeActiveCamera('general')
        }

        if (this.playerFinished && this.opponentFinished) {
            this.gameStateManager.changeState(
                {
                    name: 'result',
                    circuit: this.stateInfo.circuit,
                    circuitName: this.stateInfo.circuitName,
                    playerVehicle: this.stateInfo.playerVehicle,
                    opponentVehicle: this.stateInfo.opponentVehicle,
                    playerTime: this.playerTime,
                    opponentTime: this.opponentTime,
                    playerName: this.stateInfo.playerName,
                    difficulty: this.stateInfo.difficulty,
                    vehicles: this.stateInfo.vehicles
                })
        }
    }
}

export {RaceState}