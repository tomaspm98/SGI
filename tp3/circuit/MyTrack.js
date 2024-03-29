import * as THREE from 'three';
import {MyTriangle} from '../utils/MyTriangle.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

class MyTrack {
    constructor(points, size, numSegments, width, texture, numCheckPoints, checkPointModel) {
        this.pointsGeoJSON = this._normalizePoints(points, size);
        this.width = width
        this.numSegments = numSegments
        this.numCheckPoints = numCheckPoints
        this._loadTexture(texture)
        this._draw()

        if (checkPointModel) {
            const loader = new GLTFLoader();
            loader.load(checkPointModel, this._addCheckPointsModel.bind(this),
                undefined,
                function (error) {
                    console.error(error);
                });
        }
    }

    /**
     * Function to draw the track.
     */
    _draw() {
        this.path = this._getCatmullRomCurve()
        //this.line = this._drawLine()
        this.mesh = this._drawTrack(this.path)
        this.checkPoints = this._getCheckPoints(this.numCheckPoints)

        this.group = new THREE.Group()
        //this.group.add(this.line)
        this.group.add(this.mesh)
    }

    /**
     * Function to get the path of the track.
     * @returns The path of the track.
     */
    _getPath() {
        return this.path;
    }

    /**
     * Normalize the points of the track
     * @param {*} points The points of the track 
     * @param {*} size The size of the track 
     * @returns The normalized points 
     */
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

    /**
     * Function to get the catmull rom curve of the track 
     * @returns The catmull rom curve of the track
     */
    _getCatmullRomCurve() {
        const points = []
        for (const [x, _, z] of this.pointsGeoJSON) {
            points.push(new THREE.Vector3(x, _, z))
        }
        return new THREE.CatmullRomCurve3(points)
    }

    /**
     * Function to draw the line of the track 
     * @returns The line of the track
     */
    _drawLine() {
        const points = this.path.getPoints(this.numSegments)
        const bGeometry = new THREE.BufferGeometry().setFromPoints(points)
        return new THREE.Line(bGeometry)
    }

    /**
     * Function to draw the track
     * @returns The track 
     */
    _drawTrack() {
        const track = new THREE.Group()

        let nextI, orderedPoints, triangleTop, triangleBottom, triangleTopMesh, triangleBottomMesh
        const [pkPoints1, pkPoints2, _] = this._getPointsCurve(this.numSegments)

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

    /**
     * Function to get the points of the track
     * @param {*} numPoints The number of points
     * @returns The points of the track 
     */
    _getPointsCurve(numPoints) {
        // The pk points are defined using the algorithm described in the class
        const pkPoints1 = []
        const pkPoints2 = []
        const cPoints = []
        const upVector = new THREE.Vector3(0, 1, 0)
        for (let t = 0; t <= 1; t += 1 / numPoints) {
            const cPoint = this.path.getPoint(t)
            const nkVector = new THREE.Vector3()
            nkVector.crossVectors(upVector, this.path.getTangent(t))
            nkVector.multiplyScalar(this.width / 2)
            const pkPoint1 = {x: cPoint.x + nkVector.x, y: cPoint.y + nkVector.y, z: cPoint.z + nkVector.z}
            const pkPoint2 = {x: cPoint.x - nkVector.x, y: cPoint.y - nkVector.y, z: cPoint.z - nkVector.z}
            pkPoints1.push(pkPoint1)
            pkPoints2.push(pkPoint2)
            cPoints.push(cPoint)
        }
        return [pkPoints1, pkPoints2, cPoints]
    }

    /**
     * Function to load a texture
     * @param {*} textureFile The texture file 
     */
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

    /**
     * Function to get the check points on the track
     * @param {*} numCheckPoints The number of check points 
     * @returns The check points on the track 
     */
    _getCheckPoints(numCheckPoints) {
        const checkPoints = []
        const [pkPoints1, pkPoints2, cPoints] = this._getPointsCurve(numCheckPoints)
        for (let i = 0; i < numCheckPoints; i++) {
            const pkPoints1Vector = new THREE.Vector3(pkPoints1[i].x, pkPoints1[i].y, pkPoints1[i].z)
            const pkPoints2Vector = new THREE.Vector3(pkPoints2[i].x, pkPoints2[i].y, pkPoints2[i].z)
            const cPointsVector = new THREE.Vector3(cPoints[i].x, cPoints[i].y, cPoints[i].z)
            const direction = new THREE.Vector3().subVectors(pkPoints2Vector, pkPoints1Vector).normalize()
            checkPoints.push({center: cPointsVector, pk1: pkPoints1Vector, pk2: pkPoints2Vector, direction: direction})
        }
        return checkPoints

    }

    /**
     * Function to order the points of the triangle
     * @param {*} pA Point 1 
     * @param {*} pB Point 2
     * @param {*} pC Point 3
     * @returns Returns order of the points
     */
    _orderPoints(pA, pB, pC) {
        const vAB = new THREE.Vector3(pB.x - pA.x, pB.y - pA.y, pB.z - pA.z)
        const vAC = new THREE.Vector3(pC.x - pA.x, pC.y - pA.y, pC.z - pA.z)

        // normal vector to the plane defined by the triangle
        const normal = new THREE.Vector3().crossVectors(vAB, vAC)

        // if the y component of normal vector is negative, then the triangle is facing down,
        // so we need to swap the order of the points
        if (normal.y > 0) {
            return [pA, pB, pC]
        } else {
            return [pA, pC, pB]
        }
    }

    /**
     * Function to add the check points model to the circuit
     * @param {*} gltf The gltf model 
     */
    _addCheckPointsModel(gltf) {
        const checkPointsGroup = new THREE.Group()
        checkPointsGroup.name = 'checkPoints'
        const model = gltf.scene
        model.scale.set(1.5, 1.5, 1.5)
        for (const checkPoint of this.checkPoints) {
            const newModel = model.clone()
            const newModel2 = model.clone()

            newModel.position.set(checkPoint.pk1.x, checkPoint.pk1.y + 0.15, checkPoint.pk1.z)
            newModel2.position.set(checkPoint.pk2.x, checkPoint.pk2.y + 0.15, checkPoint.pk2.z)

            checkPointsGroup.add(newModel)
            checkPointsGroup.add(newModel2)
        }
        this.group.add(checkPointsGroup)
    }
}

export {MyTrack};