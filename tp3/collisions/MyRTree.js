import RBush from './RBush.js';
import * as THREE from 'three';

class MyRTree {
    constructor() {
        this.tree = new RBush();
        this.map = [];
        this.idCounter = 0;
    }

    async insert(object) {
        console.log(object);
        const id = this.idCounter;
        this.idCounter++;
        this.map[id] = object;

        await object.meshPromise;

        const boundingBox = new THREE.Box3().setFromObject(object.mesh);
        this.tree.insert({
            minX: boundingBox.min.x,
            minY: boundingBox.min.z,
            maxX: boundingBox.max.x,
            maxY: boundingBox.max.z,
            id: id,
        });

        console.log(this.tree.toJSON());
    }

    async insertMany(objects) {
        for (const object of objects) {
            await object.meshPromise;
            this.insert(object);
        }
    }

    async search(bb) {
        await this.insertMany(objects);
        const results = this.tree.search(bb);
        return results.map(result => this.map[result.id]);
    }
}

export { MyRTree };