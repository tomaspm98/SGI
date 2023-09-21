import * as THREE from 'three';

class MyHouse {
    
    build(floorWidth, wallHeight, floorMaterial, wallMaterial){

        const houseMesh = new THREE.Mesh();

        const floor = new THREE.PlaneGeometry( floorWidth, floorWidth )
        const floorMesh = new THREE.Mesh( floor, floorMaterial )
        floorMesh.rotation.x = -Math.PI / 2

        const roofMesh = new THREE.Mesh( floor, wallMaterial) 
        roofMesh.position.z = wallHeight
        roofMesh.rotation.x = Math.PI
        floorMesh.add(roofMesh)

        const wall = new THREE.PlaneGeometry(floorWidth,wallHeight);
        
        const wallMesh1 = new THREE.Mesh(wall, wallMaterial);
        wallMesh1.rotation.x = Math.PI/2;
        wallMesh1.position.y= floorWidth/2;
        wallMesh1.position.z = wallHeight/2;
        floorMesh.add(wallMesh1);

        const wallMesh2 = new THREE.Mesh(wall, wallMaterial);
        wallMesh2.rotation.x = -Math.PI/2;
        wallMesh2.position.y= -floorWidth/2;
        wallMesh2.position.z = wallHeight/2;
        floorMesh.add(wallMesh2);

        const wallMesh3 = new THREE.Mesh(wall, wallMaterial);
        wallMesh3.rotation.x = Math.PI/2;
        wallMesh3.rotation.y = -Math.PI/2;
        wallMesh3.position.x = floorWidth/2;
        wallMesh3.position.z = wallHeight/2;
        floorMesh.add(wallMesh3);

        const wallMesh4 = new THREE.Mesh(wall, wallMaterial);
        wallMesh4.rotation.x = Math.PI/2;
        wallMesh4.rotation.y = Math.PI/2;
        wallMesh4.position.x = -floorWidth/2;
        wallMesh4.position.z = wallHeight/2;
        floorMesh.add(wallMesh4);

        houseMesh.add(floorMesh);

        return houseMesh;
    }

}

export { MyHouse };