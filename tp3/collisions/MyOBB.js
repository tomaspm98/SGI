import * as THREE from 'three'
import { OBB } from 'three/addons/math/OBB.js';

function createOBB2D(mesh) {
    const center = calculateCenter(mesh)
    const halfSize = calculateHalfSize(mesh)
    const rotation = calculateRotation(mesh)
    return new THREE.OBB(center, halfSize, rotation)
}

function calculateCenter(mesh) {
    
}

function calculateHalfSize(mesh) {

}

function calculateRotation(mesh) {

}