import { MyVehicleRenderer } from './parser/MyVehicleRenderer.js'

class MyVehicle {

    // Ensure that only one vehicle is controlled by the human
    // and one by the AI
    static singletonHuman = false
    static singletonAutonomous = false

    static createVehicle(file) {
        const vehicleRenderer = new MyVehicleRenderer()
        const [mesh, specs, importantNodes] = vehicleRenderer.render(file)
        return new MyVehicle(mesh, importantNodes, specs.topSpeed, specs.accelerationRate, specs.decelerationRate, specs.turnRate, specs.brakingRate)
    }

    constructor(mesh, importantNodes, topSpeed, accelerationRate, decelerationRate, turnRate, brakingRate) {
        this.mesh = mesh
        this.topSpeed = topSpeed
        this.accelerationRate = accelerationRate
        this.decelerationRate = decelerationRate
        this.turnRate = turnRate
        this.brakingRate = brakingRate
        this.selectedByHuman = false
        this.selectedByAutonomous = false
        this.importantNodes = importantNodes
        console.log(this.importantNodes)
    }

    select(type) {
        switch (type) {
            case 'human':
                if (!MyVehicle.singletonHuman) {
                    this.selectedByHuman = true
                    MyVehicle.singletonHuman = true
                }
                break
            case 'autonomous':
                if (!MyVehicle.singletonAutonomous) {
                    this.selectedByAutonomous = true
                    MyVehicle.singletonAutonomous = true
                }
                break
            default:
                throw new Error('Invalid player type')
        }
    }

    controlCar() {


    }

    update() {

    }
}

export { MyVehicle };