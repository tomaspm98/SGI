import { MyVehicleRenderer } from './parser/MyVehicleRenderer.js'

class MyVehicle {
    constructor(file) {
        this.mesh = this._loadVehicle(file)
    }

    _loadVehicle(file) {
        const vehicleRenderer = new MyVehicleRenderer()
        const vehicleMesh = vehicleRenderer.render(file)
        return vehicleMesh
    }

    controlCar() {

    }

    update() {

    }
}

export { MyVehicle };