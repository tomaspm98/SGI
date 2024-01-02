import { MyGameState } from "./MyGameState.js";
import * as THREE from 'three';

class ResultState extends MyGameState {
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo)
        this.name = "result"
        this.displayResults()
    }

    _createScene() {
        this.scene = this.stateInfo.circuit.scene

    }

    _createCameras() {
        this.cameras = this.stateInfo.circuit.cameras

        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        )

        this.scene.add(this.cameras['podium'])

        this.cameras['podium'].add(cube)
        cube.position.set(0, 0, -10)

        this.activeCameraName = 'podium'
    }

    displayResults() {
    }
}

export { ResultState }