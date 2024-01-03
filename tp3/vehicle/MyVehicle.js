import {MyVehicleRenderer} from './parser/MyVehicleRenderer.js'
import {MyOBB} from '../collisions/MyOBB.js'

class MyVehicle {
    /**
     * Creates an instance of MyVehicle from a file using MyVehicleRenderer.
     * @param {string} file - The file path or content representing the vehicle.
     * @returns {MyVehicle} - The vehicle instance.
     */
    static create(file) {
        const vehicleRenderer = new MyVehicleRenderer()
        const [mesh, specs] = vehicleRenderer.render(file)
        return new MyVehicle(mesh, specs.name, specs.topSpeed, specs.minSpeed, specs.acceleration, specs.deceleration, specs.turnRate, specs.brakingRate)
    }

    /**
     * Constructs an instance of MyVehicle.
     * @param {THREE.Mesh} mesh - The mesh representing the vehicle.
     * @param {string} name - The name of the vehicle.
     * @param {number} topSpeed - The top speed of the vehicle.
     * @param {number} minSpeed - The minimum speed of the vehicle.
     * @param {number} accelerationRate - The acceleration rate of the vehicle.
     * @param {number} coastingRate - The coasting rate of the vehicle.
     * @param {number} turnRate - The turn rate of the vehicle.
     * @param {number} brakingRate - The braking rate of the vehicle.
     */
    constructor(mesh, name, topSpeed, minSpeed, accelerationRate, coastingRate, turnRate, brakingRate) {
        // Variables that describe the vehicle
        this.mesh = mesh
        this.name = name
        this.mesh.name = name
        this.topSpeed = topSpeed
        this.minSpeed = minSpeed
        this.accelerationRate = accelerationRate
        this.coastingRate = coastingRate
        this.turnRate = turnRate
        this.brakingRate = brakingRate
        this.name = name

        this._createImportantNodes()
        
        this.actualPosition = {x: 0, y: 0, z: 0}

        this.actualRotationVehicle = 0
        this._translateToPivotPoint()
        this.obb = new MyOBB(this.mesh)
    }

    /**
     * Translates the child meshes of the vehicle group to the center of the wheels.
     * This allows the vehicle to rotate around its center.
     * @private
     */
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

    /**
     * Creates important nodes for wheels and lights.
     */
    _createImportantNodes() {
        this.importantNodes = {}
        this.importantNodes.wheelFL = this.mesh.getObjectByName('wheelFL')
        this.importantNodes.wheelFL.rotation.order = 'YXZ';

        this.importantNodes.wheelFR = this.mesh.getObjectByName('wheelFR')
        this.importantNodes.wheelFR.rotation.order = 'YXZ';

        this.importantNodes.wheelBL = this.mesh.getObjectByName('wheelBL')

        this.importantNodes.wheelBR = this.mesh.getObjectByName('wheelBR')

        this.importantNodes.headlights = []
        this.importantNodes.brakelights = []
        this.importantNodes.reverselights = []
        
        const reactiveLights = this.mesh.getObjectsByProperty('reactiveLight', true)
        for (const reactiveLight of reactiveLights) {
            if (reactiveLight.name.startsWith('headlight')) {
                this.importantNodes.headlights.push(reactiveLight)
            } else if (reactiveLight.name.startsWith('brakelight')) {
                this.importantNodes.brakelights.push(reactiveLight)
            } else if (reactiveLight.name.startsWith('reverselight')) {
                this.importantNodes.reverselights.push(reactiveLight)
            }
        }
    }

    /**
     * Sets the position of the vehicle.
     * @param {Object} pos - The position object {x, y, z}.
     */
    setPosition(pos) {
        this.mesh.position.setX(pos.x)
        this.mesh.position.setZ(pos.z)

        this.actualPosition.x = pos.x
        this.actualPosition.z = pos.z

        this.obb.update(this.mesh.matrixWorld)
    }

    /**
     * Sets the rotation of the vehicle.
     * @param {number} rot - The rotation angle in radians.
     */
    setRotation(rot) {
        this.mesh.rotation.y = rot
        this.actualRotationVehicle = rot
        this.obb.update(this.mesh.matrixWorld)
    }

}

export {MyVehicle};