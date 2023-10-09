import * as THREE from 'three';

class MyHouse {

    //constructor
    constructor(floorWidth, wallHeight, floorMaterial, wallMaterial, windowWidth = 0, windowHeight = 0) {
        this.floorWidth = floorWidth;
        this.wallHeight = wallHeight;
        this.floorMaterial = floorMaterial;
        this.wallMaterial = wallMaterial;
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        this.mesh = new THREE.Mesh();
        this.build()
    }

    build() {
        const floor = new THREE.PlaneGeometry(this.floorWidth, this.floorWidth)
        this.floorMesh = new THREE.Mesh(floor, this.floorMaterial)
        this.floorMesh.rotation.x = -Math.PI / 2

        const roofMesh = new THREE.Mesh(floor, this.wallMaterial)
        roofMesh.position.z = this.wallHeight
        roofMesh.rotation.x = Math.PI
        this.floorMesh.add(roofMesh)

        const wall = new THREE.PlaneGeometry(this.floorWidth, this.wallHeight);

        this.wallMesh1 = new THREE.Mesh(wall, this.wallMaterial);
        this.wallMesh1.rotation.x = Math.PI / 2;
        this.wallMesh1.position.y = this.floorWidth / 2;
        this.wallMesh1.position.z = this.wallHeight / 2;
        this.floorMesh.add(this.wallMesh1);

        this.wallMesh2 = new THREE.Mesh(wall, this.wallMaterial);
        this.wallMesh2.rotation.x = -Math.PI / 2;
        this.wallMesh2.position.y = -this.floorWidth / 2;
        this.wallMesh2.position.z = this.wallHeight / 2;
        this.floorMesh.add(this.wallMesh2);

        this.wallMesh4 = new THREE.Mesh(wall, this.wallMaterial);
        this.wallMesh4.rotation.x = Math.PI / 2;
        this.wallMesh4.rotation.y = Math.PI / 2;
        this.wallMesh4.position.x = -this.floorWidth / 2;
        this.wallMesh4.position.z = this.wallHeight / 2;
        this.floorMesh.add(this.wallMesh4);

        if (this.windowHeight === 0 || this.windowWidth === 0) {
            this.wallMesh3 = new THREE.Mesh(wall, this.wallMaterial);
            this.wallMesh3.rotation.x = Math.PI / 2;
            this.wallMesh3.rotation.y = -Math.PI / 2;
            this.wallMesh3.position.x = this.floorWidth / 2;
            this.wallMesh3.position.z = this.wallHeight / 2;
        } else {
            this.wallMesh3 = new THREE.Mesh();
            this.wallMesh3.rotation.x = Math.PI / 2;
            this.wallMesh3.rotation.y = -Math.PI / 2;
            this.wallMesh3.position.x = this.floorWidth / 2;
            this.wallMesh3.position.z = this.wallHeight / 2;

            const width1 = this.floorWidth
            const height1 = (this.wallHeight - this.windowHeight) / 2

            const width2 = (this.floorWidth - this.windowWidth) / 2

            const topGeometry = new THREE.PlaneGeometry(width1, height1);
            const sideGeometry = new THREE.PlaneGeometry(width2, this.windowHeight);
            const wallMesh31 = new THREE.Mesh(topGeometry, this.wallMaterial);
            const wallMesh32 = new THREE.Mesh(topGeometry, this.wallMaterial);
            const wallMesh33 = new THREE.Mesh(sideGeometry, this.wallMaterial);
            const wallMesh34 = new THREE.Mesh(sideGeometry, this.wallMaterial);
            wallMesh31.position.y = 13.25
            wallMesh32.position.y = -13.25
            wallMesh33.position.x = -35
            wallMesh34.position.x = 35
            
            this.wallMesh3.add(wallMesh31);
            this.wallMesh3.add(wallMesh32);
            this.wallMesh3.add(wallMesh33);
            this.wallMesh3.add(wallMesh34);
        }
        
        this.floorMesh.add(this.wallMesh3);
        this.mesh.add(this.floorMesh);
    }

    createLights(color = "#ffffff", itensity = 200, distance = 0, decay = 2) {
        const pointLight = new THREE.PointLight(color, itensity, distance, decay);
        pointLight.position.set(-this.floorWidth / 4, this.wallHeight, 0);
        this.mesh.add(pointLight);

        const pointLight2 = new THREE.PointLight(color, itensity, distance, decay);
        pointLight2.position.set(0, this.wallHeight, this.floorWidth / 4);
        this.mesh.add(pointLight2);

        const pointLight3 = new THREE.PointLight(color, itensity, distance, decay);
        pointLight3.position.set(0, this.wallHeight, -this.floorWidth / 4);
        this.mesh.add(pointLight3);

        const pointLight4 = new THREE.PointLight(color, itensity, distance, decay);
        pointLight4.position.set(this.floorWidth / 4, this.wallHeight, 0);
        this.mesh.add(pointLight4);

        const pointLight5 = new THREE.PointLight(color, itensity, distance, decay);
        pointLight5.position.set(this.floorWidth / 3, this.wallHeight, this.floorWidth / 3);
        this.mesh.add(pointLight5);

        const pointLight6 = new THREE.PointLight(color, itensity, distance, decay);
        pointLight6.position.set(this.floorWidth / 3, this.wallHeight, -this.floorWidth / 3)
        this.mesh.add(pointLight6);

        const pointLight7 = new THREE.PointLight(color, itensity, distance, decay);
        pointLight7.position.set(-this.floorWidth / 3, this.wallHeight, this.floorWidth / 3)
        this.mesh.add(pointLight7);

        const pointLight8 = new THREE.PointLight(color, itensity, distance, decay);
        pointLight8.position.set(-this.floorWidth / 3, this.wallHeight, -this.floorWidth / 3)
        this.mesh.add(pointLight8);

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        this.mesh.add(new THREE.PointLightHelper(pointLight, sphereSize));
        this.mesh.add(new THREE.PointLightHelper(pointLight2, sphereSize));
        this.mesh.add(new THREE.PointLightHelper(pointLight3, sphereSize));
        this.mesh.add(new THREE.PointLightHelper(pointLight4, sphereSize));
        this.mesh.add(new THREE.PointLightHelper(pointLight5, sphereSize));
        this.mesh.add(new THREE.PointLightHelper(pointLight6, sphereSize));
        this.mesh.add(new THREE.PointLightHelper(pointLight7, sphereSize));
        this.mesh.add(new THREE.PointLightHelper(pointLight8, sphereSize));
    }

    addObjectWall(numWall, object, x = 0, y = 0, z = 0.1, rotation = 0) {
        if (numWall === 1) {
            this.wallMesh1.add(object);
        } else if (numWall === 2) {
            this.wallMesh2.add(object);
            object.rotation.z = Math.PI;
        } else if (numWall === 3) {
            this.wallMesh3.add(object);
        } else if (numWall === 4) {
            this.wallMesh4.add(object);
        }

        object.position.set(x, y, z);
        object.rotation.y = rotation;
    }
}

export { MyHouse };