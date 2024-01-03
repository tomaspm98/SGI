import {MyVehicle} from './MyVehicle.js'
import * as THREE from 'three'
import * as Utils from '../utils.js'

class MyAutonomousVehicle extends MyVehicle {

    /**
     * Constructs an instance of MyAutonomousVehicle.
     * @param {THREE.Mesh} mesh - The mesh representing the vehicle.
     * @param {string} name - The name of the vehicle.
     * @param {Array} keyPoints - The key points defining the path.
     * @param {THREE.Curve} pathCurve - The curve representing the path.
     * @param {string} difficulty - The difficulty level of the vehicle.
     */
    constructor(mesh, name, keyPoints, pathCurve, difficulty) {
        // Variables that describe the vehicle
        super(mesh, name)
        this.keyPoints = keyPoints
        this.pathCurve = pathCurve

        this.previousKeyPointIndex = -1; // Initialize to an invalid index
        this.currentKeyPointIndex = -1;
        this.angleVariations = []

        this.adaptDifficulty(difficulty)

        this.clock = new THREE.Clock()

        this.controlCarOpponent();
    }
    
    /**
     * Creates an instance of MyAutonomousVehicle from an existing vehicle.
     * @param {MyVehicle} vehicle - The original vehicle.
     * @param {Array} keyPoints - The key points defining the path.
     * @param {THREE.Curve} pathCurve - The curve representing the path.
     * @param {string} difficulty - The difficulty level of the vehicle.
     * @returns {MyAutonomousVehicle} - The autonomous vehicle instance.
     */
    static fromVehicle(vehicle, keyPoints, pathCurve, difficulty) {
        vehicle.mesh.position.x = 0
        vehicle.mesh.position.z = 0
        vehicle.mesh.rotation.set(0, 0, 0)
        
        return new MyAutonomousVehicle(vehicle.mesh, vehicle.name, keyPoints, pathCurve, difficulty)
    }

    /**
     * Adapts the vehicle's speed based on the difficulty level.
     * @param {string} difficulty - The difficulty level.
     */
    adaptDifficulty(difficulty) {
        switch (difficulty) {
            case 'easy':
                this.velocity = 5;
                break;
            case 'medium':
                this.velocity = 10;
                break;
            case 'hard':
                this.velocity = 15;
                break;
            default:
                throw new Error(`Invalid difficulty: ${difficulty}`);
        }
        this.actualSpeed = 1 / (2 * this.velocity);
    }

    /**
     * Updates the vehicle's state and animation.
     */
    update() {

        const delta = this.clock.getDelta(); 
        if (this.mixer) {
            this.mixer.update(delta);
        }

        this.currentTime += delta;

        this.previousKeyPointIndex = this.currentKeyPointIndex;
        this.currentKeyPointIndex = this.getCurrentKeyPointIndex();

        if (Utils.distance(this.kf_arrays[this.currentKeyPointIndex], this.kf_arrays[this.currentKeyPointIndex + 1]) > 7) {
            this.importantNodes.wheelFL.rotation.y = 0
            this.importantNodes.wheelFR.rotation.y = 0
        } else if (this.angleVariations[this.currentKeyPointIndex] > 0) {
            this.importantNodes.wheelFL.rotation.y = Math.PI / 8
            this.importantNodes.wheelFR.rotation.y = Math.PI / 8
        } else if (this.angleVariations[this.currentKeyPointIndex] < 0) {
            this.importantNodes.wheelFL.rotation.y = -Math.PI / 8
            this.importantNodes.wheelFR.rotation.y = -Math.PI / 8
        }

        this.importantNodes.wheelBL.rotation.x += this.actualSpeed
        this.importantNodes.wheelBR.rotation.x += this.actualSpeed
        this.importantNodes.wheelFL.rotation.x += this.actualSpeed
        this.importantNodes.wheelFR.rotation.x += this.actualSpeed

        this.obb.update(this.mesh.matrixWorld)
    }

    /**
     * Controls the autonomous vehicle's movement along the predefined path.
     */
    controlCarOpponent() {
        let times = []
        let kf = []
        let qf = []
        this.kf_arrays = []
        let tangents = []

        for (let i = 0; i < this.keyPoints.length; i++) {
            kf.push(...this.keyPoints[i])
        }

        for (let i = 0; i < kf.length; i++) {
            if (i % 3 === 0) {
                this.kf_arrays.push(kf.slice(i, i + 3))
            }
        }
        

        for (let i = 0; i < kf.length / 3; i++) {
            times.push(i * this.velocity)
        }

        for (let i = 0; i <= 1; i += 1 / 132) {
            const cTangent = this.pathCurve.getTangent(i)
            tangents.push(cTangent)
        }

        this.angleVariation = 0.129;
        for (let i = 0; i < tangents.length; i++) {
            if (i === 0) {
                let axis = new THREE.Vector3(0, 1, 0); // You may need to adjust the axis based on your specific scenario
                let quaternion = new THREE.Quaternion().setFromAxisAngle(axis, 0.129);
                qf.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
                this.angleVariations.push(0.129)
            } else {
                this.angleVariation += Utils.calculateAngleVariation(tangents[i - 1], tangents[i]);
                this.angleVariations.push(Utils.calculateAngleVariation(tangents[i - 1], tangents[i]))
                let axis = new THREE.Vector3(0, 1, 0); // You may need to adjust the axis based on your specific scenario
                let quaternion = new THREE.Quaternion().setFromAxisAngle(axis, this.angleVariation);
                qf.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            }
        }

        for (let i=0;i<this.kf_arrays.length;i++){
            this.kf_arrays[i][1]=0.2;
        }
        for (let i = 0; i < this.kf_arrays.length; i++) {
            if (i>=this.kf_arrays.length-1){
                break;
            }

            if (i === this.kf_arrays.length - 1) {
                if (Utils.distance(this.kf_arrays[i], this.kf_arrays[0]) < 3.5) {
                    this.kf_arrays.splice(i+1, 1);
                    qf.splice((i + 1) * 4, 4);
                    i--;
                }
            } else if (Utils.distance(this.kf_arrays[i], this.kf_arrays[i + 1]) < 3.5) {
                this.kf_arrays.splice(i+1, 1);
                qf.splice((i + 1) * 4, 4);
                i--;
            }
        }


        let new_times = [];
        for (let i = 0; i < this.kf_arrays.length; i++) {
            if (i === 0) {
                new_times.push(0);
            } else {
                const distance = Utils.distance(this.kf_arrays[i - 1], this.kf_arrays[i]);
                new_times.push(new_times[i - 1] + (distance / this.velocity));
            }
        }


        let new_kf=[]
        for (let i = 0; i < this.kf_arrays.length; i++) {
            new_kf.push(...this.kf_arrays[i])
        }

        const positionKF = new THREE.VectorKeyframeTrack('.position', new_times, new_kf, THREE.InterpolateCatmullRom);
        const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', new_times, qf, THREE.InterpolateCatmullRom);
        this.mixer = new THREE.AnimationMixer(this.mesh);
        this.clip = new THREE.AnimationClip('positionAnimation', new_times[new_times.length - 1], [positionKF]);
        this.rotationClip = new THREE.AnimationClip('rotationAnimation', new_times[new_times.length - 1], [quaternionKF]);
        const action = this.mixer.clipAction(this.clip);
        const rotationAction = this.mixer.clipAction(this.rotationClip);
        action.play();
        rotationAction.play();
    }

    /**
     * Gets the index of the current key point based on the vehicle's position.
     * @returns {number} - The index of the current key point.
     */
    getCurrentKeyPointIndex() {
        const currentPosition = this.mesh.position.clone();

        // Calculate distances from the current position to each keyPoint
        const distances = this.kf_arrays.map(keyPoint => Utils.distance(currentPosition.toArray(), keyPoint));

        // Find the index of the keyPoint with the minimum distance
        const minDistanceIndex = distances.indexOf(Math.min(...distances));

        return minDistanceIndex;
    }

    /**
     * Pauses the vehicle's animation.
     */
    pause(){
        for (let i = 0; i < this.mixer._actions.length; i++) {
            this.mixer._actions[i].paused = true;
        }
    }

    /**
     * Resumes the vehicle's animation.
     */
    resume() {
        for (let i = 0; i < this.mixer._actions.length; i++) {
            this.mixer._actions[i].paused = false;
        }
    }
}

export {MyAutonomousVehicle};