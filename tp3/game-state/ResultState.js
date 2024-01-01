import { MyGameState } from "./MyGameState.js";
import * as THREE from 'three'
import { MyFirework } from "../MyFirework.js";

class ResultState extends MyGameState{
    constructor(gameStateManager, stateInfo) {
        super(gameStateManager, stateInfo)
        console.log(stateInfo)
        this.name = "result"
        this.fireworks=[]
    }

    _createScene(){
        this.scene = this.stateInfo.circuit.scene
    }

    _createCameras(){
        this.cameras = this.stateInfo.circuit.cameras
        this.activeCameraName = 'podium'
    }

    update(){
        if (Math.random()<0.05){
            this.fireworks.push(new MyFirework(this.scene, 10, 80))
            console.log("firework added")
        }
    

    for( let i = 0; i < this.fireworks.length; i++ ) {
        // is firework finished?
        if (this.fireworks[i].done) {
            // remove firework 
            this.fireworks.splice(i,1) 
            console.log("firework removed")
            continue 
        }
        // otherwise upsdate  firework
        this.fireworks[i].update()
    }
}
}

export { ResultState }