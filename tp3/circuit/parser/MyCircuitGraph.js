import * as THREE from 'three';
import * as Utils from './utils.js';
import { Stack } from "../../utils/Stack.js";

/**
 * Class representing a scene graph.
 */
class MyCircuitGraph {
    /**
     * Generates a scene graph based on a scene described in the YSF file.
     * @param {Object} nodes - Nodes in the YSF scene.
     * @param {string} root_id - Root ID of the scene.
     * @param {Object} materials - Materials used in the scene.
     * @param {Object} materialsDecl - Materials declaration in the XML file.
     */
    constructor(nodes, root_id, materials, materialsDecl) {
        this.graph = null;
        this.nodes = nodes;
        this.root_id = root_id;
        this.materials = materials;
        this.materialsDecl = materialsDecl;
        this.lightsMap = new Map();
        this.getWireframeValues();
    }

    /**
     * Gets the wireframe values present in the materials.
     * Needed to restore the polygonal mode.
     */
    getWireframeValues() {
        this.wireframeValues = [];
        for (let i in this.materials) {
            const material = this.materials[i];
            this.wireframeValues[material.name] = material.wireframe;
        }
    }

    /**
     * Gets the light map.
     * @returns {Map} - Lights map.
     */
    getLightMap() {
        return this.lightsMap;
    }

    /**
     * Constructs the scene graph.
     */
    constructSceneGraph() {
        // First construct the mesh graph taking advantage of cloning meshes and groups that are repeated
        this.graph = this.constructMeshGraph();
        // Then update the materials and the inherit attributes
        this.updateInheritAttributesGraph();
    }

    /**
     * Updates polygonal mode.
     * @param {string} type - Type of polygonal mode.
     */
    updatePolygonalMode(type) {
        // The original values are stored in the wireframeValues array
        switch (type) {
            case 'Default':
                for (const i in this.materials) {
                    this.materials[i].wireframe = this.wireframeValues[this.materials[i].name];
                }
                break;
            case 'Force Fill':
            case 'Force Wireframe':
                const forceWireFrame = type === 'Force Wireframe';
                for (const i in this.materials) {
                    this.materials[i].wireframe = forceWireFrame;
                }
                break;
            default:
                console.warn("Invalid polygonal mode");
                break;
        }
    }

    /**
     * Updates shadow mode.
     * @param {string} type - Type of shadow mode.
     */
    updateShadowMode(type) {
        switch (type) {
            case 'Default':
                // To restore the original values,
                // It's necessary to traverse the graph and update the inherited attributes
                this.updateInheritAttributesGraph();
                break;
            case 'Force Shadows On':
            case 'Force Shadows Off':
                const forceShadowsOn = type === 'Force Shadows On';
                // To force shadows on or off,
                // Traverse the graph and put the castShadow and receiveShadow attributes to the desired value
                this.graph.traverse(node => {
                    if (node.isMesh) {
                        node.castShadow = forceShadowsOn;
                        node.receiveShadow = forceShadowsOn;
                    }
                });
                break;
            default:
                console.warn("Invalid shadow mode");
                break;
        }
    }

    /**
     * Constructs the mesh graph.
     * Uses a stack to implement a depth-first search avoiding recursion.
     * @returns {THREE.Group} - Mesh graph.
     */
    constructMeshGraph() {
        const meshGraph = new THREE.Group();
        const stack = new Stack();
        stack.push({ node: this.nodes[this.root_id], parent: meshGraph });
        const visited = [];

        while (!stack.isEmpty()) {
            const nodeStack = stack.pop();
            const node = nodeStack.node;
            const parent = nodeStack.parent;

            if (node.type === 'primitive') {
                if (node.subtype === 'model3d') {
                    //  Special case for the 3d model
                    // To avoid using await and async, the model is added to the scene when loaded
                    Utils.loadModel(node.representations[0]["filepath"], parent);
                } else {
                    // Handle other primitives here
                    parent.add(new THREE.Mesh(Utils.createThreeGeometry(node)))
                }
            } else if (node.type === "spotlight" || node.type === "pointlight" || node.type === "directionallight") {
                const light = Utils.createThreeLight(node)
                light.name = node.id
                parent.add(light)
                this.lightsMap.set(node.id, light)
            } else if (visited.hasOwnProperty(node.id + node.type)) {
                const objCloned = visited[node.id + node.type].clone();
                objCloned["isCloned"] = true;
                parent.add(objCloned);
            } else {
                let newSceneNode = node.type === 'lod' ? new THREE.LOD() : new THREE.Group();
                newSceneNode.name = node.type === 'lodnoderef' ? 'lodnoderef' : node.id;

                if (node.type === 'lodnoderef') {
                    parent.addLevel(newSceneNode, node.mindist);
                    stack.push({ node: node.node, parent: newSceneNode });
                    continue;
                }

                parent.add(newSceneNode);

                if (node.type !== 'lod')
                    Utils.applyTransformation(newSceneNode, node.transformations);

                // Pushing children in reverse order to maintain the order in the scene
                // (the first child is the one that is drawn first)
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({ node: node.children[i], parent: newSceneNode });
                }

                //The key is the id + type to avoid collisions when the id is the same but the type is different
                visited[node.id + node.type] = newSceneNode;
            }
        }
        return meshGraph.children.length === 1 ? meshGraph.children[0] : meshGraph;
    }

    /**
     * Updates inherited attributes (materials, cast and receive shadow) in the scene graph.
     * Uses a stack to implement a depth-first search avoiding recursion.
     */
    updateInheritAttributesGraph() {
        const stack = new Stack();
        const rootNode = this.nodes[this.root_id];
        stack.push({
            node: rootNode,
            sceneNode: this.graph,
            castShadow: rootNode.castShadows,
            receiveShadow: rootNode.receiveShadows,
        });

        while (!stack.isEmpty()) {
            const element = stack.pop();
            const node = element.node;
            const sceneNode = element.sceneNode;

            if (node.type === "spotlight" || node.type === "pointlight" || node.type === "directionallight") {
                // Do nothing for lights
            } else if (node.type === 'lod') {
                // Handling LOD node types
                for (let i = node.children.length - 1; i >= 0; i--) {
                    // The material, castShadow and receiveShadow that are passed to the children are the ones of the parent
                    stack.push({
                        node: node.children[i],
                        sceneNode: sceneNode.children[i],
                        castShadow: element.castShadow,
                        receiveShadow: element.receiveShadow,
                        material: sceneNode.parent.material
                    });
                }
            } else if (node.type === 'lodnoderef') {
                // Handling LOD node reference types
                sceneNode.material = element.material;
                stack.push({
                    node: node.node,
                    sceneNode: sceneNode.children[0],
                    castShadow: element.castShadow,
                    receiveShadow: element.receiveShadow
                });
            } else {
                // Other node types
                const castShadow = element.castShadow || node.castShadows;
                const receiveShadow = element.receiveShadow || node.receiveShadows;

                // Case if the node is a 3D model
                // and yet has not been loaded
                if (!sceneNode) {
                    continue;
                }

                //Special case for the 3d model
                if (node.type === 'primitive' && node.subtype === 'model3d') {
                    sceneNode.traverse(child => {
                        if (child.isMesh) {
                            child.castShadow = castShadow;
                            child.receiveShadow = receiveShadow;
                        }
                    });
                    continue;
                }

                if (node.materialIds !== undefined && node.materialIds.length > 0) {
                    // If the node has a material, it is applied
                    sceneNode.material = this.materials[node.materialIds[0]];
                } else if (sceneNode.parent !== undefined) {
                    // If the node has no material, it inherits the material of the parent
                    sceneNode.material = sceneNode.parent.material;
                }

                sceneNode.castShadow = castShadow;
                sceneNode.receiveShadow = receiveShadow;

                if (node.type === 'primitive') {
                    // This should never happen! But to add some robustness, a default material will be applied
                    if (sceneNode.material === undefined) {
                        console.warn("WARNING! Primitive (" + node.subtype + ") with no material. Applying a default material.");
                        sceneNode.material = new THREE.MeshBasicMaterial({ color: 0x555555 });
                    }
                    if (node.subtype === 'polygon') {
                        // Needed to clone the material to be able to enable vertex colors
                        // and not affect the other primitives that use the same material
                        const newMaterial = sceneNode.material.clone();
                        newMaterial.vertexColors = true;
                        sceneNode.material = newMaterial;
                        // To be able to change the wireframe mode
                        this.materials[newMaterial.name + "vertexColors"] = newMaterial;
                    } else if (node.subtype === 'rectangle' && sceneNode.material.map &&
                        (this.materialsDecl[sceneNode.material.name].texlength_s !== 1 &&
                            this.materialsDecl[sceneNode.material.name].texlength_t !== 1)) {
                        this.applyTextLength(node, sceneNode)
                    }
                    continue; // Primitives don't have children
                }

                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({
                        node: node.children[i],
                        sceneNode: sceneNode.children[i],
                        castShadow: castShadow,
                        receiveShadow: receiveShadow,
                    });
                }
            }
        }
    }

    applyTextLength(node, sceneNode) {

        const point1 = node.representations[0]["xy1"];
        const point2 = node.representations[0]["xy2"];
        const width = point2[0] - point1[0]
        const height = point2[1] - point1[1]

        const textlength_s = this.materialsDecl[sceneNode.material.name].texlength_s
        const textlength_t = this.materialsDecl[sceneNode.material.name].texlength_t
        const nameMaterial = sceneNode.material.name + textlength_t + textlength_s

        if (this.materials.hasOwnProperty(nameMaterial)) {
            sceneNode.material = this.materials[nameMaterial]
            return
        }

        const newMaterial = sceneNode.material.clone();
        newMaterial.map = sceneNode.material.map.clone()
        newMaterial.map.repeat.set(width / textlength_s, height / textlength_t)
        newMaterial.map.wrapS = THREE.RepeatWrapping
        newMaterial.map.wrapT = THREE.RepeatWrapping

        if (newMaterial.bumpMap) {
            newMaterial.bumpMap = sceneNode.material.bumpMap.clone()
            newMaterial.bumpMap.repeat.set(width / textlength_s, height / textlength_t)
            newMaterial.bumpMap.wrapS = THREE.RepeatWrapping
            newMaterial.bumpMap.wrapT = THREE.RepeatWrapping
        }

        if (newMaterial.specularMap) {
            newMaterial.specularMap = sceneNode.material.specularMap.clone()
            newMaterial.specularMap.repeat.set(width / textlength_s, height / textlength_t)
            newMaterial.specularMap.wrapS = THREE.RepeatWrapping
            newMaterial.specularMap.wrapT = THREE.RepeatWrapping
        }

        newMaterial.name = nameMaterial
        sceneNode.material = newMaterial
        this.materials[nameMaterial] = newMaterial
    }

}

export { MyCircuitGraph };
