import { MyCircuitRenderer } from "./parser/MyCircuitRenderer.js";
import {RBush} from '../collisions/RBush.js';

class MyCircuit {
    static create(filePath) {
        const renderer = new MyCircuitRenderer();
        const [circuitScene, activatables, track, cameras, slots] = renderer.render(filePath);
        return new MyCircuit(circuitScene, activatables, track, cameras, slots);
    }
    constructor(circuitScene, activatables, track, cameras, slots) {
        this.scene = circuitScene;
        this.activatables = activatables;
        this.track = track;
        this.cameras = cameras;
        this.slots = slots
    }

    createRTree(){
        this.rTree = new RBush();

    }
}

export { MyCircuit };
