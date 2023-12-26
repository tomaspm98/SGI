import { MyVehicleState } from './MyVehicleState.js'

class NormalState extends MyVehicleState {
    constructor(vehicle) {
        super(vehicle)
    }
}

class ReducedSpeedState extends MyVehicleState {
    constructor(vehicle) {
        super(vehicle)
    }

    accelerate() {
        if (this.vehicle.accelerating) {
            this.vehicle.actualSpeed = Math.min((this.vehicle.actualSpeed + this.vehicle.accelerationRate) * 0.5, this.vehicle.topSpeed * 0.5)
        }
    }
}

class IncreasedSpeedState extends MyVehicleState {
    constructor(vehicle) {
        super(vehicle)
    }

    accelerate() {
        if (this.vehicle.accelerating) {
            this.vehicle.actualSpeed = Math.min((this.vehicle.actualSpeed + this.vehicle.accelerationRate) * 1.5, this.vehicle.topSpeed * 1.5)
        }
    }
}

class InvertedControlsState extends MyVehicleState {
    constructor(vehicle) {
        super(vehicle)
    }

    turnLeft() {
        if (this.vehicle.turningLeft) {
            this.vehicle.actualRotationWheel = Math.min(this.vehicle.turnRate * 5 + this.vehicle.actualRotationWheel, 0.7)
        }

        if (this.vehicle.turningLeft && this.vehicle.actualSpeed > 0) {
            this.vehicle.actualRotationVehicle += this.vehicle.turnRate
        } else if (this.vehicle.turningLeft && this.vehicle.actualSpeed < 0) {
            this.vehicle.actualRotationVehicle -= this.vehicle.turnRate
        }
    }

    turnRight() {
        if (this.vehicle.turningRight) {
            this.vehicle.actualRotationWheel = Math.max(- this.vehicle.turnRate * 5 + this.vehicle.actualRotationWheel, -0.7)
        }

        if (this.vehicle.turningRight && this.vehicle.actualSpeed > 0) {
            this.vehicle.actualRotationVehicle -= this.vehicle.turnRate
        } else if (this.vehicle.turningRight && this.vehicle.actualSpeed < 0) {
            this.vehicle.actualRotationVehicle += this.vehicle.turnRate
        }
    }
}

export { NormalState, ReducedSpeedState, IncreasedSpeedState, InvertedControlsState }