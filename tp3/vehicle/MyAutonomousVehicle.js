import {MyVehicle} from './MyVehicle.js'
import * as THREE from 'three'
import * as Utils from '../utils.js'

class MyAutonomousVehicle extends MyVehicle {

    constructor(mesh, name, keyPoints, pathCurve, importantNodes, difficulty) {
        // Variables that describe the vehicle
        super(mesh, name, importantNodes)
        this.keyPoints = keyPoints
        this.pathCurve = pathCurve

        this.previousKeyPointIndex = -1; // Initialize to an invalid index
        this.currentKeyPointIndex = -1;
        this.angleVariations = []

        this.adaptDifficulty(difficulty)

        this.clock = new THREE.Clock()

        this.controlCarOpponent();
    }
    
    static fromVehicle(vehicle, keyPoints, pathCurve, difficulty) {
        return new MyAutonomousVehicle(vehicle.mesh, vehicle.name, keyPoints, pathCurve, vehicle.importantNodes, difficulty)
    }

    adaptDifficulty(difficulty) {
        switch (difficulty) {
            case 'easy':
                this.timeScale = 1;
                break;
            case 'medium':
                this.timeScale = 2;
                break;
            case 'hard':
                this.timeScale = 3;
                break;
            default:
                throw new Error(`Invalid difficulty: ${difficulty}`);
        }

        this.timeScale = 2;
        this.actualSpeed = 1 / (2 * this.timeScale);
    }

    update() {

        const delta = this.clock.getDelta(); // assuming you have a clock
        if (this.mixer) {
            this.mixer.update(delta);
        }

        this.currentTime += delta;

        this.previousKeyPointIndex = this.currentKeyPointIndex;
        this.currentKeyPointIndex = this.getCurrentKeyPointIndex();

        if (Utils.distance(this.kf_arrays[this.currentKeyPointIndex], this.kf_arrays[this.currentKeyPointIndex + 1]) > 5) {
            this.importantNodes.wheelFL.rotation.y = 0
            this.importantNodes.wheelFR.rotation.y = 0
        } else if (this.angleVariations[this.currentKeyPointIndex] > 0) {
            this.importantNodes.wheelFL.rotation.y = Math.PI / 8
            this.importantNodes.wheelFR.rotation.y = Math.PI / 8
        } else if (this.angleVariations[this.currentKeyPointIndex] < 0) {
            this.importantNodes.wheelFL.rotation.y = -Math.PI / 8
            this.importantNodes.wheelFR.rotation.y = -Math.PI / 8
        }

        if (this.currentKeyPointIndex !== this.previousKeyPointIndex) {
            console.log(`Vehicle passed key point ${this.currentKeyPointIndex}`);
        }

        this.importantNodes.wheelBL.rotation.x += this.actualSpeed
        this.importantNodes.wheelBR.rotation.x += this.actualSpeed
        this.importantNodes.wheelFL.rotation.x += this.actualSpeed
        this.importantNodes.wheelFR.rotation.x += this.actualSpeed

        this.obb.update(this.mesh.matrixWorld)
    }

    controlCarOpponent() {
        let times = []
        let kf = []
        let qf = []
        this.kf_arrays = []
        let tangents = []
        let save_added_points = []


        for (let i = 0; i < this.keyPoints.length; i++) {
            kf.push(...this.keyPoints[i])
            if (i === this.keyPoints.length - 1) {
                if (Utils.distance(this.keyPoints[i], this.keyPoints[0]) > 30) {
                    let mediumPoint = [(this.keyPoints[i][0] + this.keyPoints[0][0]) / 2, (this.keyPoints[i][1] + this.keyPoints[0][1]) / 2, (this.keyPoints[i][2] + this.keyPoints[0][2]) / 2]
                    kf.push(...mediumPoint)
                    save_added_points.push(i + 1)
                }
            } else if (Utils.distance(this.keyPoints[i], this.keyPoints[i + 1]) > 30) {
                let mediumPoint = [(this.keyPoints[i][0] + this.keyPoints[i + 1][0]) / 2, (this.keyPoints[i][1] + this.keyPoints[i + 1][1]) / 2, (this.keyPoints[i][2] + this.keyPoints[i + 1][2]) / 2]
                kf.push(...mediumPoint)
                save_added_points.push(i + 1)
            }
        }

        for (let i = 0; i < kf.length; i++) {
            if (i % 3 === 0) {
                this.kf_arrays.push(kf.slice(i, i + 3))
            }
        }
        console.log(this.kf_arrays)

        for (let i = 0; i < kf.length / 3; i++) {
            times.push(i * this.timeScale)
        }

        console.log(times)
        for (let i = 0; i <= 1; i += 1 / 132) {
            const cTangent = this.pathCurve.getTangent(i)
            tangents.push(cTangent)
        }

        this.angleVariation = 0;
        for (let i = 0; i < tangents.length; i++) {
            if (i === 0) {
                qf.push(0, 0, 0, 1)
                this.angleVariations.push(0)
            } else {
                this.angleVariation += Utils.calculateAngleVariation(tangents[i - 1], tangents[i]);
                this.angleVariations.push(Utils.calculateAngleVariation(tangents[i - 1], tangents[i]))
                console.log(i, this.angleVariation, Utils.calculateAngleVariation(tangents[i - 1], tangents[i]))
                let axis = new THREE.Vector3(0, 1, 0); // You may need to adjust the axis based on your specific scenario
                let quaternion = new THREE.Quaternion().setFromAxisAngle(axis, this.angleVariation);
                //console.log(quaternion)
                qf.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            }
        }

        for (let j = 0; j < save_added_points.length; j++) {
            const index = save_added_points[j];
            console.log(index)
            let elementToAdd = qf.slice((index - 1) * 4, (index) * 4)
            console.log(elementToAdd)
            qf.splice((index * 4) + 4, 0, ...elementToAdd);
            this.angleVariations.splice(index, 0, 0);
        }

        console.log(this.angleVariations)


        console.log(this.kf_arrays)
        console.log(qf)
        const positionKF = new THREE.VectorKeyframeTrack('.position', times, kf, THREE.InterpolateCatmullRom);
        const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', times, qf, THREE.InterpolateCatmullRom);
        console.log(quaternionKF)
        this.mixer = new THREE.AnimationMixer(this.mesh);
        this.clip = new THREE.AnimationClip('positionAnimation', times[times.length - 1], [positionKF]);
        this.rotationClip = new THREE.AnimationClip('rotationAnimation', times[times.length - 1], [quaternionKF]);
        const action = this.mixer.clipAction(this.clip);
        const rotationAction = this.mixer.clipAction(this.rotationClip);
        console.log(action)
        action.play();
        rotationAction.play();
    }

    getCurrentKeyPointIndex() {
        const currentPosition = this.mesh.position.clone();

        // Calculate distances from the current position to each keyPoint
        const distances = this.kf_arrays.map(keyPoint => Utils.distance(currentPosition.toArray(), keyPoint));

        // Find the index of the keyPoint with the minimum distance
        const minDistanceIndex = distances.indexOf(Math.min(...distances));

        return minDistanceIndex;
    }
}

export {MyAutonomousVehicle};