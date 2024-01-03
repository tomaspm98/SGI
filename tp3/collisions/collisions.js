import * as THREE from 'three';

/**
 * Detects collisions in our program
 * @param {*} activeObject the active object that dinamically moves
 * @param {*} rTree the RTree with all the passive objects 
 * @returns  
 */
async function collisionDetection(activeObject, rTree) {
    // Collision detection broad phase
    const selectedPassiveObjects = await collisionDetectionBroadPhase(activeObject, rTree);

    if (selectedPassiveObjects.length === 0) {
        return;
    }

    
    // Collision detection narrow phase
    const collisions = collisionDetectionNarrowPhase(activeObject, selectedPassiveObjects);

    collisions.forEach(collision => {
        collision.activate(activeObject);
    });
}

// Implement collision detection broad phase
async function collisionDetectionBroadPhase(activeObject, rTree) {
    const bb = {
        minX: activeObject.bb.min.x,
        minY: activeObject.bb.min.z,
        maxX: activeObject.bb.max.x,
        maxY: activeObject.bb.max.z,
    }
    return await rTree.search(bb);
}

/**
 * Implement collision detection narrow phase
 * @param {*} activeObject the active object that dinamically moves 
 * @param {*} passiveObjects the passive objects that have fixed positions
 * @returns the collisions between the active object and the passive objects 
 */
function collisionDetectionNarrowPhase(activeObject, passiveObjects) {
    let collisions = [];
    for (const passiveObject of passiveObjects) {
        if (passiveObject.obb.collision(activeObject.obb)) {
            collisions.push(passiveObject);
        }
    }
    return collisions;
}

/**
 * Checks if a vehicle is off the track limits
 * @param {*} vehicle the player vehicle 
 * @param {*} track the track of the circuit
 */
function checkVehicleOnTrack(vehicle, track) {
    const pos = new THREE.Vector3(vehicle.actualPosition.x, vehicle.actualPosition.y, vehicle.actualPosition.z);
    const collisions = new THREE.Raycaster(pos, new THREE.Vector3(0, -0.3, 0), 0, 1).intersectObject(track.mesh);
    vehicle.offTrack = collisions.length <= 0;
}

/**
 * Checks for collisions between both vehicles
 * @param {*} playerVehicle vehicle used by the player
 * @param {*} opponentVehicle vehicle used by the opponent 
 */
function checkCollisionVehicleOnVehicle(playerVehicle, opponentVehicle) {
    if(playerVehicle.obb.collision(opponentVehicle.obb)){
        console.log("COLLISION")
    }
    
    playerVehicle.collisionVehicle = !!playerVehicle.obb.collision(opponentVehicle.obb);
}

export { collisionDetection, checkVehicleOnTrack, checkCollisionVehicleOnVehicle };