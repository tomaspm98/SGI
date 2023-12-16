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

        let points = []
        for (const [x, _, z] of this.pointsTrack) {
            points.push(new THREE.Vector3(x, _, z))
        }
        const path = new THREE.CatmullRomCurve3(points)
        points = path.getPoints(500)
        const bGeometry = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(bGeometry)
        trackGroup.add(line)

        this.scene.add(trackGroup)
    }
}

export { MyTrack };