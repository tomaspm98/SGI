import {MyCircuitRenderer} from "./parser/MyCircuitRenderer.js";

class MyCircuit {
    constructor(filePath) {
        this.filePath = filePath;
    }

    build() {
        const renderer = new MyCircuitRenderer();
        this.circuitScene = renderer.render(this.filePath);
    }
}

export {MyCircuit};