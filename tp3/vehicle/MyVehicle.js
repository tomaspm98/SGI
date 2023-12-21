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
                switch (event.type) {
                    case 'keydown':
                        this.actualSpeed = Math.max(this.actualSpeed + this.accelerationRate, this.topSpeed)
                        this.coasting = false
                        break
                    case 'keyup':
                        this.coasting = true
                        break
                }
                break
            case 83: // S
                switch (event.type) {
                    case 'keydown':
                        if (this.actualSpeed > 0) {
                            this.actualSpeed = Math.max(this.actualSpeed - this.brakingRate, 0)
                        } else {
                            this.actualSpeed = Math.min(this.actualSpeed + this.brakingRate, 0)
                        }
                        for (const light of this.importantNodes.brakelights) {
                            light.visible = true
                        }
                        this.coasting = false
                        break
                    case 'keyup':
                        for (const light of this.importantNodes.brakelights) {
                            light.visible = false
                        }
                        break
                }
                break
            case 65: // A
                switch (event.type) {
                    case 'keydown':
                        if (this.actualSpeed !== 0)
                            this.actualRotation += this.turnRate
                        break
                }
                break
            case 68: // D
                switch (event.type) {
                    case 'keydown':
                        if (this.actualSpeed !== 0)
                            this.actualRotation -= this.turnRate
                        break
                }
                break
            case 82: // R
                switch (event.type) {
                    case 'keydown':
                        this.actualSpeed = Math.min(this.actualSpeed - this.accelerationRate, this.minSpeed)
                        this.coasting = false
                        for (const light of this.importantNodes.reverselights) {
                            light.visible = true
                        }
                        break
                    case 'keyup':
                        this.coasting = true
                        for (const light of this.importantNodes.reverselights) {
                            light.visible = false
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
}

export { MyVehicle };