import { MyVehicleRenderer } from './parser/MyVehicleRenderer.js'
import * as THREE from 'three'


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
        this.actualRotationWheel = 0

        this.actualSpeed = 0
        this.coasting = false
        this.rotating = false

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
                        this.actualRotationWheel = Math.min(this.turnRate * 2 + this.actualRotationWheel, 0.7)
                        this.rotating = true
                        break
                    case 'keyup':
                        this.rotating = false
                        break
                }
                break
            case 68: // D
                switch (event.type) {
                    case 'keydown':
                        if (this.actualSpeed !== 0)
                            this.actualRotation -= this.turnRate
                        this.actualRotationWheel = Math.max(- this.turnRate * 2 + this.actualRotationWheel, -0.7)
                        this.rotating = true
                        break
                    case 'keyup':
                        this.rotating = false
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

        console.log(this.actualRotation)
        this.actualPosition.x += this.actualSpeed * Math.sin(this.actualRotation)
        this.actualPosition.z += this.actualSpeed * Math.cos(this.actualRotation)

        this.mesh.position.set(this.actualPosition.x, this.actualPosition.y, this.actualPosition.z)
        this.mesh.rotation.y = this.actualRotation

        if (!this.rotating && this.actualRotationWheel > 0) {
            this.actualRotationWheel = Math.max(this.actualRotationWheel - this.turnRate * 2, 0)
        } else if (!this.rotating && this.actualRotationWheel < 0) {
            this.actualRotationWheel = Math.min(this.actualRotationWheel + this.turnRate * 2, 0)
        }

        // TODO: make the front wheels spin

        this.importantNodes.wheelFL.rotation.y = this.actualRotationWheel
        this.importantNodes.wheelFR.rotation.y = this.actualRotationWheel

        this.importantNodes.wheelBL.rotation.x += this.actualSpeed
        this.importantNodes.wheelBR.rotation.x += this.actualSpeed
    }
}

export { MyVehicle };