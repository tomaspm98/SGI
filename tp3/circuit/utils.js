import * as THREE from 'three';
import { MyObstacle1 } from './MyObstacles.js';
import { MyPowerUp1 } from './MyPowerUps.js';

function orderPoints(pA, pB, pC) {
    const vAB = new THREE.Vector3(pB[0] - pA[0], pB[1] - pA[1], pB[2] - pA[2])
    const vAC = new THREE.Vector3(pC[0] - pA[0], pC[1] - pA[1], pC[2] - pA[2])

    // normal vector to the plane defined by the triangle
    const normal = new THREE.Vector3().crossVectors(vAB, vAC)

    // if the y component of normal vector is negative, then the triangle is facing down
    // so we need to swap the order of the points
    if (normal.y > 0) {
        return [pA, pB, pC]
    } else {
        return [pA, pC, pB]
    }
}

function createActivatable(type, subtype, position, rotation = [0, 0, 0], scale = [1, 1, 1]) {
    if (type === 'obstacle') {
        if (subtype === '1') {
            return new MyObstacle1(position, rotation, scale)
        } else {
            throw new Error('Invalid subtype of obstacle')
        }

    } else if (type === 'powerup') {
        if (subtype === '1') {
            return new MyPowerUp1(position, rotation, scale)
        } else {
            throw new Error('Invalid subtype of powerUp')
        }
    } else {
        throw new Error('Invalid type of activatable')
    }
}

export { orderPoints, createActivatable }