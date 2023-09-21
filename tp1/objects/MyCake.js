import * as THREE from 'three';

class MyCake {

    build(radius, height, cakeMaterial, radialSegments = 20, heightSegments = 1, thetaLength = 2 * Math.PI) {

        const cakeGeometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments, heightSegments, false, 0, thetaLength)
        const cakeMesh = new THREE.Mesh(cakeGeometry, cakeMaterial)

        const face1Geometry = new THREE.PlaneGeometry(2 * radius, height)
        const face2Geometry = new THREE.PlaneGeometry(2 * radius, height)

        if (thetaLength === 2 * Math.PI) return cakeMesh

        const face1Mesh = new THREE.Mesh(face1Geometry, cakeMaterial)
        const face2Mesh = new THREE.Mesh(face2Geometry, cakeMaterial)

        face1Mesh.rotation.y = -Math.PI / 2
        face2Mesh.rotation.y = Math.PI / 2 + thetaLength

        cakeMesh.add(face1Mesh)
        cakeMesh.add(face2Mesh)

        return cakeMesh

    }

}

export { MyCake };