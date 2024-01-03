import {NormalState, ReducedSpeedState, IncreasedSpeedState, InvertedControlsState, OutState} from './ImpVehicleStates.js'
import {MyVehicle} from './MyVehicle.js'
import * as THREE from 'three'
import {MyVehicleRenderer} from "./parser/MyVehicleRenderer.js";


class MyControllableVehicle extends MyVehicle {

    /**
     * Constructs an instance of MyControllableVehicle.
     * @param {THREE.Mesh} mesh - The mesh representing the vehicle.
     * @param {string} name - The name of the vehicle.
     * @param {number} topSpeed - The top speed of the vehicle.
     * @param {number} minSpeed - The minimum speed of the vehicle.
     * @param {number} accelerationRate - The acceleration rate of the vehicle.
     * @param {number} coastingRate - The coasting rate of the vehicle.
     * @param {number} turnRate - The turn rate of the vehicle.
     * @param {number} brakingRate - The braking rate of the vehicle.
     */
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
        this.objectCollided = null

        this._createStates()

        // To be used in the R-Tree
        this.bb = new THREE.Box3().setFromObject(this.mesh)
    }

    /**
     * Creates an instance of MyControllableVehicle from an existing vehicle.
     * @param {MyVehicle} vehicle - The original vehicle.
     * @returns {MyControllableVehicle} - The controllable vehicle instance.
     */
    static fromVehicle(vehicle) {
        vehicle.mesh.position.x = 0
        vehicle.mesh.position.z = 0
        vehicle.mesh.rotation.set(0, 0, 0)

        return new MyControllableVehicle(vehicle.mesh, vehicle.name, vehicle.topSpeed, vehicle.minSpeed, vehicle.accelerationRate, vehicle.coastingRate, vehicle.turnRate, vehicle.brakingRate)
    }

     /**
     * Creates an instance of MyControllableVehicle from a file using MyVehicleRenderer.
     * @param {string} file - The file path or content representing the vehicle.
     * @returns {MyControllableVehicle} - The controllable vehicle instance.
     */
    static create(file) {
        const vehicleRenderer = new MyVehicleRenderer()
        const [mesh, specs] = vehicleRenderer.render(file)
        return new MyControllableVehicle(mesh, specs.name, specs.topSpeed, specs.minSpeed, specs.acceleration, specs.deceleration, specs.turnRate, specs.brakingRate)
    }

    /**
     * Handles user input to control the vehicle.
     * @param {Event} event - The keyboard event.
     */
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

    /**
     * Updates the vehicle's state and collision information.
     * @returns {boolean} - True if the vehicle is moving, false otherwise.
     */
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

    /**
     * Creates and initializes different states for the vehicle.
     */
    _createStates() {
        this.states = {
            "normal": new NormalState(this),
            "reducedSpeed": new ReducedSpeedState(this),
            "increasedSpeed": new IncreasedSpeedState(this),
            "invertedControls": new InvertedControlsState(this),
            "speedNoReduce": new OutState(this)
        }
        this.currentState = this.states["normal"]
    }

    /**
     * Changes the current state of the vehicle.
     * @param {string} state - The name of the state to change to.
     */
    changeState(state) {
        this.currentState = this.states[state]
    }

    /**
     * Sets the speed of the vehicle.
     * @param {number} speed - The speed to set.
     */
    setSpeed(speed) {
        this.actualSpeed = speed
    }
}

export {MyControllableVehicle};