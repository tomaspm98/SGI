import * as THREE from 'three';

function openJSON(file) {
    let request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.send(null);

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        throw new Error('Failed to load file: ' + file);
    }
}

function distance(p1,p2){
    return Math.sqrt(Math.pow(p1[0]-p2[0],2)+Math.pow(p1[1]-p2[1],2)+Math.pow(p1[2]-p2[2],2))
}

function calculateAngleVariation(tangent1, tangent2) {
    // Normalize the tangent vectors
    tangent1.normalize();
    tangent2.normalize();

    // Calculate the dot product of the tangent vectors
    const dotProduct = tangent1.dot(tangent2);

    console.log(tangent1,tangent2,dotProduct)

    // Calculate the angle in radians
    const angleRadians = Math.acos(dotProduct);

    const crossProduct = new THREE.Vector3().crossVectors(tangent1, tangent2);
    const sign = crossProduct.y >= 0 ? 1 : -1;

    return angleRadians * sign;
}


export { openJSON, distance, calculateAngleVariation };
