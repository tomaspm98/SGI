import * as THREE from 'three';

function collisionDetection(activeObject, passiveObjects) {
    // Collision detection broad phase
    const selectedPassiveObjects = collisionDetectionBroadPhase(activeObject, passiveObjects);

    // Collision detection narrow phase
    const collisions = collisionDetectionNarrowPhase(activeObject, selectedPassiveObjects);

    collisions.forEach(collision => {
        collision.activate(activeObject);
    });
}

// Implement collision detection broad phase
function collisionDetectionBroadPhase(activeObject, passiveObjects) {
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