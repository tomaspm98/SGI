import * as THREE from 'three';

class MyCup {

    build(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength, cupMaterial) {
        const cup = new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
        const cupMesh = new THREE.Mesh(cup,cupMaterial)

        return cupMesh

    }

}

export { MyCup };