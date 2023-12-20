import * as THREE from 'three';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

/**
 *  This class contains the contents of our application
 */

class MyNurbsBuilder {
    /**
     * Constructs the object
     * @param {MyApp} app The application object
     */

    build(controlPoints, degree1, degree2, samples1, samples2) {
        const knots1 = [];
        const knots2 = [];
        // build knots1 = [ 0, 0, 0, 1, 1, 1 ];
        for (var i = 0; i <= degree1; i++) {
            knots1.push(0);
        }
        for (var i = 0; i <= degree1; i++) {
            knots1.push(1);
        }
        // build knots2 = [ 0, 0, 0, 0, 1, 1, 1, 1 ];
        for (var i = 0; i <= degree2; i++) {
            knots2.push(0);
        }
        for (var i = 0; i <= degree2; i++) {
            knots2.push(1);
        }

        let colLength = controlPoints.length;
        let stackedPoints = [];

        for (var i = 0; i < controlPoints.length; i++) {
            let row = controlPoints[i];
            let newRow = [];
            for (var j = 0; j < row.length; j++) {
                let item = row[j];
                newRow.push(new THREE.Vector4(item.xx, item.yy, item.zz, 1));
            }
            stackedPoints.push(newRow);
        }
        console.log("Stacked:", stackedPoints);
        console.log("KNOTS1", knots1);
        console.log("KNOTS2", knots2);
        console.log("DEGREE 1", degree1);
        console.log("DEGREE 2", degree2);
        const nurbsSurface = new NURBSSurface(degree1, degree2, knots1, knots2, stackedPoints);
        console.log("NURBS:", nurbsSurface);
        const geometry = new ParametricGeometry(getSurfacePoint, samples1, samples2);
        return geometry;

        function getSurfacePoint(u, v, target) {
            return nurbsSurface.getPoint(u, v, target);
        }
    }
}

export { MyNurbsBuilder };
        