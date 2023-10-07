import * as THREE from 'three';

class MyBook {

    build(bookWidth, bookHeight, bookDepth, bookMaterial, coverWidth, coverHeight, coverDepth, coverMaterial) {
        const book = new THREE.Mesh()
        
        const pages = new THREE.BoxGeometry(bookWidth,bookHeight,bookDepth)
        const pagesMesh = new THREE.Mesh(pages,bookMaterial)
        pagesMesh.position.x =-(0.5*(coverWidth-bookWidth))

        const cover = new THREE.BoxGeometry(coverWidth,coverHeight,coverDepth)
        const coverMesh1 = new THREE.Mesh(cover,coverMaterial)

        coverMesh1.position.z = bookDepth/2

        const coverMesh2 = new THREE.Mesh(cover,coverMaterial)
        
        coverMesh2.position.z = -bookDepth/2

        const back = new THREE.BoxGeometry(bookDepth+coverDepth,coverHeight,coverDepth)
        
        const backMesh = new THREE.Mesh(back,coverMaterial)
        backMesh.rotation.y = Math.PI/2
        backMesh.position.x = - coverWidth/2
        
        book.add(coverMesh1)
        book.add(coverMesh2)
        book.add(backMesh)
        book.add(pagesMesh)
        

        return book

    }

}

export { MyBook };