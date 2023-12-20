import {MyCircuitRenderer} from "./parser/MyCircuitRenderer.js";

class MyCircuit {
    constructor(filePath) {
        this.filePath = filePath;
    }

    build() {
        const renderer = new MyCircuitRenderer();
        this.scene = renderer.render(this.filePath);
    }
}

export {MyCircuit};