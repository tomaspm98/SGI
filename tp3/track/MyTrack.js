import * as THREE from 'three';
import { MyTriangle } from '../utils/MyTriangle.js';
import { orderPoints } from './utils.js'

class MyTrack {
    constructor(scene, infoTrack, size, numSegments, width) {
        this.scene = scene;
        this.infoTrack = infoTrack;
        this.pointsGeoJSON = this._normalizePoints(infoTrack["points"], size);
        this.width = width
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

    _normalizePoints(points, size = 1) {
        size = size * 1000 // the original points have a scale of 1/1000
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

        // The pk points are defined using the algorithm described in the class
        const pkPoints1 = []
        const pkPoints2 = []
        const upVector = new THREE.Vector3(0, 1, 0)
        for (let t = 0; t <= 1; t += 1 / this.numSegments) {
            const cPoint = curve.getPoint(t)
            const nkVector = new THREE.Vector3()
            nkVector.crossVectors(upVector, curve.getTangent(t))
            nkVector.multiplyScalar(this.width)
            const pkPoint1 = [cPoint.x + nkVector.x, cPoint.y + nkVector.y, cPoint.z + nkVector.z]
            const pkPoint2 = [cPoint.x - nkVector.x, cPoint.y - nkVector.y, cPoint.z - nkVector.z]
            pkPoints1.push(pkPoint1)
            pkPoints2.push(pkPoint2)
        }

        let nextI, orderedPoints, triangleTop, triangleBottom, triangleTopMesh, triangleBottomMesh

        for (let i = 0; i < pkPoints1.length; i++) {
            nextI = (i + 1) % pkPoints1.length

            // Draw the top triangle
            orderedPoints = orderPoints(pkPoints1[i], pkPoints1[nextI], pkPoints2[i])
            triangleTop = new MyTriangle(... orderedPoints)
            triangleTopMesh = new THREE.Mesh(triangleTop)

            // Draw the bottom triangle
            orderedPoints = orderPoints(pkPoints2[i], pkPoints2[nextI], pkPoints1[nextI])
            triangleBottom = new MyTriangle(... orderedPoints)
            triangleBottomMesh = new THREE.Mesh(triangleBottom)

            // Add the triangles to the track group
            track.add(triangleTopMesh)
            track.add(triangleBottomMesh)
        }

        return track
    }
}

export { MyTrack };