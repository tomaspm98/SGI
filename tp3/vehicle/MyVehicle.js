import { MyVehicleRenderer } from './parser/MyVehicleRenderer.js'
import * as THREE from 'three'
import { OBB } from 'three/addons/math/OBB.js';

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
        this.importantNodes.wheelFL.rotation.order = 'YXZ';
        this.importantNodes.wheelFR.rotation.order = 'YXZ';

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

        this._createBoundingBox()
        this._createBoundingBoxHelper()
    }

    controlCar(event) {
        switch (event.keyCode) {
            case 87: // W
                switch (event.type) {
                    case 'keydown':
                        // If the car is reversing, it can't accelerate
                        if (this.accelerating) {
                            break
                        }
                        else if (!this.reversing && this.actualSpeed >= 0) {
                            this.accelerating = true
                            this.coasting = false
                        }
                        break
                    case 'keyup':
                        if (this.accelerating) {
                            this.accelerating = false
                            this.coasting = true
                        }
                        break
                }
                break
            case 83: // S
                switch (event.type) {
                    case 'keydown':
                        // To avoid putting the lights on when they are already on
                        if (this.braking) {
                            break
                        }
                        for (const light of this.importantNodes.brakelights) {
                            light.visible = true
                        }
                        this.braking = true
                        this.coasting = false
                        break
                    case 'keyup':
                        for (const light of this.importantNodes.brakelights) {
                            light.visible = false
                        }
                        if (this.actualSpeed !== 0 && !this.reversing && !this.accelerating)
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
                        if (this.reversing) {
                            break
                        } else if (this.actualSpeed <= 0 && !this.accelerating) {
                            for (const light of this.importantNodes.reverselights) {
                                light.visible = true
                            }
                            this.reversing = true
                            this.coasting = false
                        }
                        break
                    case 'keyup':
                        if (this.reversing) {
                            for (const light of this.importantNodes.reverselights) {
                                light.visible = false
                                this.reversing = false
                                this.coasting = true
                            }
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

        if (this.braking && this.actualSpeed > 0) {
            this.actualSpeed = Math.max(this.actualSpeed - this.brakingRate, 0)
        } else if (this.braking && this.actualSpeed < 0) {
            this.actualSpeed = Math.min(this.actualSpeed + this.brakingRate, 0)
        }

        if (this.reversing) {
            this.actualSpeed = Math.max(this.actualSpeed - this.accelerationRate, this.minSpeed)
        }


        // Turning left
        // We avoid using nested if statements for performance reasons
        if (this.turningLeft) {
            this.actualRotationWheel = Math.max(- this.turnRate * 5 + this.actualRotationWheel, -0.7)
        }

        if (this.turningLeft && this.actualSpeed > 0) {
            this.actualRotationVehicle -= this.turnRate
        } else if (this.turningLeft && this.actualSpeed < 0) {
            this.actualRotationVehicle += this.turnRate
        }

        // Turning right
        // We avoid using nested if statements for performance reasons
        if (this.turningRight) {
            this.actualRotationWheel = Math.min(this.turnRate * 5 + this.actualRotationWheel, 0.7)
        }

        if (this.turningRight && this.actualSpeed > 0) {
            this.actualRotationVehicle += this.turnRate
        } else if (this.turningRight && this.actualSpeed < 0) {
            this.actualRotationVehicle -= this.turnRate
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
        this.mesh.position.setX(this.actualPosition.x)
        this.mesh.position.setZ(this.actualPosition.z)

        // Updating the vehicle rotation
        this.mesh.rotation.y = this.actualRotationVehicle

        // If the car is not turning, the wheels go back to their original position slowly
        if (!this.turningRight && this.actualRotationWheel > 0) {
            this.actualRotationWheel = Math.max(this.actualRotationWheel - 5 * this.turnRate, 0)
        } else if (!this.turningLeft && this.actualRotationWheel < 0) {
            this.actualRotationWheel = Math.min(this.actualRotationWheel + 5 * this.turnRate, 0)
        }

        // Updating the wheels rotation on the y axis
        this.importantNodes.wheelFL.rotation.y = this.actualRotationWheel
        this.importantNodes.wheelFR.rotation.y = this.actualRotationWheel

        // Updating the wheels rotation on the x axis
        // TODO: make the front wheels spin
        // TODO: implement this in shaders
        this.importantNodes.wheelBL.rotation.x += this.actualSpeed
        this.importantNodes.wheelBR.rotation.x += this.actualSpeed
        this.importantNodes.wheelFL.rotation.x += this.actualSpeed
        this.importantNodes.wheelFR.rotation.x += this.actualSpeed

        //this.mesh.updateMatrixWorld()
        this.obb.copy(this.originalOBB)
        this.obb.applyMatrix4(this.mesh.matrixWorld)
        console.log(this.obb.halfSize)
        const teste = { x: 0, y: 0, z: 0 }
        teste.x = this.obb.halfSize.x * 2
        teste.y = this.obb.halfSize.y * 2
        teste.z = this.obb.halfSize.z * 2
        this.obbHelper.position.copy(this.obb.center)
        this.obbHelper.scale.copy(teste)
        this.obbHelper.rotation.copy(this.obb.rotation)
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

    _createBoundingBox() {
        const box = new THREE.Box3().setFromObject(this.mesh)
        this.obb = new OBB().fromBox3(box)
        this.originalOBB = this.obb.clone()
    }

    _createBoundingBoxHelper() {
        const obbGeometry = new THREE.BoxGeometry(1, 1, 1)
        const obbMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
        const obbMesh = new THREE.Mesh(obbGeometry, obbMaterial)

        obbMesh.position.copy(this.obb.center)
        obbMesh.scale.copy(this.obb.halfSize)
        obbMesh.rotation.copy(this.obb.rotation)

        this.obbHelper = obbMesh
    }
}

export { MyVehicle };