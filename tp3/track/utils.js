import * as THREE from 'three';

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

export { orderPoints }