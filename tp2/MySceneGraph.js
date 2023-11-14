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

            if (visited.hasOwnProperty(node.id)) {
                const objCloned = visited[node.id].clone()
                objCloned["isCloned"] = true
                parent.add(objCloned)
            } else if (node.type === "spotlight" || node.type === "pointlight" || node.type === "directionallight") {
                if (node.enabled) {
                    const light = Utils.createThreeLight(node)
                    light.name = node.id
                    parent.add(light)
                    visited[node.id] = light
                    this.lightsMap.set(node.id,light)
                }
            } else if (node.type === 'primitive') {
                parent.add(new THREE.Mesh(Utils.createThreeGeometry(node)))
            } else {
                const newSceneNode = new THREE.Group()
                newSceneNode.name = node.id
                Utils.applyTransformation(newSceneNode, node.transformations)
                parent.add(newSceneNode)
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({node: node.children[i], parent: newSceneNode});
                }
                visited[node.id] = newSceneNode
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
            
            if (node.type === "spotlight" || node.type === "pointlight" || node.type === "directionallight")
                continue
            
            const castShadow = element.castShadow || node.castShadows
            const receiveShadow = element.receiveShadow || node.receiveShadows

            if (node.materialIds !== undefined && node.materialIds.length > 0) {
                sceneNode.material = this.materials[node.materialIds[0]]
            } else if (sceneNode.parent.material !== undefined) {
                sceneNode.material = sceneNode.parent.material
            }

            sceneNode.castShadow = castShadow
            sceneNode.receiveShadow = receiveShadow

            if (node.children === undefined) continue

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

export {MySceneGraph}