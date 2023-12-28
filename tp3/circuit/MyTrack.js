import * as THREE from 'three';
import { MyTriangle } from '../utils/MyTriangle.js';

class MyTrack {
    constructor(points, size, numSegments, width, texture) {
        this.pointsGeoJSON = this._normalizePoints(points, size);
        console.log("points", this.pointsGeoJSON)
        this.width = width
        this.numSegments = numSegments
        this._loadTexture(texture)
        this._draw()
    }

    _draw() {
        const path = this._getCatmullRomCurve()

        this.line = this._drawLine(path)
        this.mesh = this._drawTrack(path)

        console.log(path)
        
        this.group = new THREE.Group()
        this.group.add(this.line)
        this.group.add(this.mesh)

        this.pointsGeoJSON.forEach((element) => {
            const cube = this.createCube(); // Create a cube using the createCube function
            cube.position.set(element[0], element[1], element[2]); // Set the cube's position based on the current element
            this.group.add(cube); // Add the cube to the group
        });
    }

    createCube(){
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        const cube = new THREE.Mesh( geometry, material );
        return cube;
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
            orderedPoints = this._orderPoints(pkPoints1[i], pkPoints1[nextI], pkPoints2[i])
            triangleTop = new MyTriangle(...orderedPoints)
            triangleTopMesh = new THREE.Mesh(triangleTop, this.roadMaterial)

            // Draw the bottom triangle
            orderedPoints = this._orderPoints(pkPoints2[i], pkPoints2[nextI], pkPoints1[nextI])
            triangleBottom = new MyTriangle(...orderedPoints)
            triangleBottomMesh = new THREE.Mesh(triangleBottom, this.roadMaterial)

            // Add the triangles to the circuit group
            track.add(triangleTopMesh)
            track.add(triangleBottomMesh)
        }

        return track
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

    _orderPoints(pA, pB, pC) {
        const vAB = new THREE.Vector3(pB[0] - pA[0], pB[1] - pA[1], pB[2] - pA[2])
        const vAC = new THREE.Vector3(pC[0] - pA[0], pC[1] - pA[1], pC[2] - pA[2])

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