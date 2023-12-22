import { MyVehicleRenderer } from './parser/MyVehicleRenderer.js'
import * as THREE from 'three'


class MyVehicle {
    static createVehicle(file, initialPosition = { x: 0, y: 0, z: 0 }, initialRotation = 0) {
        const vehicleRenderer = new MyVehicleRenderer()
        const [mesh, specs, importantNodes] = vehicleRenderer.render(file)
        return new MyVehicle(mesh, importantNodes, specs.topSpeed, specs.minSpeed, specs.acceleration, specs.deceleration, specs.turnRate, specs.brakingRate, initialPosition, initialRotation)
    }

    constructor(mesh, importantNodes, topSpeed, minSpeed, accelerationRate, coastingRate, turnRate, brakingRate, initialPosition, initialRotation) {
        // Variables that describe the vehicle
        this.mesh = mesh
        this.topSpeed = topSpeed
        this.minSpeed = minSpeed
        this.accelerationRate = accelerationRate
        this.coastingRate = coastingRate
        this.turnRate = turnRate
        this.brakingRate = brakingRate
        this.importantNodes = importantNodes
        this.initialPosition = initialPosition
        this.initialRotation = initialRotation

        // Variables that describe the state of the vehicle
        this.actualPosition = initialPosition
        this.actualRotationVehicle = initialRotation
        this.actualRotationWheel = 0
        this.actualSpeed = 0

        // Variables that describe the actions of the vehicle
        this.coasting = false
        this.accelerating = false
        this.braking = false
        this.turningLeft = false
        this.turningRight = false
        this.reversing = false

        this._translateToPivotPoint()
    }

    controlCar(event) {
        switch (event.keyCode) {
            case 87: // W
                switch (event.type) {
                    case 'keydown':
                        // If the car is reversing, it can't accelerate
                        this.accelerating = !this.reversing && this.actualSpeed >= 0
                        this.coasting = false
                        break
                    case 'keyup':
                        this.accelerating = false
                        this.coasting = true
                        break
                }
                break
            case 83: // S
                switch (event.type) {
                    case 'keydown':
                        // To avoid putting the lights on when they are already on
                        if (!this.braking) {
                            for (const light of this.importantNodes.brakelights) {
                                light.visible = true
                            }
                        }
                        this.braking = true
                        this.coasting = false
                        break
                    case 'keyup':
                        for (const light of this.importantNodes.brakelights) {
                            light.visible = false
                        }
                        if (this.actualSpeed !== 0)
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
                        const canReverse = this.actualSpeed <= 0 && !this.accelerating
                        if (canReverse) {
                            for (const light of this.importantNodes.reverselights) {
                                light.visible = true
                            }
                            console.log('reversing')
                        }
                        this.reversing = canReverse
                        this.coasting = !canReverse
                        break
                    case 'keyup':
                        if (this.reversing) {
                            for (const light of this.importantNodes.reverselights) {
                                light.visible = false
                            }
                            this.reversing = false
                            this.coasting = true
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
        // To avoid calling update when the car is not moving
        if (!this.accelerating && !this.braking && !this.reversing && !this.turningLeft && !this.turningRight && !this.coasting && this.actualSpeed === 0 && this.actualRotationVehicle === 0 && this.actualRotationWheel === 0) {
            return
        }

        if (this.accelerating) {
            this.actualSpeed = Math.min(this.actualSpeed + this.accelerationRate, this.topSpeed)
        }

        if (this.braking) {
            this.actualSpeed = Math.max(this.actualSpeed - this.brakingRate, 0)
        }

        if (this.reversing) {
            this.actualSpeed = Math.max(this.actualSpeed - this.accelerationRate, this.minSpeed)
        }

        if (this.turningLeft) {
            // If the car is not moving, it can't turn
            if (this.actualSpeed !== 0)
                this.actualRotationVehicle -= this.turnRate
            // Turning the wheels
            this.actualRotationWheel = Math.max(- this.turnRate + this.actualRotationWheel, -0.7)
        }

        if (this.turningRight) {
            // If the car is not moving, it can't turn
            if (this.actualSpeed !== 0)
                this.actualRotationVehicle += this.turnRate
            // Turning the wheels
            this.actualRotationWheel = Math.min(this.turnRate + this.actualRotationWheel, 0.7)
        }

        // When the vehicle is not accelerating or braking, it coasts
        // Until it stops
        if (this.coasting) {
            this.actualSpeed += this.coastingRate * - Math.sign(this.actualSpeed)
            if (this.actualSpeed < 0.01 && this.actualSpeed > -0.01) {
                this.actualSpeed = 0
                this.coasting = false
            }
        }

        // Updating the vehicle position
        this.actualPosition.x += this.actualSpeed * Math.sin(this.actualRotationVehicle)
        this.actualPosition.z += this.actualSpeed * Math.cos(this.actualRotationVehicle)
        this.mesh.position.set(this.actualPosition.x, this.actualPosition.y, this.actualPosition.z)

        // Updating the vehicle rotation
        this.mesh.rotation.y = this.actualRotationVehicle

        // If the car is not turning, the wheels go back to their original position slowly
        if (!this.turningRight && this.actualRotationWheel > 0) {
            this.actualRotationWheel = Math.max(this.actualRotationWheel - this.turnRate, 0)
        } else if (!this.turningLeft && this.actualRotationWheel < 0) {
            this.actualRotationWheel = Math.min(this.actualRotationWheel + this.turnRate, 0)
        }

        // Updating the wheels rotation on the y axis
        this.importantNodes.wheelFL.rotation.y = this.actualRotationWheel
        this.importantNodes.wheelFR.rotation.y = this.actualRotationWheel

        // Updating the wheels rotation on the x axis
        // TODO: make the front wheels spin
        // TODO: implement this in shaders
        this.importantNodes.wheelBL.rotation.x += this.actualSpeed
        this.importantNodes.wheelBR.rotation.x += this.actualSpeed
    }

    _translateToPivotPoint() {
        // This function translates the child meshes of vehicle group
        // to the center of the wheels
        // This is done so that the vehicle can rotate around its center
        const pos1 = this.importantNodes.wheelBL.position
        const pos2 = this.importantNodes.wheelBR.position

        const x = (pos1.x + pos2.x) / 2
        const y = (pos1.y + pos2.y) / 2
        const z = (pos1.z + pos2.z) / 2

        for (const mesh1 of this.mesh.children) {
            mesh1.position.x -= x
            mesh1.position.y -= y
            mesh1.position.z -= z
        }
    }
}

export { MyVehicle };