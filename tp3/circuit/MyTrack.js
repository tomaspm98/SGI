import * as THREE from 'three';
import { MyTriangle } from '../utils/MyTriangle.js';

class MyTrack {
    constructor(points, size, numSegments, width, texture, numCheckPoints = 40) {
        this.pointsGeoJSON = this._normalizePoints(points, size);
        this.width = width
        this.numSegments = numSegments
        this.numCheckPoints = numCheckPoints
        this._loadTexture(texture)
        this._draw()
    }

    _draw() {
        const path = this._getCatmullRomCurve()

        this.line = this._drawLine(path)
        this.mesh = this._drawTrack(path)
        this.checkPoints = this._getCheckPoints(path, this.numCheckPoints)
        console.log(this.checkPoints)

        this.group = new THREE.Group()
        this.group.add(this.line)
        this.group.add(this.mesh)
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

        let nextI, orderedPoints, triangleTop, triangleBottom, triangleTopMesh, triangleBottomMesh
        const [pkPoints1, pkPoints2, _] = this._getPointsCurve(curve, this.numSegments)

        for (let i = 0; i < pkPoints1.length; i++) {
            nextI = (i + 1) % pkPoints1.length

            // Draw the top triangle
            orderedPoints = this._orderPoints(pkPoints1[i], pkPoints1[nextI], pkPoints2[i])
            triangleTop = new MyTriangle(
                Object.values(orderedPoints[0]),
                Object.values(orderedPoints[1]),
                Object.values(orderedPoints[2])
            )
            triangleTopMesh = new THREE.Mesh(triangleTop, this.roadMaterial)

            // Draw the bottom triangle
            orderedPoints = this._orderPoints(pkPoints2[i], pkPoints2[nextI], pkPoints1[nextI])
            triangleBottom = new MyTriangle(
                Object.values(orderedPoints[0]),
                Object.values(orderedPoints[1]),
                Object.values(orderedPoints[2])
            )
            triangleBottomMesh = new THREE.Mesh(triangleBottom, this.roadMaterial)

            // Add the triangles to the circuit group
            track.add(triangleTopMesh)
            track.add(triangleBottomMesh)
        }

        return track
    }

    _getPointsCurve(curve, numPoints) {
        // The pk points are defined using the algorithm described in the class
        const pkPoints1 = []
        const pkPoints2 = []
        const cPoints = []
        const upVector = new THREE.Vector3(0, 1, 0)
        for (let t = 0; t <= 1; t += 1 / numPoints) {
            const cPoint = curve.getPoint(t)
            const nkVector = new THREE.Vector3()
            nkVector.crossVectors(upVector, curve.getTangent(t))
            nkVector.multiplyScalar(this.width)
            const pkPoint1 = { x: cPoint.x + nkVector.x, y: cPoint.y + nkVector.y, z: cPoint.z + nkVector.z }
            const pkPoint2 = { x: cPoint.x - nkVector.x, y: cPoint.y - nkVector.y, z: cPoint.z - nkVector.z }
            pkPoints1.push(pkPoint1)
            pkPoints2.push(pkPoint2)
            cPoints.push(cPoint)
        }
        return [pkPoints1, pkPoints2, cPoints]
    }

    _loadTexture(textureFile) {
        const texture = new THREE.TextureLoader().load(textureFile);
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        this.roadMaterial = new THREE.MeshPhongMaterial(
            {
                map: texture,
                specular: 0x000000,
                shininess: 0,
                color: 0xaaaaaa,
            });
    }

    _getCheckPoints(curve, numCheckPoints) {
        const checkPoints = []
        const [pkPoints1, pkPoints2, cPoints] = this._getPointsCurve(curve, this.numSegments)
        for (let i = 0; i < numCheckPoints; i++) {
            checkPoints.push({ center: cPoints[i], pk1: pkPoints1[i], pk2: pkPoints2[i] })
        }
        return checkPoints

    }

    _orderPoints(pA, pB, pC) {
        const vAB = new THREE.Vector3(pB.x - pA.x, pB.y - pA.y, pB.z - pA.z)
        const vAC = new THREE.Vector3(pC.x - pA.x, pC.y - pA.y, pC.z - pA.z)

        // normal vector to the plane defined by the triangle
        const normal = new THREE.Vector3().crossVectors(vAB, vAC)

        // if the y component of normal vector is negative, then the triangle is facing down
        // so we need to swap the order of the points
        if (normal.y > 0) {
            return [pA, pB, pC]
        } else {
            return [pA, pC, pB]
        }
    }
}

export { MyTrack };