import { MyCircuitRenderer } from "./parser/MyCircuitRenderer.js";
import { MyRTree } from '../collisions/MyRTree.js';

class MyCircuit {
    /**
     * Creates a new circuit.
     * @param {*} filePath - The path to the circuit file. 
     * @returns A new circuit.
     */
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
        this.rTree = new MyRTree();
        this.rTree.insertMany(this.activatables);
    }
}

export { MyCircuit };
