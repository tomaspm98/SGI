import { MyCircuitRenderer } from "./parser/MyCircuitRenderer.js";

class MyCircuit {
    static create(filePath) {
        const renderer = new MyCircuitRenderer();
        const [circuitScene, activatables, track, cameras] = renderer.render(filePath);
        return new MyCircuit(circuitScene, activatables, track, cameras);
    }
    constructor(circuitScene, activatables, track, cameras) {
        this.scene = circuitScene;
        this.activatables = activatables;
        this.track = track;
        this.cameras = cameras;
    }
}

export { MyCircuit };
