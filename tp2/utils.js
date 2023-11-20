import * as THREE from 'three';
import {MyNurbsBuilder} from './MyNurbsBuilder.js';
import { MyTriangle } from './MyTriangle.js';

function rgbToHex(color) {
    return new THREE.Color(color.r, color.g, color.b)
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
                primitive.representations[0]["radius"],
                primitive.representations[0]["slices"],
                primitive.representations[0]["stacks"],
                primitive.representations[0]["phistart"],
                primitive.representations[0]["philength"],
                primitive.representations[0]["thetastart"],
                primitive.representations[0]["thetalength"]
            );
        case "box":
            const point3 = primitive.representations[0]["xyz1"];
            const point4 = primitive.representations[0]["xyz2"];

            const box = new THREE.BoxGeometry(
                point4[0] - point3[0],
                point4[1] - point3[1],
                point4[2] - point3[2],
                primitive.representations["parts_x"],
                primitive.representations["parts_y"],
                primitive.representations["parts_z"]
            )


            box.translate(
                (point4[0] + point3[0]) / 2,
                (point4[1] + point3[1]) / 2,
                (point4[2] + point3[2]) / 2
            );

            return box;
        case "cylinder":
            return new THREE.CylinderGeometry(
                primitive.representations[0].top,
                primitive.representations[0].base,
                primitive.representations[0].height,
                primitive.representations[0].slices,
                primitive.representations[0].stacks,
                !primitive.representations[0].capsclose,
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
        case "polygon":
            return createPolygon(primitive.representations[0].stacks, primitive.representations[0].slices, primitive.representations[0].radius, primitive.representations[0].color_c, primitive.representations[0].color_p)
        case "triangle":
            return new MyTriangle(primitive.representations[0].xyz1, primitive.representations[0].xyz2, primitive.representations[0].xyz3)
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
            spotLight.shadow.mapSize.width = light.shadowmapsize
            spotLight.shadow.mapSize.height = light.shadowmapsize
            spotLight.visible = light.enabled
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
            pointLight.shadow.mapSize.width = light.shadowmapsize 
            pointLight.shadow.mapSize.height = light.shadowmapsize
            pointLight.visible = light.enabled
            return pointLight
        case 'directionallight':
            const directionalLight = new THREE.DirectionalLight(
                rgbToHex(light.color),
                light.intensity
            )

            directionalLight.position.set(...light.position)
            directionalLight.castShadow = light.castshadow
            directionalLight.shadow.camera.far = light.shadowfar
            directionalLight.shadow.mapSize.width = light.shadowmapsize
            directionalLight.shadow.mapSize.height = light.shadowmapsize
            directionalLight.shadow.camera.left = light.shadowleft
            directionalLight.shadow.camera.right = light.shadowright
            directionalLight.shadow.camera.bottom = light.shadowbottom
            directionalLight.shadow.camera.top = light.shadowtop
            directionalLight.visible = light.enabled
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
                const scales = [sceneNode.scale.x * transformation.scale[0], sceneNode.scale.y * transformation.scale[1], sceneNode.scale.z * transformation.scale[2]]
                sceneNode.scale.set(...scales)
                break;
            case 'T':
                sceneNode.translateX(transformation.translate[0]);
                sceneNode.translateY(transformation.translate[1]);
                sceneNode.translateZ(transformation.translate[2]);
                break;
            case 'R':
                let rotations = transformation.rotation.map(angle => angle * Math.PI / 180)
                rotations = [rotations[0] + sceneNode.rotation.x, rotations[1] + sceneNode.rotation.y, rotations[2] + sceneNode.rotation.z]
                sceneNode.rotation.set(...rotations)
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

function loadMipmap(parentTexture, level, path) {
    // load texture. On loaded call the function to create the mipmap for the specified level 
    new THREE.TextureLoader().load(path,
        function (mipmapTexture)  // onLoad callback
        {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            ctx.scale(1, 1);

            // const fontSize = 48
            const img = mipmapTexture.image
            canvas.width = img.width;
            canvas.height = img.height

            // first draw the image
            ctx.drawImage(img, 0, 0)

            // set the mipmap image in the parent texture in the appropriate level
            parentTexture.mipmaps[level] = canvas
        },
        undefined, // onProgress callback currently not supported
        function (err) {
            console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
        }
    )
}

function createPolygon(stacks, slices, radius, centerColor, edgeColor) {
    const geometry = new THREE.BufferGeometry();

    const vertices = [0, 0, 0]
    const indices = []
    const colors = [centerColor.r, centerColor.g, centerColor.b, centerColor.a]
    printIndices(colors)

    //Rounding values to prevent potential end condition failures caused by floating-point errors.
    const inc = Number((2 * Math.PI / slices).toFixed(5))
    const init = Number((Math.PI / 2).toFixed(5))
    const end = Number((5 * Math.PI / 2).toFixed(5))

    for (let j = 0; j < stacks; j++) {
        const rad = radius * (j + 1) / stacks
        for (let i = init; i <= end; i += inc) {
            vertices.push(...[Math.cos(i) * rad, Math.sin(i) * rad, 0])
            const colorR = centerColor.r + ( rad/radius *(edgeColor.r - centerColor.r))
            const colorG = centerColor.g + ( rad/radius *(edgeColor.g - centerColor.g))
            const colorB = centerColor.b + ( rad/radius *(edgeColor.b - centerColor.b))
            const colorA = centerColor.a + ( rad/radius *(edgeColor.a - centerColor.a))
            colors.push(... [colorR, colorG, colorB, colorA])
        }
    }
    
    for (let j = 0; j < stacks; j++) {
        for (let i = 1; i <= slices; i++) {
            if (j === 0)
                indices.push(0, i, i % slices + 1)
            else {
                const i1 = j * slices + i
                const i2 = ((j - 1) * slices) + ((j - 1) * slices + i) % slices + 1
                const i3 = (j * slices) + (j * slices + i) % slices + 1

                // Define triangles formed by points:
                // 1. Point on the current stack.
                // 2. Point on the previous stack at the homologous position.
                // 3. Point on the previous stack at the next position.
                indices.push(i1, i2, i1 - slices)

                // Define triangles formed by points:
                // 1. Point on the current stack.
                // 2. Point in the next position on the current stack.
                // 3. Homologous point on the previous stack.
                indices.push(i1, i3, i2)
            }
        }
    }

    const normals = Array.from({length: stacks * slices + 1}, () => [...[0, 0, 1]]).flat()

    geometry.setIndex(indices)
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 4))
    return geometry
}

function printIndices(indices) {
    let str = ""
    for (let i = 0; i < indices.length; i += 4) {
        str += indices[i] + " " + indices[i + 1] + " " + indices[i + 2] + " " + indices[i + 3] + "\n"
    }
    console.log(str)

}

export {createThreeGeometry, applyTransformation, rgbToHex, createThreeLight, convertFilterThree, loadMipmap};