import * as THREE from 'three';
import {MyNurbsBuilder} from './MyNurbsBuilder.js';


function getThreeGeometry(primitive) {
    switch (primitive.subtype) {
        case "rectangle":
            const point1 = primitive.representations[0]["xy1"];
            const point2 = primitive.representations[0]["xy2"];

            const plane = new THREE.PlaneGeometry(
                point2[0] - point1[0],
                point2[1] - point1[1],
                primitive.representations["parts_x"],
                primitive.representations["parts_y"]
            );
            
            plane.translate(
                (point2[0] + point1[0]) / 2,
                (point2[1] + point1[1]) / 2,
                0
            );
            
            return plane;
        case "model3d":
            return new THREE.ObjectLoader().load(primitive.representations[0].filepath)
        case "sphere":
            return new THREE.SphereGeometry(
                primitive.representations["radius"],
                primitive.representations["slices"],
                primitive.representations["stacks"],
                primitive.representations["phistart"],
                primitive.representations["philength"],
                primitive.representations["thetastart"],
                primitive.representations["thetalength"]
            );
        case "box":
            const point3 = primitive.representations[0]["xyz1"];
            const point4 = primitive.representations[0]["xyz2"];

            return new THREE.BoxGeometry(
                point4[0] - point3[0],
                point4[1] - point3[1],
                point4[2] - point3[2],
                primitive.representations["parts_x"],
                primitive.representations["parts_y"],
                primitive.representations["parts_z"]
            );
        case "cylinder":
            return new THREE.CylinderGeometry(
                primitive.representations[0].top,
                primitive.representations[0].base,
                primitive.representations[0].height,
                primitive.representations[0].slices,
                primitive.representations[0].stacks,
                primitive.representations[0].capsclose, 
                primitive.representations[0].thetastart, 
                primitive.representations[0].thetalength
            )
        case "nurbs":
            const length = (primitive.representations[0].degree_u + 1) * (primitive.representations[0].degree_v + 1) / Math.min(primitive.representations[0].degree_u + 1, primitive.representations[0].degree_v + 1)
            const controlPoints = []
            for (let i = 0; i < primitive.representations[0].controlpoints.length; i += length) {
                let row = primitive.representations[0].controlpoints.slice(i, i + length)
                controlPoints.push(row)
            }
            return new MyNurbsBuilder().build(controlPoints, primitive.representations[0].degree_u, primitive.representations[0].degree_v, primitive.representations[0].parts_u, primitive.representations[0].parts_v)
        default:
            console.log("ERROR: primitive not found")
    }
}

function applyTransformation(sceneNode, transformations) {
    if (transformations === undefined)
        return;
    for (let transformation of transformations) {
        switch (transformation.type) {
            case 'S':
                //sceneNode.scale.set(...transformation.scale)
                sceneNode.scale.x *= transformation.scale[0]
                sceneNode.scale.y *= transformation.scale[1]
                sceneNode.scale.z *= transformation.scale[2]
                break;
            case 'T':
                //sceneNode.position.set(...transformation.translate)
                sceneNode.position.x += transformation.translate[0]
                sceneNode.position.y += transformation.translate[1]
                sceneNode.position.z += transformation.translate[2]
                break;
            case 'R':
                let rotations = transformation.rotation.map(angle => angle * Math.PI / 180)
                sceneNode.rotation.x += rotations[0]
                sceneNode.rotation.y += rotations[1]
                sceneNode.rotation.z += rotations[2]
                //sceneNode.rotation.set(...transformation.rotation.map(angle => angle * Math.PI / 180))
                break;
            default:
                break;
        }
    }
}

export {getThreeGeometry, applyTransformation};