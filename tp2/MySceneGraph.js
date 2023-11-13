import * as THREE from 'three';
import * as Utils from './utils.js'

class MySceneGraph {
    constructor(nodes, root_id, materials, textures) {
        this.graph = null;
        this.nodes = nodes;
        this.root_id = root_id;
        this.materials = materials;
        this.textures = textures;
    }

    constructSceneGraph() {
        this.graph = this.dfs(this.nodes[this.root_id]);
    }

    dfs(node, visited = [], materialId = undefined) {
        /*if (visited.hasOwnProperty(node.id)) {
            const objClone = visited[node.id].clone()
            objClone["isCloned"] = true
            return objClone
          }*/

        if (node.type === "spotlight" || node.type === "pointlight" || node.type === "directionallight") {
            if (node.enabled) {
                const light = Utils.createThreeLight(node)
                light.name = node.id
                visited[node.id] = light
                return light
            } else
                return
        }

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
                    sceneNode.add(mesh);

                } else if (child.id !== undefined) {
                    const material = node.materialIds.length > 0 ? node.materialIds[0] : materialId
                    const childNode = this.dfs(child, visited, material)
                    if (childNode !== undefined)
                        sceneNode.add(childNode);
                }
            }
        }
        
        Utils.applyTransformation(sceneNode, node.transformations);
        sceneNode.name = node.id;
        visited[node.id] = sceneNode;
        return sceneNode;
    }

    printDfsNode(node_id, visited) {
        console.log("-------------------")
        console.log("visiting node: " + node_id);
        console.log("visited: " + new Array(...visited).join(' '));
        try {
            console.log("children: " + this.nodes[node_id].children.map(child => child.id).join(' '))

        } catch (e) {

        }
    }
}

export {MySceneGraph}