import * as THREE from 'three'
import { OBB } from 'three/addons/math/OBB.js';

class MyOBB {
    constructor(mesh) {
        const boundingBox = new THREE.Box3().setFromObject(mesh)
        // For this game, we only care about the x and z coordinates
        boundingBox.max.y = 0
        boundingBox.min.y = 0
        this.actualOBB = new OBB().fromBox3(boundingBox)

        this.actualOBB.center.y = 0

        this.initialOBB = this.actualOBB.clone()
    }

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

    collision(obb) {
        return this.actualOBB.intersectsOBB(obb.actualOBB)
    }

    createHelper() {
        const dimensions = this.initialOBB.halfSize.clone().multiplyScalar(2)
        const geometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z)
        const material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ff00 })
        this.helper = new THREE.Mesh(geometry, material)
        this.helper.position.copy(this.initialOBB.center)
        this.helper.rotation.copy(this.initialOBB.rotation)
        this.helperOriginal = this.helper.clone()
    }
}

export { MyOBB }