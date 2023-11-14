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
    }

    constructSceneGraph() {
        const root = this.nodes[this.root_id];
        this.graph = this.constructMeshGraph(root)
    }

    dfs(node, visited = [], materialId = undefined, castShadow = false, receiveShadow = false) {
        if (visited.hasOwnProperty(node.id)) {
            const objClone = visited[node.id].clone()
            objClone["isCloned"] = true
            return objClone
        }

        if (node.type === "spotlight" || node.type === "pointlight" || node.type === "directionallight") {
            if (node.enabled) {
                const light = Utils.createThreeLight(node)
                light.name = node.id
                visited[node.id] = light
                return light
            } else
                return
        }
        this.printDfsNode(node.id, visited, castShadow, receiveShadow)
        const sceneNode = new THREE.Group();

        if (node.children !== undefined) {
            for (let child of node.children) {
                if (child.type === "primitive") {
                    const geometry = Utils.createThreeGeometry(child);
                    let material;
                    if (node.materialIds.length > 0) {
                        material = this.materials[node.materialIds[0]]
                    } else if (materialId !== undefined) {
                        material = this.materials[materialId]
                    }
                    let mesh = new THREE.Mesh(geometry, material);
                    mesh.castShadow = castShadow
                    mesh.receiveShadow = receiveShadow
                    sceneNode.add(mesh);
                } else if (child.id !== undefined) {
                    const material = node.materialIds.length > 0 ? node.materialIds[0] : materialId
                    const childNode = this.dfs(child, visited, material, castShadow || child.castShadows, receiveShadow || child.receiveShadows)
                    if (childNode !== undefined)
                        sceneNode.add(childNode);
                }
            }
        }
        sceneNode.castShadow = castShadow
        sceneNode.receiveShadow = receiveShadow
        Utils.applyTransformation(sceneNode, node.transformations);
        sceneNode.name = node.id;
        visited[node.id] = sceneNode;
        return sceneNode;
    }

    constructMeshGraph(root) {
        const meshGraph = new THREE.Group()
        const stack = new Stack()
        stack.push({node: root, parent: meshGraph})
        while (!stack.isEmpty()) {
            const nodeStack = stack.pop()
            const node = nodeStack.node
            const parent = nodeStack.parent

            if (node.type === "spotlight" || node.type === "pointlight" || node.type === "directionallight") {
                if (node.enabled) {
                    const light = Utils.createThreeLight(node)
                    light.name = node.id
                    parent.add(light)
                }
            } else if (node.type === 'primitive') {
                parent.add(new THREE.Mesh(Utils.createThreeGeometry(node)))
            } else {
                const newSceneNode = new THREE.Group()
                Utils.applyTransformation(newSceneNode, node.transformations)
                parent.add(newSceneNode)
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({node: node.children[i], parent: newSceneNode});
                }
            }
        }
        return meshGraph
    }

    printDfsNode(node_id, visited, castShadow, receiveShadow) {
        console.log("-------------------")
        console.log("visiting node: " + node_id);
        console.log("visited: " + new Array(...visited).join(' '));
        console.log("CastShadow Object: " + this.nodes[node_id].castShadows);
        console.log("ReceiveShadow Object: " + this.nodes[node_id].receiveShadows);
        console.log("CastShadow inherited: " + castShadow);
        console.log("ReceiveShadow inherited: " + receiveShadow);
        try {
            console.log("children: " + this.nodes[node_id].children.map(child => child.id).join(' '))

        } catch (e) {

        }
    }
}

export {MySceneGraph}