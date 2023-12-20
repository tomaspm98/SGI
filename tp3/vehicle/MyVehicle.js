import { MyVehicleRenderer } from './parser/MyVehicleRenderer.js'

class MyVehicle {

    static createVehicle(file) {
        const vehicleRenderer = new MyVehicleRenderer()
        const [mesh, specs] = vehicleRenderer.render(file)
        return new MyVehicle(mesh, specs.topSpeed, specs.accelerationRate, specs.decelerationRate, specs.turnRate, specs.brakingRate)
    }

    constructor(mesh, topSpeed, accelerationRate, decelerationRate, turnRate, brakingRate) {
        this.mesh = mesh
        this.topSpeed = topSpeed
        this.accelerationRate = accelerationRate
        this.decelerationRate = decelerationRate
        this.turnRate = turnRate
        this.brakingRate = brakingRate
    }

    controlCar() {

    }

    update() {

    }
}

export { MyVehicle };