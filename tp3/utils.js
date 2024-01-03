import * as THREE from 'three';


/**
 * Opens a JSON file and parses its content.
 * @param {string} file - The path to the JSON file.
 * @returns {Object} - The parsed JSON object.
 */
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

/**
 * Calculates the Euclidean distance between two points in 3D space.
 * @param {number[]} p1 - The coordinates of the first point [x, y, z].
 * @param {number[]} p2 - The coordinates of the second point [x, y, z].
 * @returns {number} - The Euclidean distance between the two points.
 */
function distance(p1,p2){
    return Math.sqrt(Math.pow(p1[0]-p2[0],2)+Math.pow(p1[1]-p2[1],2)+Math.pow(p1[2]-p2[2],2))
}

/**
 * Calculates the variation in angle between two tangent vectors.
 * @param {THREE.Vector3} tangent1 - The first tangent vector.
 * @param {THREE.Vector3} tangent2 - The second tangent vector.
 * @returns {number} - The angle variation in radians.
 */
function calculateAngleVariation(tangent1, tangent2) {
    // Normalize the tangent vectors
    tangent1.normalize();
    tangent2.normalize();

    // Calculate the dot product of the tangent vectors
    const dotProduct = tangent1.dot(tangent2);
    
    // Calculate the angle in radians
    const angleRadians = Math.acos(dotProduct);

    const crossProduct = new THREE.Vector3().crossVectors(tangent1, tangent2);
    const sign = crossProduct.y >= 0 ? 1 : -1;

    return angleRadians * sign;
}


export { openJSON, distance, calculateAngleVariation };
