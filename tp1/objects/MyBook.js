import * as THREE from 'three';

/**
 * A class representing a book object.
 */
class MyBook {

    /**
     * Builds a book object with the given parameters.
     * @param {number} bookWidth - The width of the book pages.
     * @param {number} bookHeight - The height of the book pages.
     * @param {number} bookDepth - The depth of the book pages.
     * @param {THREE.Material} bookMaterial - The material for the book pages.
     * @param {number} coverWidth - The width of the book cover.
     * @param {number} coverHeight - The height of the book cover.
     * @param {number} coverDepth - The depth of the book cover.
     * @param {THREE.Material} coverMaterial - The material for the book cover.
     * @returns {THREE.Mesh} The book object.
     */
    build(bookWidth, bookHeight, bookDepth, bookMaterial, coverWidth, coverHeight, coverDepth, coverMaterial) {
        const book = new THREE.Mesh();

        // Build the pages and add them to the book
        const pages = new THREE.BoxGeometry(bookWidth, bookHeight, bookDepth);
        const pagesMesh = new THREE.Mesh(pages, bookMaterial);
        pagesMesh.position.x = -(0.5 * (coverWidth - bookWidth));
        pagesMesh.castShadow = false;
        pagesMesh.receiveShadow = true;
        book.add(pagesMesh);

        // Build the front cover and add it to the book
        const cover = new THREE.BoxGeometry(coverWidth, coverHeight, coverDepth);
        const coverMesh1 = new THREE.Mesh(cover, coverMaterial);
        coverMesh1.position.z = bookDepth / 2;
        coverMesh1.castShadow = true;
        coverMesh1.receiveShadow = true;
        book.add(coverMesh1);

        // Build the back cover and add it to the book
        const coverMesh2 = new THREE.Mesh(cover, coverMaterial);
        coverMesh2.position.z = -bookDepth / 2;
        coverMesh2.castShadow = true;
        coverMesh2.receiveShadow = true;
        book.add(coverMesh2);

        // Build the spine and add it to the book
        const back = new THREE.BoxGeometry(bookDepth + coverDepth, coverHeight, coverDepth);
        const backMesh = new THREE.Mesh(back, coverMaterial);
        backMesh.rotation.y = Math.PI / 2;
        backMesh.position.x = -coverWidth / 2;
        backMesh.castShadow = true;
        backMesh.receiveShadow = true;
        book.add(backMesh);

        return book;
    }
}

export { MyBook };