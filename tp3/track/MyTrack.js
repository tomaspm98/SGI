import * as THREE from 'three';

class MyTrack {
    constructor(scene, infoTrack, size, numSegments) {
        this.scene = scene;
        this.infoTrack = infoTrack;
        this.pointsGeoJSON = this._normalizePoints(infoTrack["points"], size);
        this.width = this._calcWidthTrack()
        this.numSegments = numSegments
    }

    draw() {
        const trackGroup = new THREE.Group()
        const path = this._getCatmullRomCurve()

        const line = this._drawLine(path)

        const track = this._drawTrack(path)

        trackGroup.add(line)
        trackGroup.add(track)
        this.scene.add(trackGroup)
    }

    _normalizePoints(points, size) {
        const pointsNormalized = [];
        const origin = points[0];
        for (let i = 0; i < points.length; i++) {
            const x = (points[i][1] - origin[1]) * size;
            const z = (points[i][0] - origin[0]) * size;
            pointsNormalized.push([x, 0, z]);
        }
        return pointsNormalized;
    }

    _getCatmullRomCurve() {
        const points = []
        for (const [x, _, z] of this.pointsGeoJSON) {
            points.push(new THREE.Vector3(x, _, z))
        }
        const path = new THREE.CatmullRomCurve3(points)
        return path
    }

    _drawLine(path) {
        const points = path.getPoints(this.numSegments)
        const bGeometry = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(bGeometry)
        return line
    }

    _drawTrack(curve) {
        const track = new THREE.Group()
        const upVector = new THREE.Vector3(0, 1, 0)
        for (let t = 0; t <= 1; t += 1 / this.numSegments) {
            const cPoint = curve.getPoint(t)
            const nkVector = new THREE.Vector3()
            nkVector.crossVectors(upVector, curve.getTangent(t))
            nkVector.multiplyScalar(this.width / 2)
            console.log(this.width)
            const pkPoint = [nkVector.x + cPoint.x, nkVector.y + cPoint.y, nkVector.z + cPoint.z]

            const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32)
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
            const cylinder = new THREE.Mesh(geometry, material)
            cylinder.position.set(pkPoint[0], pkPoint[1], pkPoint[2])
            track.add(cylinder)
        }
        return track
    }

    _calcWidthTrack() {
        const min = this.pointsGeoJSON.reduce((prev, curr) => prev[2] < curr[2] ? prev : curr)
        const max = this.pointsGeoJSON.reduce((prev, curr) => prev[2] < curr[2] ? curr : prev)
    
        return Math.abs(max[2] - min[2])
    }
}

export { MyTrack };