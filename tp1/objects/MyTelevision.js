import * as THREE from 'three';

/**
 * A class representing a television object.
 */
class MyTelevision {

    /**
     * Builds a television object with the given parameters.
     * @param {number} height - The height of the television.
     * @param {number} width - The width of the television.
     * @param {number} depth - The depth of the television.
     * @param {number} border - The size of the border around the television screen.
     * @param {THREE.Material} video - The material for the television screen.
     * @param {THREE.Material} texture - The material for the television borders.
     * @returns {THREE.Mesh} The television object.
     */
    build(height, width, depth, border, video, texture) {
        const tvMesh = new THREE.Mesh();

        // Create the back plate of the television
        const backPlate = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth - border), texture);
        tvMesh.add(backPlate);

        // Create the television screen
        const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(width - border, height - border), video);
        tvScreen.position.z = depth - border - 0.01;
        tvMesh.add(tvScreen);

        // Create the borders of the television
        const border1 = new THREE.Mesh(new THREE.BoxGeometry(width, border, border), texture);
        border1.position.y = height / 2 - border / 2;
        border1.position.z = depth - border;
        tvMesh.add(border1);

        const border2 = border1.clone();
        border2.position.y = - height / 2 + border / 2;
        border2.position.z = depth - border;
        tvMesh.add(border2);

        const border3 = new THREE.Mesh(new THREE.BoxGeometry(border, height, border), texture);
        border3.geometry = new THREE.BoxGeometry(border, height, border);
        border3.position.x = width / 2 - border / 2;
        border3.position.z = depth - border;
        tvMesh.add(border3);

        const border4 = border3.clone();
        border4.position.x = - width / 2 + border / 2;
        border4.position.z = depth - border;
        tvMesh.add(border4);

        // Create the light for the television
        const light = new THREE.Mesh(new THREE.BoxGeometry(border, border, border), new THREE.MeshPhongMaterial({
            color: 0x5e0e00,
            specular: "#ff0000",
            shininess: 30,
        }));
        light.position.x = width / 2 - border * 2;
        light.position.y = -border;
        border2.add(light);

        // Enable shadows for all meshes
        tvMesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });

        return tvMesh;
    }
}

export { MyTelevision };