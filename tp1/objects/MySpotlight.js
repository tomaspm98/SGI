import * as THREE from 'three';

class MySpotlight{
    build(spotlightRadius, spotlightHeight, lampHeight,spotlightMaterial){
        const spotlight = new THREE.Mesh()
        
        const wire = new THREE.CylinderGeometry(0.1,0.1,spotlightHeight,32)
        const wireMesh = new THREE.Mesh(wire,spotlightMaterial)
        spotlight.add(wireMesh)

        const lamp = new THREE.CylinderGeometry(spotlightRadius/2, spotlightRadius,lampHeight,32)
        const lampMesh = new THREE.Mesh(lamp, spotlightMaterial)
        lampMesh.position.y = -spotlightHeight/2 +lampHeight/2
        spotlight.add(lampMesh)
        return spotlight;
    }
} export{MySpotlight}