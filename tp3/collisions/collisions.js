import * as THREE from 'three';

function collisionDetection(activeObject, rTree) {
    // Collision detection broad phase
    const selectedPassiveObjects = collisionDetectionBroadPhase(activeObject, rTree);

    if (selectedPassiveObjects.length == 0) {
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
    const passiveObjects = rTree.search(bb);
    return passiveObjects;
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
    const collisions = new THREE.Raycaster(pos, new THREE.Vector3(0, -1, 0), 0, 1).intersectObject(track.mesh);
    if (collisions.length > 0) {
        vehicle.changeState("normal");
    } else {
        vehicle.changeState("reducedSpeed");
        console.log("off track");
    }
}

export { collisionDetection, checkVehicleOnTrack };