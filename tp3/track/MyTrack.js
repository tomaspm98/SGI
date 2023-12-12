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
            const x = (points[i][0] - origin[0]) * size;
            const y = (points[i][1] - origin[1]) * size;
            pointsNormalized.push([x, y, 0]);
        }
        return pointsNormalized;
    }

    draw() {
        const trackGroup = new THREE.Group()
        for (const [x, y] of this.pointsTrack) {
            const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1))
            
            trackGroup.add()
        }
        return trackGroup
    }
}

export {MyTrack};