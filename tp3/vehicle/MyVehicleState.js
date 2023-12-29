class MyVehicleState {
    constructor(vehicle) {
        this.vehicle = vehicle;
    }

    accelerate() {
        if (this.vehicle.accelerating) {
            this.vehicle.actualSpeed = Math.min(this.vehicle.actualSpeed + this.vehicle.accelerationRate, this.vehicle.topSpeed)
        }
    }

    brake() {
        if (this.vehicle.braking && this.vehicle.actualSpeed > 0) {
            this.vehicle.actualSpeed = Math.max(this.vehicle.actualSpeed - this.vehicle.brakingRate, 0)
        } else if (this.vehicle.braking && this.vehicle.actualSpeed < 0) {
            this.vehicle.actualSpeed = Math.min(this.vehicle.actualSpeed + this.vehicle.brakingRate, 0)
        }
    }

    reverse() {
        if (this.vehicle.reversing) {
            this.vehicle.actualSpeed = Math.max(this.vehicle.actualSpeed - this.vehicle.accelerationRate, this.vehicle.minSpeed)
        }
    }

    turnLeft() {
        if (this.vehicle.turningLeft) {
            this.vehicle.actualRotationWheel = Math.max(- this.vehicle.turnRate * 1.5 + this.vehicle.actualRotationWheel, -0.7)
        }

        if (this.vehicle.turningLeft && this.vehicle.actualSpeed > 0) {
            this.vehicle.actualRotationVehicle -= this.vehicle.turnRate
        } else if (this.vehicle.turningLeft && this.vehicle.actualSpeed < 0) {
            this.vehicle.actualRotationVehicle += this.vehicle.turnRate
        }
    }

    turnRight() {
        if (this.vehicle.turningRight) {
            this.vehicle.actualRotationWheel = Math.min(this.vehicle.turnRate * 1.5 + this.vehicle.actualRotationWheel, 0.7)
        }

        if (this.vehicle.turningRight && this.vehicle.actualSpeed > 0) {
            this.vehicle.actualRotationVehicle += this.vehicle.turnRate
        } else if (this.vehicle.turningRight && this.vehicle.actualSpeed < 0) {
            this.vehicle.actualRotationVehicle -= this.vehicle.turnRate
        }
    }

    coast() {
        if (this.vehicle.coasting) {
            this.vehicle.actualSpeed += this.vehicle.coastingRate * - Math.sign(this.vehicle.actualSpeed)
            if (this.vehicle.actualSpeed < 0.01 && this.vehicle.actualSpeed > -0.01) {
                this.vehicle.actualSpeed = 0
                this.vehicle.coasting = false
            }
        }
    }

    resetWheel() {
        if (!this.vehicle.turningLeft && !this.vehicle.turningRight) {
            if (this.vehicle.actualRotationWheel > 0) {
                this.vehicle.actualRotationWheel = Math.max(this.vehicle.actualRotationWheel - this.vehicle.turnRate * 1.5, 0)
            } else if (this.vehicle.actualRotationWheel < 0) {
                this.vehicle.actualRotationWheel = Math.min(this.vehicle.actualRotationWheel + this.vehicle.turnRate * 1.5, 0)
            }
        }
    }

    update() {
        this.accelerate()
        this.brake()
        this.reverse()
        this.turnLeft()
        this.turnRight()
        this.coast()
        this.resetWheel()

        if (this.vehicle.offTrack) {
            this.vehicle.actualSpeed = this.vehicle.actualSpeed * 0.5
        }

        this.vehicle.actualRotationVehicle = this.vehicle.actualRotationVehicle % (2 * Math.PI)
        this.vehicle.actualRotationWheel = this.vehicle.actualRotationWheel % (2 * Math.PI)

        // Updating the vehicle position
        this.vehicle.actualPosition.x += this.vehicle.actualSpeed * Math.sin(this.vehicle.actualRotationVehicle)
        this.vehicle.actualPosition.z += this.vehicle.actualSpeed * Math.cos(this.vehicle.actualRotationVehicle)
        this.vehicle.mesh.position.setX(this.vehicle.actualPosition.x)
        this.vehicle.mesh.position.setZ(this.vehicle.actualPosition.z)

        // Updating the vehicle rotation
        this.vehicle.mesh.rotation.y = this.vehicle.actualRotationVehicle

        // Updating the wheels rotation on the y axis
        this.vehicle.importantNodes.wheelFL.rotation.y = this.vehicle.actualRotationWheel
        this.vehicle.importantNodes.wheelFR.rotation.y = this.vehicle.actualRotationWheel

        // Updating the wheels rotation on the x axis
        // TODO: make the front wheels spin
        // TODO: implement this in shaders
        this.vehicle.importantNodes.wheelBL.rotation.x += this.vehicle.actualSpeed
        this.vehicle.importantNodes.wheelBR.rotation.x += this.vehicle.actualSpeed
        this.vehicle.importantNodes.wheelFL.rotation.x += this.vehicle.actualSpeed
        this.vehicle.importantNodes.wheelFR.rotation.x += this.vehicle.actualSpeed

    }
}

export { MyVehicleState }