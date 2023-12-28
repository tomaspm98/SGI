import { MyVehicleRenderer } from './parser/MyVehicleRenderer.js'
import { NormalState, ReducedSpeedState, IncreasedSpeedState, InvertedControlsState } from './ImpVehicleStates.js'
import { MyOBB } from '../collisions/MyOBB.js'
import * as THREE from 'three'
import { AxesHelper } from 'three'

class MyVehicle {
    static createVehicle(file, keyPoints, initialPosition = { x: 0, y: 0, z: 0 }, initialRotation = 0) {
        const vehicleRenderer = new MyVehicleRenderer()
        const [mesh, specs, importantNodes] = vehicleRenderer.render(file)
        return new MyVehicle(mesh, keyPoints, importantNodes, specs.topSpeed, specs.minSpeed, specs.acceleration, specs.deceleration, specs.turnRate, specs.brakingRate, initialPosition, initialRotation)
    }

    constructor(mesh, keyPoints, importantNodes, topSpeed, minSpeed, accelerationRate, coastingRate, turnRate, brakingRate, initialPosition, initialRotation) {
        // Variables that describe the vehicle
        this.mesh = mesh
        this.keyPoints = keyPoints
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
        this.opponent = false;

        // Variables that describe the actions of the vehicle
        this.coasting = false
        this.accelerating = false
        this.braking = false
        this.turningLeft = false
        this.turningRight = false
        this.reversing = false
        this.offTrack = false

        this._translateToPivotPoint()

        this._createStates()

        this.obb = new MyOBB(this.mesh)
        this.obb.createHelper()

        this.clock = new THREE.Clock()

        this.bb = new THREE.Box3().setFromObject(this.mesh)

        if (this.opponent){
            this.controlCarOpponent();
        }

    }

    controlCar(event) {
        switch (event.keyCode) {
            case 87: // W
                switch (event.type) {
                    case 'keydown':
                        // If the car is reversing, it can't accelerate
                        if (this.accelerating) {
                            break
                        } else if (!this.reversing && this.actualSpeed >= 0) {
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
        // If the vehicle is not doing anything, there is no need to update
        // And return false to indicate that the vehicle is not moving
        // Therefore, is not necessary run the collision detection function
        if (!this.accelerating && !this.reversing && !this.turningLeft && !this.turningRight && !this.coasting && this.actualSpeed === 0 && this.actualRotationVehicle === 0 && this.actualRotationWheel === 0) {
            return false
        }
        this.currentState.update()
        this.obb.update(this.mesh.matrixWorld)
        this.bb.setFromObject(this.mesh)
        if(this.opponent){
            const delta = this.clock.getDelta(); // assuming you have a clock
            if (this.mixer) {
                this.mixer.update(delta);
            }
        }
        return true
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

    controlCarOpponent(){
        let times=[]
        let kf=[]
        for (let i=0;i<this.keyPoints.length;i++){
            times.push(i)
        }

        for (let i=0;i<this.keyPoints.length;i++){
            kf.push(...this.keyPoints[i])
        }

        console.log(kf)
        const positionKF = new THREE.VectorKeyframeTrack('.position', times, kf, THREE.InterpolateSmooth);
        this.mixer = new THREE.AnimationMixer(this.mesh);
        this.clip = new THREE.AnimationClip('positionAnimation', 60, [positionKF]);
        const action = this.mixer.clipAction(this.clip);
        console.log(action)
        action.play();   
    }

    _createStates() {
        this.states = {
            "normal": new NormalState(this),
            "reducedSpeed": new ReducedSpeedState(this),
            "increasedSpeed": new IncreasedSpeedState(this),
            "invertedControls": new InvertedControlsState(this)
        }
        this.currentState = this.states["normal"]
    }

    changeState(state) {
        this.currentState = this.states[state]
    }
}

export { MyVehicle };