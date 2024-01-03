import RBush from './RBush.js';
import * as THREE from 'three';

class MyRTree {
    /**
     * Constructs an instance of MyRTree.
     */
    constructor() {
        this.tree = new RBush();
        this.map = [];
        this.idCounter = 0;
    }

    /**
     * Inserts an object into the R-tree.
     * @param {Object} object - The object to be inserted.
     */
    async insert(object) {
        const id = this.idCounter;
        this.idCounter++;
        this.map[id] = object;

        await object.meshPromise;

        const boundingBox = new THREE.Box3().setFromObject(object.mesh);
        await this.tree.insert({
            minX: boundingBox.min.x,
            minY: boundingBox.min.z,
            maxX: boundingBox.max.x,
            maxY: boundingBox.max.z,
            id: id,
        });
    }

    /**
     * Inserts multiple objects into the R-tree.
     * @param {Object[]} objects - An array of objects to be inserted.
     */
    async insertMany(objects) {
        for (const object of objects) {
            await object.meshPromise;
            await this.insert(object);
        }
    }

    /**
     * Searches for objects within a given bounding box.
     * @param {Object} bb - The bounding box to search within.
     * @returns {Object[]} An array of objects within the bounding box.
     */
    async search(bb) {
        const results = this.tree.search(bb);
        return results.map(result => this.map[result.id]);
    }
}

export { MyRTree };