import {MyGameState} from "./MyGameState.js";
import * as THREE from 'three'
import {MyFirework} from "../MyFirework.js";

class ResultState extends MyGameState {
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo)
        console.log(stateInfo)
        this.name = "result"
        this.displayResults()
        this.fireworks = []
    }

    _createScene() {
        this.scene = this.stateInfo.circuit.scene
    }

    _createCameras() {
        this.cameras = this.stateInfo.circuit.cameras

        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshBasicMaterial({color: 0x00ff00})
        )

        this.scene.add(this.cameras['podium'])

        this.cameras['podium'].add(cube)
        cube.position.set(0, 0, -10)

        this.activeCameraName = 'podium'
    }

    displayResults() {
    }

    update() {
        if (Math.random() < 0.05) {
            this.fireworks.push(new MyFirework(this.scene, 10, 80))
        }


        for (let i = 0; i < this.fireworks.length; i++) {
            // is firework finished?
            if (this.fireworks[i].done) {
                // remove firework
                this.fireworks.splice(i, 1)
                continue
            }
            // otherwise upsdate  firework
            this.fireworks[i].update()
        }
    }
}

export {ResultState}