import * as THREE from 'three';

class MyTrack {
    constructor(scene, infoTrack, size) {
        this.scene = scene;
        this.infoTrack = infoTrack;
        this.pointsTrack = this.normalizePoints(infoTrack["points"], size);
    }

    normalizePoints(points, size) {
        const pointsNormalized = [];
        const origin = points[0];
        for (let i = 0; i < points.length; i++) {
            const x = (points[i][1] - origin[1]) * size;
            const z = (points[i][0] - origin[0]) * size;
            pointsNormalized.push([x, 0, z]);
        }
        return pointsNormalized;
    }

    draw() {
        const trackGroup = new THREE.Group()
        for (const [x, _, z] of this.pointsTrack) {
            const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1))
            mesh.position.set(x, 0, z)
            trackGroup.add(mesh)
        }
        this.scene.add(trackGroup)
    }
}

export { MyTrack };