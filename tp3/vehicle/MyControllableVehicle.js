import {NormalState, ReducedSpeedState, IncreasedSpeedState, InvertedControlsState} from './ImpVehicleStates.js'
import {MyVehicle} from './MyVehicle.js'
import * as THREE from 'three'


class MyControllableVehicle extends MyVehicle {

    constructor(mesh, name, topSpeed, minSpeed, accelerationRate, coastingRate, turnRate, brakingRate) {
        // Variables that describe the vehicle
        super(mesh, name, topSpeed, minSpeed, accelerationRate, coastingRate, turnRate, brakingRate)

        this.actualRotationWheel = 0
        this.actualSpeed = 0

        // Variables that describe the actions of the vehicle
        this.coasting = false
        this.accelerating = false
        this.braking = false
        this.turningLeft = false
        this.turningRight = false
        this.reversing = false
        this.offTrack = false

        this._createStates()

        // To be used in the R-Tree
        this.bb = new THREE.Box3().setFromObject(this.mesh)
    }

    static fromVehicle(vehicle) {
        const newMesh = vehicle.mesh.clone()
        newMesh.position.x = 0
        newMesh.position.z = 0
        newMesh.rotation.set(0, 0, 0)
        
        return new MyControllableVehicle(newMesh, vehicle.name, vehicle.topSpeed, vehicle.minSpeed, vehicle.accelerationRate, vehicle.coastingRate, vehicle.turnRate, vehicle.brakingRate)
    }

    controlCar(event) {
        switch (event.keyCode) {
            case 87: // W
                switch (event.type) {
                    case 'keydown':
                        // If the car is reversing, it can't accelerate
                        if (this.accelerating) {
                            break
                        } else if (!this.reversing && this.actualSpeed >= 0) {
                            this.accelerating = true
                            this.coasting = false
                        }
                        break
                    case 'keyup':
                        if (this.accelerating) {
                            this.accelerating = false
                            this.coasting = true
                        }
                        break
                }
                break
            case 83: // S
                switch (event.type) {
                    case 'keydown':
                        // To avoid putting the lights on when they are already on
                        if (this.braking) {
                            break
                        }
                        for (const light of this.importantNodes.brakelights) {
                            light.visible = true
                        }
                        this.braking = true
                        this.coasting = false
                        break
                    case 'keyup':
                        for (const light of this.importantNodes.brakelights) {
                            light.visible = false
                        }
                        if (this.actualSpeed !== 0 && !this.reversing && !this.accelerating)
                            this.coasting = true
                        this.braking = false
                        break
                }
                break
            case 65: // A
                switch (event.type) {
                    case 'keydown':
                        this.turningRight = true
                        break
                    case 'keyup':
                        this.turningRight = false
                        break
                }
                break
            case 68: // D
                switch (event.type) {
                    case 'keydown':
                        this.turningLeft = true
                        break
                    case 'keyup':
                        this.turningLeft = false
                        break
                }
                break
            case 82: // R
                switch (event.type) {
                    case 'keydown':
                        if (this.reversing) {
                            break
                        } else if (this.actualSpeed <= 0 && !this.accelerating) {
                            for (const light of this.importantNodes.reverselights) {
                                light.visible = true
                            }
                            this.reversing = true
                            this.coasting = false
                        }
                        break
                    case 'keyup':
                        if (this.reversing) {
                            for (const light of this.importantNodes.reverselights) {
                                light.visible = false
                                this.reversing = false
                                this.coasting = true
                            }
                        }
                        break
                }
                break
            case 76: // L
                switch (event.type) {
                    case 'keydown':
                        for (const light of this.importantNodes.headlights) {
                            light.visible = !light.visible
                        }
                        break
                }
                break
        }
    }

    update() {
        // If the vehicle is not doing anything, there is no need to update
        // And return false to indicate that the vehicle is not moving
        // Therefore, is not necessary run the collision detection function

        if (!this.accelerating && !this.reversing && !this.turningLeft && !this.turningRight && !this.coasting && this.actualSpeed === 0 && this.actualRotationWheel === 0) {
            return false
        }
        this.currentState.update()
        this.obb.update(this.mesh.matrixWorld)
        this.bb.setFromObject(this.mesh)
        return true
    }

    _createStates() {
        this.states = {
            "normal": new NormalState(this),
            "reducedSpeed": new ReducedSpeedState(this),
            "increasedSpeed": new IncreasedSpeedState(this),
            "invertedControls": new InvertedControlsState(this)
        }
        this.currentState = this.states["normal"]
    }

    changeState(state) {
        this.currentState = this.states[state]
    }

    setSpeed(speed) {
        this.actualSpeed = speed
    }
}

export {MyControllableVehicle};