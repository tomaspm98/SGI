import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class MyJournal {

    build(journalMaterial) {
        this.builder = new MyNurbsBuilder()
        this.meshes = []
        this.samplesU = 8        
        this.samplesV = 8         
        if (this.meshes !== null) {
            for (let i=0; i<this.meshes.length; i++) {
                this.app.scene.remove(this.meshes[i])
            }
            this.meshes = [] // empty the array  
        }

        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 2
        let orderV = 1

        controlPoints =
        [   // U = 0
        [ // V = 0..1;
            [ -1.0, -1.5, 0.0, 1 ],
            [ -1.0,  1.5, 0.0, 1 ],
        ],
    // U = 1
        [ // V = 0..1
            [ 0, -1.5, 3.0, 1 ],
            [ 0,  1.5, 3.0, 1 ]
        ],
    // U = 2
        [ // V = 0..1
            [ 1.0, -1.5, 0.0, 1 ],
            [ 1.0,  1.5, 0.0, 1 ]
        ],


]
        surfaceData = this.builder.build(controlPoints, orderU, orderV, this.samplesU,this.samplesV, this.material)  
        mesh = new THREE.Mesh( surfaceData, journalMaterial );
        mesh.rotation.x = 0
        mesh.rotation.y = 0
        mesh.rotation.z = 0
        mesh.scale.set( 1,1,1 )
        mesh.position.set( 0,0,0 )
        const mesh2=new THREE.Mesh( surfaceData, journalMaterial );
        mesh2.position.x = 2;
        mesh.add(mesh2);
        return mesh
    }

    
}

export { MyJournal };