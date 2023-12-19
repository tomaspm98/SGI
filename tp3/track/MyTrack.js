import * as THREE from 'three';
import { MyTriangle } from '../utils/MyTriangle.js';
import { hasIntersection } from './utils.js'

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

        for (let i = 0; i < pkPoints1.length; i++) {
            //random color
            const geo = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }))
            const geo1 = geo.clone()
            const geo2 = geo.clone()
            geo1.position.set(...pkPoints1[i])
            geo2.position.set(...pkPoints2[i])
            track.add(geo1)
            track.add(geo2)
        }

        let nextI, triangleBot, triangleTop

        let counter1 = 0
        let counter2 = 0
        for (let i = 0; i < pkPoints1.length; i++) {
            nextI = (i + 1) % pkPoints1.length

            triangleBot = new MyTriangle(pkPoints2[nextI], pkPoints1[nextI], pkPoints1[i])

            if (!hasIntersection(pkPoints1[i], pkPoints2[i], pkPoints1[nextI], pkPoints2[nextI])) {
                triangleTop = new MyTriangle(pkPoints1[i], pkPoints2[i], pkPoints2[nextI])
                counter1++
            } else {
                triangleTop = new MyTriangle(pkPoints1[i], pkPoints2[nextI], pkPoints2[i])
                const testGeo = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05), new THREE.MeshBasicMaterial({ color: 0x0000ff }))
                testGeo.position.set(...pkPoints1[i])
                track.add(testGeo)
                counter2++
            }

            const triangleTopMesh = new THREE.Mesh(triangleTop)
            const triangleBotMesh = new THREE.Mesh(triangleBot)

            track.add(triangleTopMesh)
            //track.add(triangleBotMesh)
        }
        console.log("TESTE1: " + counter1)
        console.log("TESTE2: " + counter2)

        return track
    }
}

export { MyTrack };