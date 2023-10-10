import * as THREE from 'three';

class MyRemote {

    build(remoteWidth, remoteHeight, remoteDepth, remoteMaterial, buttonSize, buttonMaterial, powerMaterial) {

        const remote = new THREE.BoxGeometry(remoteWidth, remoteHeight, remoteDepth)
        const remoteMesh = new THREE.Mesh(remote, remoteMaterial)

        const normalButton = new THREE.BoxGeometry(buttonSize,buttonSize,remoteDepth/3)
        
        const powerButton = new THREE.CylinderGeometry(buttonSize/2,buttonSize,remoteDepth/3,32)
        const powerMesh = new THREE.Mesh(powerButton, powerMaterial)

        powerMesh.position.z = remoteDepth/2
        powerMesh.position.y = (remoteHeight/2-1)
        powerMesh.position.x = -remoteWidth/2+0.5
        powerMesh.rotation.x=Math.PI/2
        remoteMesh.add(powerMesh)
        
        const normalButtonMesh1 = new THREE.Mesh(normalButton,buttonMaterial)
        normalButtonMesh1.position.z = remoteDepth/2
        normalButtonMesh1.position.y = remoteHeight/2-1
        normalButtonMesh1.position.x = remoteWidth/2-0.5
        remoteMesh.add(normalButtonMesh1)

        const normalButtonMesh2 = new THREE.Mesh(normalButton,buttonMaterial)
        normalButtonMesh2.position.z = remoteDepth/2
        normalButtonMesh2.position.y = remoteHeight/3-1.5
        normalButtonMesh2.position.x = -remoteWidth/2+0.5
        remoteMesh.add(normalButtonMesh2)

        const normalButtonMesh3 = new THREE.Mesh(normalButton,buttonMaterial)
        normalButtonMesh3.position.z = remoteDepth/2
        normalButtonMesh3.position.y = remoteHeight/3-1.5
        remoteMesh.add(normalButtonMesh3)
        
        const normalButtonMesh4 = new THREE.Mesh(normalButton,buttonMaterial)
        normalButtonMesh4.position.z = remoteDepth/2
        normalButtonMesh4.position.y = remoteHeight/3-1.5
        normalButtonMesh4.position.x = remoteWidth/2-0.5
        remoteMesh.add(normalButtonMesh4)

        const normalButtonMesh5 = new THREE.Mesh(normalButton,buttonMaterial)
        normalButtonMesh5.position.z = remoteDepth/2
        normalButtonMesh5.position.x = -remoteWidth/2+0.5
        remoteMesh.add(normalButtonMesh5)

        const normalButtonMesh6 = new THREE.Mesh(normalButton,buttonMaterial)
        normalButtonMesh6.position.z = remoteDepth/2
        remoteMesh.add(normalButtonMesh6)

        const normalButtonMesh7 = new THREE.Mesh(normalButton,buttonMaterial)
        normalButtonMesh7.position.z = remoteDepth/2
        normalButtonMesh7.position.x = remoteWidth/2-0.5
        remoteMesh.add(normalButtonMesh7)

        const normalButtonMesh8 = new THREE.Mesh(normalButton,buttonMaterial)
        normalButtonMesh8.position.z = remoteDepth/2
        normalButtonMesh8.position.y = -remoteHeight/3+1.5
        normalButtonMesh8.position.x = -remoteWidth/2+0.5
        remoteMesh.add(normalButtonMesh8)

        const normalButtonMesh9 = new THREE.Mesh(normalButton,buttonMaterial)
        normalButtonMesh9.position.z = remoteDepth/2
        normalButtonMesh9.position.y = -remoteHeight/3+1.5
        remoteMesh.add(normalButtonMesh9)

        const normalButtonMesh10 = new THREE.Mesh(normalButton,buttonMaterial)
        normalButtonMesh10.position.z = remoteDepth/2
        normalButtonMesh10.position.y = -remoteHeight/3+1.5
        normalButtonMesh10.position.x = remoteWidth/2-0.5
        remoteMesh.add(normalButtonMesh10)

        return remoteMesh
    }
}

export { MyRemote };