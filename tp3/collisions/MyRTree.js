import RBush from './RBush.js';
import * as THREE from 'three';

class MyRTree {
    constructor() {
        this.tree = new RBush();
        this.map = [];
        this.idCounter = 0;
    }

    insert(object) {
        const id = this.idCounter;
        this.idCounter++;
        this.map[id] = object;

        const boundingBox = new THREE.Box3().setFromObject(object.mesh);
        this.tree.insert({
            minX: boundingBox.min.x,
            minY: boundingBox.min.z,
            maxX: boundingBox.max.x,
            maxY: boundingBox.max.z,
            id: id,
        });
    }

    insertMany(objects) {
        for (const object of objects) {
            this.insert(object);
        }
    }

    search(object) {
        const boundingBox = new THREE.Box3().setFromObject(object);
        const results = this.tree.search({
            minX: boundingBox.min.x,
            minY: boundingBox.min.z,
            maxX: boundingBox.max.x,
            maxY: boundingBox.max.z,
        });
        return results.map(result => this.map[result.id]);
    }
}

export { MyRTree };