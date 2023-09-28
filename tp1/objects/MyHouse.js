import * as THREE from 'three';

class MyHouse {
    
    //constructor
    constructor(floorWidth, wallHeight, floorMaterial, wallMaterial) {
        this.floorWidth = floorWidth;
        this.wallHeight = wallHeight;
        this.floorMaterial = floorMaterial;
        this.wallMaterial = wallMaterial;
        this.mesh = new THREE.Mesh();
        this.build()
    }

    build() {
        const floor = new THREE.PlaneGeometry(this.floorWidth, this.floorWidth)
        const floorMesh = new THREE.Mesh(floor, this.floorMaterial)
        floorMesh.rotation.x = -Math.PI / 2

        const roofMesh = new THREE.Mesh(floor, this.wallMaterial)
        roofMesh.position.z = this.wallHeight
        roofMesh.rotation.x = Math.PI
        floorMesh.add(roofMesh)

        const wall = new THREE.PlaneGeometry(this.floorWidth, this.wallHeight);

        const wallMesh1 = new THREE.Mesh(wall, this.wallMaterial);
        wallMesh1.rotation.x = Math.PI / 2;
        wallMesh1.position.y = this.floorWidth / 2;
        wallMesh1.position.z = this.wallHeight / 2;
        floorMesh.add(wallMesh1);

        const wallMesh2 = new THREE.Mesh(wall, this.wallMaterial);
        wallMesh2.rotation.x = -Math.PI / 2;
        wallMesh2.position.y = -this.floorWidth / 2;
        wallMesh2.position.z = this.wallHeight / 2;
        floorMesh.add(wallMesh2);

        const wallMesh3 = new THREE.Mesh(wall, this.wallMaterial);
        wallMesh3.rotation.x = Math.PI / 2;
        wallMesh3.rotation.y = -Math.PI / 2;
        wallMesh3.position.x = this.floorWidth / 2;
        wallMesh3.position.z = this.wallHeight / 2;
        floorMesh.add(wallMesh3);

        const wallMesh4 = new THREE.Mesh(wall, this.wallMaterial);
        wallMesh4.rotation.x = Math.PI / 2;
        wallMesh4.rotation.y = Math.PI / 2;
        wallMesh4.position.x = -this.floorWidth / 2;
        wallMesh4.position.z = this.wallHeight / 2;
        floorMesh.add(wallMesh4);

        this.mesh.add(floorMesh);
    }
    
    createLights(color = "0xffffff", itensity = 300, distance = 0, decay = 2){
        const pointLight = new THREE.PointLight(color, itensity, distance, decay);
        pointLight.position.set(-this.floorWidth / 4, this.wallHeight, 0);
        this.mesh.add(pointLight);
        
        const pointLight2 = new THREE.PointLight(0xffffff, 250, 0, 2);
        pointLight2.position.set(0, this.wallHeight, this.floorWidth / 4);
        this.mesh.add(pointLight2);
        
        const pointLight3 = new THREE.PointLight(0xffffff, 250, 0, 2);
        pointLight3.position.set(0, this.wallHeight, -this.floorWidth / 4);
        this.mesh.add(pointLight3);
        
        const pointLight4 = new THREE.PointLight(0xffffff, 250, 0, 2);
        pointLight4.position.set(this.floorWidth / 4, this.wallHeight, 0);
        this.mesh.add(pointLight4);

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        this.mesh.add(new THREE.PointLightHelper(pointLight, sphereSize));
        this.mesh.add(new THREE.PointLightHelper(pointLight2, sphereSize));
        this.mesh.add(new THREE.PointLightHelper(pointLight3, sphereSize));
        this.mesh.add(new THREE.PointLightHelper(pointLight4, sphereSize));
    }
}

export { MyHouse };