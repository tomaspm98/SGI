import * as THREE from 'three';
import { MyNurbsBuilder } from '../../utils/MyNurbsBuilder.js';
import { MyTriangle } from '../../utils/MyTriangle.js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MyObstacle1, MyObstacle2 } from '../MyObstacles.js';
import { MyPowerUp1 } from '../MyPowerUps.js';


function loadModel(filepath, parent) {
    const loader = new GLTFLoader();
    loader.load(filepath, function (gltf) {
        parent.add(gltf.scene)
        // If the model is loaded after the method updateInheritAttributesGraph
        // It is necessary to update the inherit attributes of the model
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = parent.castShadow
                child.receiveShadow = parent.receiveShadow
            }
        })
    }, undefined, function (error) {

    });
}

/**
 * Function to create a THREE.js geometry based on the provided primitive.
 * @param {Object} primitive - The primitive object containing the subtype and representations.
 * @returns {THREE.Geometry} - The created THREE.js geometry.
 */
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
            let length
            if (primitive.representations[0].degree_v > primitive.representations[0].degree_u) {
                length = (primitive.representations[0].degree_u + 1) * (primitive.representations[0].degree_v + 1) / Math.min(primitive.representations[0].degree_u + 1, primitive.representations[0].degree_v + 1)
            } else {
                length = (primitive.representations[0].degree_u + 1) * (primitive.representations[0].degree_v + 1) / Math.max(primitive.representations[0].degree_u + 1, primitive.representations[0].degree_v + 1)
            }
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
            console.error("Primitive not defined")
    }
}

/**
 * Function to create a THREE.js light based on the provided light object.
 * @param {Object} light - The light object containing the type and other properties.
 * @returns {THREE.Light} - The created THREE.js light.
 */
function createThreeLight(light) {
    switch (light.type) {
        case 'spotlight':
            const spotLight = new THREE.SpotLight(
                light.color,
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
                light.color,
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
                light.color,
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
            console.error("Type of light not defined")
            return
    }
}


/**
 * Function to apply transformations to a scene node.
 * @param {THREE.Group} sceneNode - The scene node to which transformations are to be applied.
 * @param {Array} transformations - The array of transformations to be applied.
 */
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
                const rotations = [transformation.rotation[0] + sceneNode.rotation.x, transformation.rotation[1] + sceneNode.rotation.y, transformation.rotation[2] + sceneNode.rotation.z]
                sceneNode.rotation.set(...rotations)
                break;
            default:
                break;
        }
    }
}


/**
 * Function to convert a filter to a THREE.js filter.
 * @param {string} filter - The filter to be converted.
 * @returns {Object} - The converted THREE.js filter.
 */
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

/**
 * Function to load a mipmap.
 * @param {THREE.Texture} parentTexture - The parent texture to which the mipmap is to be added.
 * @param {number} level - The level of the mipmap.
 * @param {string} path - The path to the mipmap image.
 */
function loadMipmap(parentTexture, level, path) {
    // Load texture. On loaded call the function to create the mipmap for the specified level 
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
        undefined, // onProgress callback currently isn't supported
        function (err) {
            console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
        }
    )
}

/**
 * Function to create a polygon.
 * @param {number} stacks - The number of stacks in the polygon.
 * @param {number} slices - The number of slices in the polygon.
 * @param {number} radius - The radius of the polygon.
 * @param {THREE.Color} centerColor - The color of the center of the polygon.
 * @param {THREE.Color} edgeColor - The color of the edge of the polygon.
 * @returns {THREE.BufferGeometry} - The created polygon geometry.
 */
function createPolygon(stacks, slices, radius, centerColor, edgeColor) {
    const geometry = new THREE.BufferGeometry();

    const vertices = [0, 0, 0]
    const indices = []
    const colors = [centerColor.r, centerColor.g, centerColor.b, centerColor.a]

    //Rounding values to prevent potential end condition failures caused by floating-point errors.
    const inc = Number((2 * Math.PI / slices).toFixed(5))
    const init = Number((Math.PI / 2).toFixed(5))
    const end = Number((5 * Math.PI / 2).toFixed(5))

    // For each stack, create a ring of vertices and the colors.
    for (let j = 0; j < stacks; j++) {
        const rad = radius * (j + 1) / stacks
        for (let i = init; i <= end; i += inc) {
            vertices.push(...[Math.cos(i) * rad, Math.sin(i) * rad, 0])
            const colorR = centerColor.r + (rad / radius * (edgeColor.r - centerColor.r))
            const colorG = centerColor.g + (rad / radius * (edgeColor.g - centerColor.g))
            const colorB = centerColor.b + (rad / radius * (edgeColor.b - centerColor.b))
            const colorA = centerColor.a + (rad / radius * (edgeColor.a - centerColor.a))
            colors.push(...[colorR, colorG, colorB, colorA])
        }
    }

    // For each stack, create the triangles.
    for (let j = 0; j < stacks; j++) {
        for (let i = 1; i <= slices; i++) {
            if (j === 0)
                // Define the triangles formed by the center and the first stack.
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

    // Assign normals to each vertex.
    // The normals are parallel to the z axis due to the polygon being defined within the XY plane.
    const normals = Array.from({ length: stacks * slices + 1 }, () => [...[0, 0, 1]]).flat()

    geometry.setIndex(indices)
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 4))
    return geometry
}

function createActivatable(type, subtype, position, duration, rotation = [0, 0, 0], scale = [1, 1, 1]) {
    if (type === 'obstacle') {
        if (subtype === '1') {
            return new MyObstacle1(position, rotation, scale, duration)
        } else if (subtype === '2') {
            return new MyObstacle2(position, rotation, scale, duration)
        } else {
            throw new Error('Invalid subtype of obstacle')
        }

    } else if (type === 'powerup') {
        if (subtype === '1') {
            return new MyPowerUp1(position, rotation, scale, duration)
        } else {
            throw new Error('Invalid subtype of powerUp')
        }
    } else {
        throw new Error('Invalid type of activatable')
    }
}

export { createThreeGeometry, applyTransformation, createThreeLight, convertFilterThree, loadMipmap, loadModel, createActivatable };