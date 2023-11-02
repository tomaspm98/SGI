import * as THREE from 'three';
import * as Utils from './utils.js'

class MySceneGraph {
    constructor(nodes, root_id, materials, lights, lights_enabled) {
        this.graph = new THREE.Group();
        this.nodes = nodes;
        this.root_id = root_id;
        this.materials = materials;
        this.lights = lights;
        this.lights_enabled = lights_enabled;
    }

    constructSceneGraph() {
        this.graph = this.dfs(this.nodes[this.root_id]);
    }

    dfs(node, visited = new Set()) {
        //this.printDfsNode(node.id, visited)
        visited.add(node.id);
        const sceneNode = new THREE.Group();

        if (this.lights.has(node.id) && this.lights_enabled.get(node.id)) {
            sceneNode.add(this.lights.get(node.id))
        }

        if (node.children !== undefined) {
            for (let child of node.children) {
                if (child.type === "primitive") {
                    const geometry = Utils.getThreeGeometry(child);
                    try{
                        sceneNode.add(new THREE.Mesh(geometry, this.materials.get(node.materialIds[0])))
                    }catch (Exception){
                        sceneNode.add(new THREE.Mesh(geometry))
                    }
                } else if (child.id !== undefined) {
                    sceneNode.add(this.dfs(child, visited))
                }
            }
        }

        Utils.applyTransformation(sceneNode, node.transformations);
        sceneNode.name = node.id;
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