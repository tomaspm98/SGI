import * as THREE from 'three';

class MySceneGraph{
    constructor(nodes, root_id, primitives, materials, lights, lights_enabled){
        this.sceneGraph = new THREE.Group();
        this.nodes = nodes;
        this.root_id = root_id;
        this.primitives = primitives;
        this.materials = materials;
        this.lights = lights;
        this.lights_enabled = lights_enabled;
    }

    getChildrenIds(node_id){
        return this.nodes[node_id].children.reduce((acc, child) => {
            acc.push(child.id);
            return acc;
        }, [])
    }

    dfs(node_id, visited){
        if(visited.isEmpty())
            visited = new Set();

        visited.add(node_id);

    }


}

export {MySceneGraph}