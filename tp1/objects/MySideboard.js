import * as THREE from 'three';

/**
 * A class representing a sideboard object.
 */
class MySideboard {

    /**
     * Builds a sideboard object with the given parameters.
     * @param {number} width - The width of the sideboard.
     * @param {number} height - The height of the sideboard.
     * @param {number} depth - The depth of the sideboard.
     * @param {THREE.Material} material - The material for the sideboard.
     * @returns {THREE.Mesh} The sideboard object.
     */
    build(width, height, depth, material) {
        const sideboard = new THREE.Mesh();

        // Create the borders of the sideboard
        const border1 = new THREE.Mesh(new THREE.BoxGeometry(0.5 * width, 0.1 * height, depth), material);
        border1.position.y = (0.9 * height) / 2;
        border1.position.x = -0.25 * width;
        sideboard.add(border1);

        const border2 = new THREE.Mesh(new THREE.BoxGeometry(width, 0.1 * height, depth), material);
        border2.position.y = - (0.9 * height) / 2;
        sideboard.add(border2);

        const border3 = new THREE.Mesh(new THREE.BoxGeometry(0.1 * height, 0.8 * height, depth), material);
        border3.position.x = -0.5 * width + 0.05 * height;
        sideboard.add(border3);

        const border4 = new THREE.Mesh(new THREE.BoxGeometry(0.1 * height, 0.8 * height, depth), material);
        border4.position.x = -0.05 * height;
        sideboard.add(border4);

        const border5 = new THREE.Mesh(new THREE.BoxGeometry(0.1 * height, 0.8 * height / 2, depth), material);
        border5.position.x = +0.5 * width - 0.05 * height;
        border5.position.y = -0.8 * height / 4;
        sideboard.add(border5);

        const border6 = new THREE.Mesh(new THREE.BoxGeometry(0.1 * height, 0.8 * height / 2, depth), material);
        border6.position.x = 0.05 * height;
        border6.position.y = -0.8 * height / 4;
        sideboard.add(border6);

        const border7 = new THREE.Mesh(new THREE.BoxGeometry(0.5 * width - 0.2 * height, 0.1 * height, depth), material);
        border7.position.x = -0.25 * width;
        sideboard.add(border7);

        // Create the glass material for the sideboard
        const glassMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            refractionRatio: 0.98,
            reflectivity: 0.9,
            transparent: true,
            opacity: 0.5,
            shininess: 1,
            specular: 0x222222,
        });

        // Create the glass border of the sideboard
        const border8 = new THREE.Mesh(new THREE.BoxGeometry(0.5 * width, 0.01 * height, depth), glassMaterial);
        border8.position.x = 0.25 * width;
        border8.position.y = 0.005 * height;
        sideboard.add(border8);

        // Enable shadows for all meshes
        sideboard.traverse((child) => {
            //ignore the galss material
            if (child.material === glassMaterial) {
                child.castShadow = false;
                child.receiveShadow = false; 
            }
            else if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        return sideboard;
    }
}

export { MySideboard };