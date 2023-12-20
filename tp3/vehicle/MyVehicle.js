import { MyVehicleRenderer } from './parser/MyVehicleRenderer.js'

class MyVehicle {
    static selectedVehicle = false
    constructor(file) {
        this.mesh = this._loadVehicle(file)
        this.selected = false
    }

    _loadVehicle(file) {
        const vehicleRenderer = new MyVehicleRenderer()
        const vehicleMesh = vehicleRenderer.render(file)
        console.log(vehicleMesh)
        return vehicleMesh
    }

    select() {
        if (!MyVehicle.selectedVehicle) {
            this.selected = true
            MyVehicle.selectedVehicle = true
        }
    }

    unselect() {
        this.selected = false
        MyVehicle.selectedVehicle = false
    }

    controlCar() {

    }

    update() {

    }
}

export { MyVehicle };