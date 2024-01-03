import {MyGameState} from "./MyGameState.js"
import {collisionDetection, checkVehicleOnTrack, checkCollisionVehicleOnVehicle} from "../collisions/collisions.js"
import {MyAutonomousVehicle} from "../vehicle/MyAutonomousVehicle.js";
import {MyControllableVehicle} from "../vehicle/MyControllableVehicle.js";
import {MyClock} from "../MyClock.js";

import * as THREE from 'three'

class RaceState extends MyGameState {
    /**
     * Constructs an instance of RaceState.
     * @param {MyGameStateManager} gameStateManager - The game state manager.
     * @param {Object} stateInfo - Information about the state.
     */
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo)
        this.name = "race"
        this.numLaps = 1

        this._loadVehicles()
        this._createPovCameras()
        this.createHud()
        this.setCheckPointsInfo()

        // The cars start beyond the first checkpoint
        // So we need to start the lap counter at -1
        this.playerLap = -1
        this.opponentLap = -1

        this.playerFinished = false
        this.opponentFinished = false

        this.clockCollision = new MyClock();
        this.collision = false;

        this.time = new MyClock()
        this.time.start()

        this.hudTimer = new THREE.Clock()
    }

    /**
     * Creates the scene for the race state.
     */
    createScene() {
        this.circuit = this.stateInfo.circuit
        this.scene = this.circuit.scene
    }

    /**
     * Creates cameras for the race state.
     */
    createCameras() {
        this.cameras = this.circuit.cameras
        this.activeCameraName = 'pov1'
    }

    /**
     * Loads vehicles onto the track.
     */
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

    /**
     * Creates point-of-view cameras for the race state.
     */
    _createPovCameras() {
        const pov1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
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
        this.scene.add(this.cameras['pov1'])
    }

    /**
     * Creates document event listeners for key events.
     */
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

    /**
     * Handles key events for controlling the vehicle and changing cameras.
     * @param {Object} event - The key event.
     */
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

    /**
     * Changes the active camera.
     */
    _changeCamera() {
        if (this.activeCameraName === 'pov1') {
            this.cameras['pov1'].clear()
            this.scene.remove(this.cameras['pov1'])
        }

        const newActiveCamera = this.orderCameras.shift()
        this.changeActiveCamera(newActiveCamera)
        this.orderCameras.push(newActiveCamera)

        if (this.activeCameraName === 'pov1') {
            this.scene.add(this.cameras['pov1'])
        }
    }

    /**
     * Updates the race state.
     */
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
        this.updateHud()
        this.isGameOver();
    }

    /**
     * Sets information about checkpoints for the race.
     */
    setCheckPointsInfo() {
        this.checkPoints = this.circuit.track.checkPoints
        this.widthTrack = this.circuit.track.width
        this.activeCheckPoint = 0
        this.activeRayCheckPoint = new THREE.Raycaster(this.checkPoints[this.activeCheckPoint].pk1,
            this.checkPoints[this.activeCheckPoint].direction,
            0,
            this.widthTrack)
    }

    /**
     * Updates the active checkpoint for the vehicle.
     */
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

    /**
     * Teleports the vehicle to the last checkpoint.
     */
    _tpToLastCheckpoint() {
        const lastI = this.activeCheckPoint === 0 ? this.checkPoints.length - 1 : this.activeCheckPoint - 1
        const pos = this.checkPoints[lastI].center

        this.vehiclePlayer.setPosition(pos)
        this.vehiclePlayer.setSpeed(0)
    }

    /**
     * Checks if the game is over and transitions to the result state if necessary.
     */
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
            this.cameras['pov1'].clear()
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

    createHud() {
        this.hud = new THREE.Group()
        this.hud.name = 'hud'

        const lapText = MyGameState.textWhite.transformString(`Lap:`, [1, 1])
        lapText.name = 'lapText'
        lapText.position.set(9, 7, -10)

        this.lapHUD = new THREE.Object3D()
        this.lapHUD.name = 'lap'
        this.lapHUD.position.set(10.7, 7, -10)

        const timeText = MyGameState.textWhite.transformString(`Time:`, [1, 1])
        timeText.name = 'timeText'
        timeText.position.set(4, 7, -10)

        this.timeHUD = new THREE.Object3D()
        this.timeHUD.name = 'time'
        this.timeHUD.position.set(6, 7, -10)

        const speedText = MyGameState.textWhite.transformString(`Speed:`, [1, 1])
        speedText.name = 'speedText'
        speedText.position.set(-3.5, 7, -10)

        this.speedHUD = new THREE.Object3D()
        this.speedHUD.name = 'speed'
        this.speedHUD.position.set(-1, 7, -10)

        this.collisionText = MyGameState.textRed.transformString(`Collision! Time Left:`, [1, 1])
        this.collisionText.name = 'collisionText'
        this.collisionText.position.set(-3.5, 6, -10)
        this.collisionText.visible = false

        this.collisionHUD = new THREE.Object3D()
        this.collisionHUD.name = 'collision'
        this.collisionHUD.position.set(5.5, 6, -10)
        this.collisionHUD.visible = false

        this.hud.add(this.lapHUD)
        this.hud.add(this.timeHUD)
        this.hud.add(this.speedHUD)
        this.hud.add(this.collisionHUD)

        this.hud.add(lapText)
        this.hud.add(timeText)
        this.hud.add(speedText)
        this.hud.add(this.collisionText)
    }

    updateHud() {
        if (this.activeCameraName !== 'pov1') return

        if (this.hudTimer.getElapsedTime() < 0.5) return

        if (this.cameras['pov1'].children.length === 0) {
            this.cameras['pov1'].add(this.hud)
        }

        this.lapHUD.clear()
        this.lapHUD.add(MyGameState.textWhite.transformString(`${this.playerLap <= 0 ? 0 : this.playerLap}/${this.numLaps}`, [1, 1]))

        this.timeHUD.clear()
        const time = this._convertThreeTime(this.time.getElapsedTime())
        this.timeHUD.add(MyGameState.textWhite.transformString(`${time[0]}'${time[1]}''`, [1, 1]))

        this.speedHUD.clear()
        this.speedHUD.add(MyGameState.textWhite.transformString(`${(this.vehiclePlayer.actualSpeed * 1000).toFixed(2)} km/h`, [1, 1]))

        if (this.vehiclePlayer.objectCollided) {
            this.collision = true;
            this.clockCollision.start();

            const duration = this.vehiclePlayer.objectCollided.duration;
            const remainingTime = Math.max(0, duration - this.clockCollision.getElapsedTime());
            const convertedTime = this._convertThreeTime(remainingTime);

            this.collisionHUD.clear()
            this.collisionHUD.add(MyGameState.textRed.transformString(`${convertedTime[0]}'${convertedTime[1]}''`, [1, 1]));

            this.collisionText.visible = true
            this.collisionHUD.visible = true
        } else if (this.collision) {
            this.collisionHUD.clear()
            this.collisionHUD.visible = false
            this.collisionText.visible = false

            this.collision = false;
            this.clockCollision.reset();
        }
        this.hudTimer.start()
    }

    reset() {
        this.time.pause()
        this.opponentVehicle.pause()
        this.cameras['pov1'].clear()
        this.scene.remove(this.cameras['pov1'])
    }

    unpause() {
        this.time.resume()
        setTimeout(() => {
            this.opponentVehicle.resume()
        }, 100);
        this.scene.add(this.cameras['pov1'])
    }

    _convertThreeTime(time) {
        const minutes = Math.floor(time / 60000)
        const seconds = Math.floor((time / 1000) % 60)
        const milliseconds = Math.floor(time % 1000)
        return [minutes, seconds, milliseconds]
    }
}

export {RaceState}