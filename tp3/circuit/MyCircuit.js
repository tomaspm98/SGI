import { MyCircuitRenderer } from "./parser/MyCircuitRenderer.js";

class MyCircuit {
    static create(filePath) {
        const renderer = new MyCircuitRenderer();
        const [circuitScene, activatables] = renderer.render(filePath);
        return new MyCircuit(circuitScene, activatables);
    }
    constructor(circuitScene, activatables) {
        this.scene = circuitScene;
        this.activatables = activatables;
    }
}

export { MyCircuit };