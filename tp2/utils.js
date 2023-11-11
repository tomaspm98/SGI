import * as THREE from 'three';
import {MyNurbsBuilder} from './MyNurbsBuilder.js';

function rgbToHex(color) {

    // Convert to hexadecimal and return
    return '#' +
        ('0' + Math.round(color.r * 255).toString(16)).slice(-2) +
        ('0' + Math.round(color.g * 255).toString(16)).slice(-2) +
        ('0' + Math.round(color.b * 255).toString(16)).slice(-2);
}

function createThreeGeometry(primitive) {
    switch (primitive.subtype) {
        case "rectangle":
            const point1 = primitive.representations[0]["xy1"];
            const point2 = primitive.representations[0]["xy2"];

            const plane = new THREE.PlaneGeometry(
                point2[0] - point1[0],
                point2[1] - point1[1],
                primitive.representations[0]["parts_x"],
                primitive.representations[0]["parts_y"]
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
        case "skybox":
            return new THREE.BoxGeometry(primitive.representations[0].width,
                primitive.representations[0].height,
                primitive.representations[0].depth)
        default:
            console.log("ERROR: primitive not found")
    }
}

function createThreeLight(light) {
    switch (light.type) {
        case 'spotlight':
            const spotLight = new THREE.SpotLight(
                rgbToHex(light.color),
                light.intensity,
                light.distance,
                light.angle * Math.PI / 180,
                light.penumbra,
                light.decay
            )

            spotLight.position.set(...light.position)
            spotLight.target.position.set(...light.target)
            spotLight.castShadow = light.castshadow
            spotLight.shadow.camera.far = light.shadowfar
            spotLight.shadow.mapSize = light.shadowmapsize

            return spotLight
        case 'pointlight':
            const pointLight = new THREE.PointLight(
                rgbToHex(light.color),
                light.intensity,
                light.distance,
                light.decay
            )

            pointLight.position.set(...light.position)
            pointLight.castShadow = light.castshadow
            pointLight.shadow.camera.far = light.shadowfar
            pointLight.shadow.mapSize = light.shadowmapsize

            return pointLight
        case 'directionallight':
            const directionalLight = new THREE.DirectionalLight(
                rgbToHex(light.color),
                light.intensity
            )

            directionalLight.position.set(...light.position)
            directionalLight.castShadow = light.castshadow
            directionalLight.shadow.camera.far = light.shadowfar
            directionalLight.shadow.mapSize = light.shadowmapsize
            directionalLight.shadow.camera.left = light.shadowleft
            directionalLight.shadow.camera.right = light.shadowright
            directionalLight.shadow.camera.bottom = light.shadowbottom
            directionalLight.shadow.camera.top = light.shadowtop

            return directionalLight
        default:
            console.error("ERROR: light not found")
            return
    }
}

function applyTransformation(sceneNode, transformations) {
    if (transformations === undefined)
        return;
    for (let transformation of transformations) {
        switch (transformation.type) {
            case 'S':
                sceneNode.scale.x *= transformation.scale[0]
                sceneNode.scale.y *= transformation.scale[1]
                sceneNode.scale.z *= transformation.scale[2]
                break;
            case 'T':
                sceneNode.position.x += transformation.translate[0]
                sceneNode.position.y += transformation.translate[1]
                sceneNode.position.z += transformation.translate[2]
                break;
            case 'R':
                let rotations = transformation.rotation.map(angle => angle * Math.PI / 180)
                sceneNode.rotation.x += rotations[0]
                sceneNode.rotation.y += rotations[1]
                sceneNode.rotation.z += rotations[2]
                break;
            default:
                break;
        }
    }
}

function convertFilterThree(filter) {
    switch (filter) {
        case "LinearFilter":
            return THREE.LinearFilter
        case "NearestFilter":
            return THREE.NearestFilter
        case "NearestMipmapNearestFilter":
            return THREE.NearestMipmapNearestFilter
        case "NearestMipmapLinearFilter":
            return THREE.NearestMipmapLinearFilter
        case "LinearMipmapNearestFilter":
            return THREE.LinearMipmapNearestFilter
        case "LinearMipmapLinearFilter":
            return THREE.LinearMipmapLinearFilter
        default:
            console.warn("WARNING: filter not found, using LinearFilter | Filter: " + filter)
            return THREE.LinearFilter
    }
}

function  loadMipmap(parentTexture, level, path)
{
    // load texture. On loaded call the function to create the mipmap for the specified level 
    new THREE.TextureLoader().load(path, 
        function(mipmapTexture)  // onLoad callback
        {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            ctx.scale(1, 1);
            
            // const fontSize = 48
            const img = mipmapTexture.image         
            canvas.width = img.width;
            canvas.height = img.height

            // first draw the image
            ctx.drawImage(img, 0, 0 )
                         
            // set the mipmap image in the parent texture in the appropriate level
            parentTexture.mipmaps[level] = canvas
        },
        undefined, // onProgress callback currently not supported
        function(err) {
            console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
        }
    )
}

export {createThreeGeometry, applyTransformation, rgbToHex, createThreeLight, convertFilterThree, loadMipmap};