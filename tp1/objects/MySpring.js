import * as THREE from 'three';

class MySpring {

    build(point, width, height, sampleSize = 500, color = "#ffffff", incrementHeight = 1) {
        let points = new Array();

        //i - actual height
        //j - actual angle
        for (let i = 0, j = 0; i < height; i += incrementHeight, j += Math.PI / 16) {
            points.push(new THREE.Vector3(point.x + Math.cos(j) * width, point.y + i, point.z + Math.sin(j) * width));
        }


        const curve = new THREE.CatmullRomCurve3(points);
        const curveGeometry = new THREE.TubeGeometry(curve, sampleSize, 0.03, sampleSize);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: color});

        return new THREE.Line(curveGeometry, lineMaterial)

    }
}

export { MySpring };