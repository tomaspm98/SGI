import * as THREE from 'three';

class MySpring {

    build(point, width, height, sampleSize = 200, color = "#ffffff", incrementHeight = 0.01) {
        let points = new Array();

        //i - actual height
        //j - actual angle
        for (let i = 0, j = 0; i < height; i += incrementHeight, j += Math.PI / 16) {
            points.push(new THREE.Vector3(point.x + Math.cos(j) * width, point.y + i, point.z + Math.sin(j) * width));
        }


        const curve = new THREE.CatmullRomCurve3(points);
        const sampledPoints = curve.getPoints(sampleSize);
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
        const lineMaterial = new THREE.LineBasicMaterial({ color: color});

        return new THREE.Line(curveGeometry, lineMaterial)

    }
}

export { MySpring };