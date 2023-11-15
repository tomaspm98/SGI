import * as THREE from 'three';
import * as Utils from './utils.js'
import {Stack} from "./Stack.js"

class MySceneGraph {
    constructor(nodes, root_id, materials, textures) {
        this.graph = null;
        this.nodes = nodes;
        this.root_id = root_id;
        this.materials = materials;
        this.textures = textures;
        this.lightsMap = new Map();
    }

    getLightsMap() {
        return this.lightsMap;
    }

    constructSceneGraph() {
        this.graph = this.constructMeshGraph()
        this.updateInheritAttributesGraph()
    }

    constructMeshGraph() {
        const meshGraph = new THREE.Group()
        const stack = new Stack()
        stack.push({node: this.nodes[this.root_id], parent: meshGraph})
        const visited = []

        while (!stack.isEmpty()) {
            const nodeStack = stack.pop()
            const node = nodeStack.node
            const parent = nodeStack.parent

            if (node.type === 'primitive') {
                parent.add(new THREE.Mesh(Utils.createThreeGeometry(node)))
            } else if (node.type === "spotlight" || node.type === "pointlight" || node.type === "directionallight") {
                if (node.enabled) {
                    const light = Utils.createThreeLight(node)
                    light.name = node.id
                    parent.add(light)
                    this.lightsMap.set(node.id, light)
                }
            } else if (visited.hasOwnProperty(node.id + node.type)) {
                const objCloned = visited[node.id + node.type].clone()
                objCloned["isCloned"] = true
                parent.add(objCloned)
            } else {
                let newSceneNode = node.type === 'lod' ? new THREE.LOD() : new THREE.Group()
                newSceneNode.name = node.type === 'lodnoderef' ? 'lodnoderef' : node.id

                if (node.type === 'lodnoderef') {
                    parent.addLevel(newSceneNode, node.mindist)
                    stack.push({node: node.node, parent: newSceneNode})
                    continue
                }

                parent.add(newSceneNode)

                if (node.type !== 'lod')
                    Utils.applyTransformation(newSceneNode, node.transformations)

                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({node: node.children[i], parent: newSceneNode});
                }

                //The key is the id + type to avoid collisions when the id is the same but the type is different
                visited[node.id + node.type] = newSceneNode
            }
        }
        return meshGraph.children.length === 1 ? meshGraph.children[0] : meshGraph
    }

    updateInheritAttributesGraph() {
        const stack = new Stack()
        const rootNode = this.nodes[this.root_id]
        stack.push({
            node: rootNode,
            sceneNode: this.graph,
            castShadow: rootNode.castShadows,
            receiveShadow: rootNode.receiveShadows,
        })

        while (!stack.isEmpty()) {
            const element = stack.pop()
            const node = element.node
            const sceneNode = element.sceneNode
            
            

            if (node.type === "spotlight" || node.type === "pointlight" || node.type === "directionallight") {
                //do nothing
            } else if (node.type === 'lod') {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({
                        node: node.children[i],
                        sceneNode: sceneNode.children[i],
                        castShadow: element.castShadow,
                        receiveShadow: element.receiveShadow,
                        material: sceneNode.parent.material
                    });
                }
            } else if (node.type === 'lodnoderef') {
                sceneNode.material = element.material
                stack.push({
                    node: node.node,
                    sceneNode: sceneNode.children[0],
                    castShadow: element.castShadow,
                    receiveShadow: element.receiveShadow
                })
            } else {
                const castShadow = element.castShadow || node.castShadows
                const receiveShadow = element.receiveShadow || node.receiveShadows

                if (node.materialIds !== undefined && node.materialIds.length > 0) {
                    sceneNode.material = this.materials[node.materialIds[0]]
                } else if (sceneNode.parent !== undefined) {
                    sceneNode.material = sceneNode.parent.material
                }

                sceneNode.castShadow = castShadow
                sceneNode.receiveShadow = receiveShadow

                if (node.type === 'primitive') {
                    // This should never happen! But to add some robustness, a default material will be applied
                    if (sceneNode.material === undefined) {
                        console.warn("WARNING! Primitive ( " + node.subtype + " ) with no material. A default material will be applied.")
                        sceneNode.material = new THREE.MeshBasicMaterial({color: 0x555555})
                    }
                    continue // Primitives don't have children
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
}

export {MySceneGraph}