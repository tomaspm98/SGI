import * as THREE from 'three';

class MyChair{
    build(chairWidth, chairHeight, chairLength, chairMaterial){
        const chairMesh = new THREE.Mesh()

        const chairSit = new THREE.BoxGeometry(chairLength,0.40,chairWidth)
        const chairSitMesh = new THREE.Mesh(chairSit,chairMaterial)
        chairSitMesh.position.y = chairHeight
        chairMesh.add(chairSitMesh)

        const chairLeg = new THREE.BoxGeometry(0.5,chairSitMesh.position.y,0.5)
        const chairLegMesh1 = new THREE.Mesh(chairLeg,chairMaterial)
        const chairLegMesh2 = new THREE.Mesh(chairLeg,chairMaterial)
        const chairLegMesh3 = new THREE.Mesh(chairLeg,chairMaterial)
        const chairLegMesh4 = new THREE.Mesh(chairLeg,chairMaterial)
        
        const slack = chairLength / 12

        chairLegMesh1.position.y=chairSitMesh.position.y/2
        chairLegMesh1.position.x=chairLength/2 - slack
        chairLegMesh1.position.z=chairWidth/2 - slack
        chairMesh.add(chairLegMesh1)

        chairLegMesh2.position.y=chairSitMesh.position.y/2
        chairLegMesh2.position.x=chairLength/2 - slack
        chairLegMesh2.position.z=-chairWidth/2 + slack
        chairMesh.add(chairLegMesh2)

        chairLegMesh3.position.y=chairSitMesh.position.y/2
        chairLegMesh3.position.x=-chairLength/2 + slack
        chairLegMesh3.position.z=-chairWidth/2 + slack
        chairMesh.add(chairLegMesh3)

        chairLegMesh4.position.y=chairSitMesh.position.y/2
        chairLegMesh4.position.x=-chairLength/2 + slack
        chairLegMesh4.position.z=chairWidth/2 - slack
        chairMesh.add(chairLegMesh4)

        const BackHeight = 1.2*chairLength
        const chairBack = new THREE.BoxGeometry(chairLength,0.4,BackHeight)
        const chairBackMesh = new THREE.Mesh(chairBack,chairMaterial)
        chairBackMesh.position.y = chairSitMesh.position.y+BackHeight/2
        chairBackMesh.position.z = -chairWidth/2 +0.2
        chairBackMesh.rotation.x=Math.PI/2
        chairMesh.add(chairBackMesh)

        return chairMesh
    }
} export{MyChair}