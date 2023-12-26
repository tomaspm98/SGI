import { MyCircuitRenderer } from "./parser/MyCircuitRenderer.js";

class MyCircuit {
    static create(filePath) {
        const renderer = new MyCircuitRenderer();
        const [circuitScene, activatables, track] = renderer.render(filePath);
        return new MyCircuit(circuitScene, activatables, track);
    }
    constructor(circuitScene, activatables, track) {
        this.scene = circuitScene;
        this.activatables = activatables;
        this.track = track;
    }
}

export { MyCircuit };