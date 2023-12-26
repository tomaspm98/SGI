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

export { collisionDetection };