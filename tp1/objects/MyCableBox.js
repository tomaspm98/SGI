import * as THREE from 'three';

class MyCableBox {

    build(boxWidth, boxHeight, boxDepth, boxMaterial, powerMaterial) {

        const cableBox = new THREE.BoxGeometry(boxWidth, boxHeight,boxDepth)
        const cableBoxMesh = new THREE.Mesh(cableBox,boxMaterial)

        const powerButton = new THREE.CylinderGeometry(boxDepth/30,boxDepth/30,boxDepth/30,32)
        const powerMesh = new THREE.Mesh(powerButton, powerMaterial)
        powerMesh.rotation.z=Math.PI/2
        powerMesh.position.x = boxWidth/2
        
        cableBoxMesh.add(powerMesh)

        return cableBoxMesh
        
    }
}

export { MyCableBox };