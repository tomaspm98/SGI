import * as THREE from 'three'
import {OBB} from 'three/addons/math/OBB.js';

class MyOBB {
    /**
     * Constructs an instance of MyOBB based on a given mesh.
     * @param {THREE.Mesh} mesh - The mesh for which the OBB is created.
     */
    constructor(mesh) {
        const boundingBox = new THREE.Box3().setFromObject(mesh)
        // For this game, we only care about the x and z coordinates
        boundingBox.max.y = 0
        boundingBox.min.y = 0

        this.actualOBB = new OBB().fromBox3(boundingBox)

        this.actualOBB.center.y = 0

        this.initialOBB = this.actualOBB.clone()
    }

    /**
     * Updates the OBB based on the world matrix of the associated mesh.
     * @param {THREE.Matrix4} matrixWorld - The world matrix of the mesh.
     */
    update(matrixWorld) {

        // We need to remove the scale from the matrix
        // Otherwise, the OBB will be scaled as well

        const matrix = new THREE.Matrix4().copy(matrixWorld)

        const position = new THREE.Vector3()
        const quaternion = new THREE.Quaternion()
        const scale = new THREE.Vector3()
        matrix.decompose(position, quaternion, scale)
        scale.set(1, 1, 1)
        matrix.compose(position, quaternion, scale)

        this.actualOBB.copy(this.initialOBB).applyMatrix4(matrix)
        this.actualOBB.center.y = 0
        if (this.helper) {
            this.helper.copy(this.helperOriginal).applyMatrix4(matrix)
            this.helper.position.y = 0
        }
    }

    /**
     * Checks for collision with another OBB.
     * @param {MyOBB} obb - The other OBB to check for collision.
     * @returns {boolean} True if collision occurs, false otherwise.
     */
    collision(obb) {
        return this.actualOBB.intersectsOBB(obb.actualOBB)
    }

    /**
     * Creates a wireframe helper for visualizing the OBB.
     */
    createHelper() {
        const dimensions = this.initialOBB.halfSize.clone().multiplyScalar(2)
        const geometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z)
        const material = new THREE.MeshBasicMaterial({wireframe: true, color: 0x00ff00})
        this.helper = new THREE.Mesh(geometry, material)
        this.helper.position.copy(this.initialOBB.center)
        this.helper.rotation.copy(this.initialOBB.rotation)
        this.helperOriginal = this.helper.clone()
    }

    /**
     * Recalculates the OBB based on a new mesh.
     * @param {THREE.Mesh} mesh - The new mesh for which to recalculate the OBB.
     */
    recalculate(mesh) {
        const boundingBox = new THREE.Box3().setFromObject(mesh)
        // For this game, we only care about the x and z coordinates
        boundingBox.max.y = 0
        boundingBox.min.y = 0

        this.actualOBB = new OBB().fromBox3(boundingBox)

        this.actualOBB.center.y = 0

        this.initialOBB = this.actualOBB.clone()
        if (this.helper) {
            this.createHelper()
        }

    }
}

export {MyOBB}