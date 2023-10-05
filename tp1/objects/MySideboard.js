import * as THREE from 'three';

class MySideboard {

    build(width, height, depth, material) {
        const sideboard = new THREE.Mesh()

        let border1 = new THREE.Mesh(new THREE.BoxGeometry(0.5 * width, 0.1 * height, depth), material);
        sideboard.add(border1);
        border1.position.y = (0.9 * height) / 2;
        border1.position.x = -0.25 * width;

        let border2 = new THREE.Mesh(new THREE.BoxGeometry(width, 0.1 * height, depth), material);
        sideboard.add(border2);
        border2.position.y = - (0.9 * height) / 2;

        let border3 = new THREE.Mesh(new THREE.BoxGeometry(0.1 * height, 0.8 * height, depth), material);
        sideboard.add(border3);
        border3.position.x = -0.5 * width + 0.05 * height;

        let border4 = new THREE.Mesh(new THREE.BoxGeometry(0.1 * height, 0.8 * height, depth), material);
        sideboard.add(border4);
        border4.position.x = -0.05 * height;

        let border5 = new THREE.Mesh(new THREE.BoxGeometry(0.1 * height, 0.8 * height / 2, depth), material);
        sideboard.add(border5);
        border5.position.x = +0.5 * width - 0.05 * height;
        border5.position.y = -0.8 * height / 4;

        let border6 = new THREE.Mesh(new THREE.BoxGeometry(0.1 * height, 0.8 * height / 2, depth), material);
        sideboard.add(border6);
        border6.position.x = 0.05 * height;
        border6.position.y = -0.8 * height / 4;

        let border7 = new THREE.Mesh(new THREE.BoxGeometry(0.5 * width - 0.2 * height, 0.1 * height, depth), material);
        sideboard.add(border7);
        border7.position.x = -0.25 * width;

        let glassMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff, // Neutral color for glass  // Add environment map for reflections
            refractionRatio: 0.98, // You can play with this value
            reflectivity: 0.9,  // Again, adjust to your liking
            transparent: true, // Make the material transparent
            opacity: 0.5,      // Adjust opacity to your liking
            shininess: 1,    // To give it a shiny effect
            specular: 0x222222,
            // map: this.chairTexture  // If you want a texture, but for clear glass, this is optional
        })

        let border8 = new THREE.Mesh(new THREE.BoxGeometry(0.5 * width, 0.01 * height, depth), glassMaterial);
        sideboard.add(border8);
        border8.position.x = 0.25 * width;
        border8.position.y = 0.005 * height;



        return sideboard
    }
}

export { MySideboard };
