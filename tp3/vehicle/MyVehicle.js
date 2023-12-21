import { MyVehicleRenderer } from './parser/MyVehicleRenderer.js'

class MyVehicle {
    static createVehicle(file, initialPosition = { x: 0, y: 0, z: 0 }, initialRotation = 0) {
        const vehicleRenderer = new MyVehicleRenderer()
        const [mesh, specs, importantNodes] = vehicleRenderer.render(file)
        return new MyVehicle(mesh, importantNodes, specs.topSpeed, specs.minSpeed, specs.acceleration, specs.deceleration, specs.turnRate, specs.brakingRate, initialPosition, initialRotation)
    }

    constructor(mesh, importantNodes, topSpeed, minSpeed, accelerationRate, coastingRate, turnRate, brakingRate, initialPosition, initialRotation) {
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

        this.actualPosition = initialPosition
        this.actualRotation = initialRotation

        this.actualSpeed = 0
        this.coasting = false

    }

    controlCar(event) {
        switch (event.keyCode) {
            case 87: // W
                this._handleW(event)
                break
            case 83: // S
                this._handleS(event)
                break
            case 65: // A
                this._handleA(event)
                break
            case 68: // D
                this._handleD(event)
                break
        }
    }

    update() {
        if (this.coasting) {
            this.actualSpeed += this.coastingRate * - Math.sign(this.actualSpeed)
            if (this.actualSpeed < 0.01 && this.actualSpeed > -0.01) {
                this.actualSpeed = 0
                this.coasting = false
            }
        }

        this.actualPosition.x += this.actualSpeed * Math.sin(this.actualRotation)
        this.actualPosition.z += this.actualSpeed * Math.cos(this.actualRotation)

        this.mesh.position.set(this.actualPosition.x, this.actualPosition.y, this.actualPosition.z)
        this.mesh.rotation.y = this.actualRotation
    }

    _handleW(event) {
        switch (event.type) {
            case 'keydown':
                this.actualSpeed = Math.max(this.actualSpeed + this.accelerationRate, this.topSpeed)
                this.coasting = false
                break
            case 'keyup':
                this.coasting = true
                break
        }
    }

    _handleS(event) {
        switch (event.type) {
            case 'keydown':
                this.actualSpeed = Math.min(this.actualSpeed - this.accelerationRate, this.minSpeed)
                this.coasting = false
                break
            case 'keyup':
                this.coasting = true
                break
        }
    }

    _handleA(event) {
        switch (event.type) {
            case 'keydown':
                this.actualRotation += this.turnRate
                break
        }
    }

    _handleD(event) {
        switch (event.type) {
            case 'keydown':
                this.actualRotation -= this.turnRate
                break
        }
    }

}

export { MyVehicle };