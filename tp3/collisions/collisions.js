import * as THREE from 'three';

function collisionDetection(activeObject, rTree) {
    // Collision detection broad phase
    const selectedPassiveObjects = collisionDetectionBroadPhase(activeObject, rTree);

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
function collisionDetectionBroadPhase(activeObject, rTree) {
    const bb = {
        minX: activeObject.bb.min.x,
        minY: activeObject.bb.min.z,
        maxX: activeObject.bb.max.x,
        maxY: activeObject.bb.max.z,
    }
    return rTree.search(bb);
}

function collisionDetectionNarrowPhase(activeObject, passiveObjects) {
    let collisions = [];
    for (const passiveObject of passiveObjects) {
        if (passiveObject.obb.collision(activeObject.obb)) {
            collisions.push(passiveObject);
        }
    }
    return collisions;
}

function checkVehicleOnTrack(vehicle, track) {
    const pos = new THREE.Vector3(vehicle.actualPosition.x, vehicle.actualPosition.y, vehicle.actualPosition.z);
    const collisions = new THREE.Raycaster(pos, new THREE.Vector3(0, -0.3, 0), 0, 1).intersectObject(track.mesh);
    vehicle.offTrack = collisions.length <= 0;
}

function checkCollisionVehicleOnVehicle(playerVehicle, opponentVehicle) {
    if(playerVehicle.obb.collision(opponentVehicle.obb)){
        console.log("COLLISION")
    }
    
    playerVehicle.collisionVehicle = !!playerVehicle.obb.collision(opponentVehicle.obb);
}

export { collisionDetection, checkVehicleOnTrack, checkCollisionVehicleOnVehicle };