import { MyGameState } from "./MyGameState.js"
import * as THREE from 'three'

class RaceState extends MyGameState{
    constructor(gameStateManager, stateInfo){
        super(gameStateManager, stateInfo)
        this.name = "race"
        this._loadVehicles()
        this._createPovCameras()
    }

    _createScene(){
        this.circuit = this.stateInfo.circuit
        this.scene = this.circuit.scene
    }

    _createCameras(){
        this.cameras = this.circuit.cameras
        this.activeCameraName = 'general'
    }

    _loadVehicles(){
        const slots = this.circuit.slots.filter(slot => slot.object === "track")
        if(slots.length < 2){
            throw new Error("Not enough slots")
        }

        this.vehiclePlayer = this.stateInfo.vehicles[this.stateInfo.playerVehicle]
        this.opponentVehicle = this.stateInfo.vehicles[this.stateInfo.opponentVehicle]

        this.vehiclePlayer.setRotation(slots[0].rotation)
        this.vehiclePlayer.setPosition({x: slots[0].position[0], y: slots[0].position[1], z: slots[0].position[2]})

        this.opponentVehicle.setRotation(slots[1].rotation)
        this.opponentVehicle.setPosition({x: slots[1].position[0], y: slots[1].position[1], z: slots[1].position[2]})

        this.scene.add(this.vehiclePlayer.mesh)
        this.scene.add(this.opponentVehicle.mesh)
    }

    _createPovCameras(){
        const pov1 = THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
        pov1.position.set(0, 10, 0)
        
    }

}

export { RaceState }