import * as THREE from 'three'
import { OBB } from 'three/addons/math/OBB.js';

class MyOBB {
    constructor(mesh) {
        const boundingBox = new THREE.Box3().setFromObject(mesh)
        // For this game, we only care about the x and z coordinates
        boundingBox.max.y = 0
        boundingBox.min.y = 0

        this.actualOBB = new OBB().fromBox3(boundingBox)
        this.initialOBB = this.actualOBB.clone()
    }

    update(matrixWorld) {
        this.actualOBB.copy(this.initialOBB).applyMatrix4(matrixWorld)
        if (this.helper) {
            this.helper.copy(this.helperOriginal).applyMatrix4(matrixWorld)
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