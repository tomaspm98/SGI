import {MyVehicleRenderer} from './parser/MyVehicleRenderer.js'
import {MyOBB} from '../collisions/MyOBB.js'

class MyVehicle {
    static create(file) {
        const vehicleRenderer = new MyVehicleRenderer()
        const [mesh, specs, importantNodes] = vehicleRenderer.render(file)
        return new MyVehicle(mesh, specs.name, importantNodes, specs.topSpeed, specs.minSpeed, specs.acceleration, specs.deceleration, specs.turnRate, specs.brakingRate)
    }

    constructor(mesh, name, importantNodes, topSpeed, minSpeed, accelerationRate, coastingRate, turnRate, brakingRate) {
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
        this.importantNodes = importantNodes
        this.importantNodes.wheelFL.rotation.order = 'YXZ';
        this.importantNodes.wheelFR.rotation.order = 'YXZ';
        this.name = name

        this.actualPosition = {x: 0, y: 0, z: 0}
        this.actualRotationVehicle = 0

        this._translateToPivotPoint()

        this.obb = new MyOBB(this.mesh)
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

    setPosition(pos) {
        this.mesh.position.x = pos.x
        this.mesh.position.z = pos.z

        this.actualPosition.x = pos.x
        this.actualPosition.z = pos.z
    }

    setRotation(rot) {
        this.mesh.rotation.y = rot
        this.actualRotationVehicle = rot
    }

    setSpeed(speed) {
        this.actualSpeed = speed
    }

    setPosition(pos) {
        this.mesh.position.x = pos.x
        this.mesh.position.z = pos.z

        this.actualPosition.x = pos.x
        this.actualPosition.z = pos.z
    }

    setRotation(rot) {
        this.mesh.rotation.y = rot
        this.actualRotationVehicle = rot
    }

    setSpeed(speed){
        this.actualSpeed = speed
    }
}

export {MyVehicle};