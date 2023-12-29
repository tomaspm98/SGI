import { MyVehicleRenderer } from './parser/MyVehicleRenderer.js'
import { NormalState, ReducedSpeedState, IncreasedSpeedState, InvertedControlsState } from './ImpVehicleStates.js'
import { MyOBB } from '../collisions/MyOBB.js'
import * as THREE from 'three'
import * as Utils from '../utils.js'
import { AxesHelper } from 'three'

class MyAutonomousVehicle {
    static createVehicle(file, keyPoints, pathCurve, initialPosition = { x: 0, y: 0, z: 0 }, initialRotation = 0) {
        const vehicleRenderer = new MyVehicleRenderer()
        const [mesh, specs, importantNodes] = vehicleRenderer.render(file)
        return new MyAutonomousVehicle(mesh, keyPoints, pathCurve, importantNodes, specs.topSpeed, specs.minSpeed, specs.acceleration, specs.deceleration, specs.turnRate, specs.brakingRate, initialPosition, initialRotation)
    }

    constructor(mesh, keyPoints, pathCurve, importantNodes, topSpeed, minSpeed, accelerationRate, coastingRate, turnRate, brakingRate, initialPosition, initialRotation) {
        // Variables that describe the vehicle
        this.mesh = mesh
        this.keyPoints = keyPoints
        this.pathCurve = pathCurve
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

        this.opponent = true;
        this.timeScale =3;
        this.actualSpeed = 1/(2*this.timeScale);

        this._translateToPivotPoint()

        this.clock = new THREE.Clock()

        this.bb = new THREE.Box3().setFromObject(this.mesh)

        this.controlCarOpponent();

    }

    
    update() {
        if(this.opponent){
            const delta = this.clock.getDelta(); // assuming you have a clock
            if (this.mixer) {
                this.mixer.update(delta);
            }
        }

        this.importantNodes.wheelBL.rotation.x += this.actualSpeed
        this.importantNodes.wheelBR.rotation.x += this.actualSpeed
        this.importantNodes.wheelFL.rotation.x += this.actualSpeed
        this.importantNodes.wheelFR.rotation.x += this.actualSpeed

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
        this.accelerating=true
        let times=[]
        let kf=[]
        let qf=[]
        let kf_arrays=[]
        let tangents = []
        let save_added_points = []
        

        for (let i=0;i<this.keyPoints.length;i++){
            kf.push(...this.keyPoints[i])
            if (i==this.keyPoints.length-1){
                if (Utils.distance(this.keyPoints[i],this.keyPoints[0])>30){
                    let mediumPoint = [(this.keyPoints[i][0]+this.keyPoints[0][0])/2,(this.keyPoints[i][1]+this.keyPoints[0][1])/2,(this.keyPoints[i][2]+this.keyPoints[0][2])/2]
                    kf.push(...mediumPoint)
                    save_added_points.push(i+1)
                }
            }
            else if (Utils.distance(this.keyPoints[i],this.keyPoints[i+1])>30){
                let mediumPoint = [(this.keyPoints[i][0]+this.keyPoints[i+1][0])/2,(this.keyPoints[i][1]+this.keyPoints[i+1][1])/2,(this.keyPoints[i][2]+this.keyPoints[i+1][2])/2]
                kf.push(...mediumPoint)
                save_added_points.push(i+1)
            }   
        }

        for (let i=0;i<kf.length;i++){
            if (i%3==0){
                kf_arrays.push(kf.slice(i,i+3))
            }
        }
        console.log(kf_arrays)

        for (let i=0;i<kf.length/3;i++){
            times.push(i*this.timeScale)
        }

        console.log(times)
        for (let i=0;i<=1;i+= 1/132){
            const cPoint = this.pathCurve.getPoint(i)
            const cTangent = this.pathCurve.getTangent(i)
            tangents.push(cTangent)
        }

        this.angleVariation = 0;
        for(let i=0;i<tangents.length;i++){
            if (i==0){
                qf.push(0,0,0,1)
            }
            else {
                this.angleVariation += Utils.calculateAngleVariation(tangents[i-1], tangents[i]);
                console.log(i,this.angleVariation, Utils.calculateAngleVariation(tangents[i-1], tangents[i]))
                let axis = new THREE.Vector3(0, 1, 0); // You may need to adjust the axis based on your specific scenario
                let quaternion = new THREE.Quaternion().setFromAxisAngle(axis, this.angleVariation);
                //console.log(quaternion)
                qf.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            }
        }


        for (let j = 0; j < save_added_points.length; j++) {
            const index = save_added_points[j];
            console.log(index)
            let elementToAdd = qf.slice((index-1)*4,(index)*4)
            console.log(elementToAdd)
            qf.splice((index * 4)+4, 0, ...elementToAdd);
        }
        

        console.log(kf_arrays)
        console.log(qf)
        const positionKF = new THREE.VectorKeyframeTrack('.position', times, kf, THREE.InterpolateSmooth);
        const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', times, qf, THREE.InterpolateSmooth);
        console.log(quaternionKF)
        this.mixer = new THREE.AnimationMixer(this.mesh);
        this.clip = new THREE.AnimationClip('positionAnimation', times[times.length-1], [positionKF]);
        this.rotationClip = new THREE.AnimationClip('rotationAnimation', times[times.length-1], [quaternionKF]);
        const action = this.mixer.clipAction(this.clip);
        const rotationAction = this.mixer.clipAction(this.rotationClip);
        console.log(action)
        action.play();   
        rotationAction.play();
    }

    
}

export { MyAutonomousVehicle };