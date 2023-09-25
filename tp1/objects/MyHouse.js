import * as THREE from 'three';

class MyHouse {
    
    build(floorWidth, floorHeight, wallWidth, wallHeight, floorMaterial, wallMaterial){

        let houseMesh = new THREE.Mesh();

        let plane = new THREE.PlaneGeometry( floorWidth, floorHeight );
        this.planeMesh = new THREE.Mesh( plane, floorMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;

        let wall = new THREE.PlaneGeometry(wallWidth,wallHeight);
        this.wallMesh1 = new THREE.Mesh(wall, wallMaterial);
        this.wallMesh1.rotation.x = Math.PI/2;
        this.wallMesh1.position.y= wallWidth/2;
        this.wallMesh1.position.z = wallHeight/2;
        this.planeMesh.add(this.wallMesh1);

        this.wallMesh2 = new THREE.Mesh(wall, wallMaterial);
        this.wallMesh2.rotation.x = Math.PI/2;
        this.wallMesh2.position.y= -wallWidth/2;
        this.wallMesh2.position.z = wallHeight/2;
        this.planeMesh.add(this.wallMesh2);

        this.wallMesh3 = new THREE.Mesh(wall, wallMaterial);
        this.wallMesh3.rotation.x = Math.PI/2;
        this.wallMesh3.rotation.y = Math.PI/2;
        this.wallMesh3.position.x = wallWidth/2;
        this.wallMesh3.position.z = wallHeight/2;
        this.planeMesh.add(this.wallMesh3);

        this.wallMesh4 = new THREE.Mesh(wall, wallMaterial);
        this.wallMesh4.rotation.x = Math.PI/2;
        this.wallMesh4.rotation.y = Math.PI/2;
        this.wallMesh4.position.x = -wallWidth/2;
        this.wallMesh4.position.z = wallHeight/2;
        this.planeMesh.add(this.wallMesh4);

        houseMesh.add(this.planeMesh);

        return houseMesh;
    }

}

export { MyHouse };