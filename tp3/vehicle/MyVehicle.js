import * as THREE from 'three';
import { GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

class MyVehicle {
    constructor() {
        this.carMesh = null;
        this.speed = 0;
        this.rotationspeed = 0;
        this.speedchange=0;
        this.rotationchange=0;
        this.maxSpeed=0.5;
        this.minSpeed=-0.5;
        this.autoDecrease = 0.001;
        this.isLoaded=false;
    }

    build(scene) {
        /*const rectangle = new THREE.PlaneGeometry(rectWidth, rectHeight);
        this.carMesh = new THREE.Mesh(rectangle, carMaterial);
        this.carMesh.rotation.x = Math.PI / 2;

        return this.carMesh;*/

        return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();

        loader.load('vehicle/f1_car_low_poly/scene.gltf',  (gltf) => {
            this.carMesh = gltf.scene;
            console.log("car",this.carMesh);

            const geometry = new THREE.CylinderGeometry(1, 1, 0.75, 32)
            const texture = new THREE.TextureLoader().load('vehicle/tires_tex.png' ); 
            const material = new THREE.MeshPhongMaterial({ color:0x888888,  map: texture })
            const cylinderMesh1 = new THREE.Mesh(geometry, material)
            const cylinderMesh2 = new THREE.Mesh(geometry, material)
            const cylinderMesh3 = new THREE.Mesh(geometry, material)
            const cylinderMesh4 = new THREE.Mesh(geometry, material)

            //const axesHelper = new THREE.AxesHelper(30); // 5 is the size of the helper
            //this.carMesh.add(axesHelper);

            cylinderMesh1.rotation.z = Math.PI / 2
            cylinderMesh2.rotation.z = Math.PI / 2
            cylinderMesh3.rotation.z = Math.PI / 2
            cylinderMesh4.rotation.z = Math.PI / 2

            cylinderMesh1.position.x=-3.0
            cylinderMesh1.position.z=-2.75
            cylinderMesh1.rotation.order = 'YXZ';
            this.carMesh.add(cylinderMesh1)

            cylinderMesh2.position.x=3.0
            cylinderMesh2.position.z=-2.75
            cylinderMesh2.rotation.order = 'YXZ';
            this.carMesh.add(cylinderMesh2)

            cylinderMesh3.position.x=2.5
            cylinderMesh3.position.z=8.75
            cylinderMesh3.rotation.order = 'YXZ';
            this.carMesh.add(cylinderMesh3)

            cylinderMesh4.position.x=-2.5
            cylinderMesh4.position.z=8.75
            cylinderMesh4.rotation.order = 'YXZ';
            this.carMesh.add(cylinderMesh4)

            this.carMesh.scale.set(0.2,0.2,0.2);
            this.carMesh.rotation.y=Math.PI/2;

            scene.add(this.carMesh);
            resolve(this.carMesh);
            this.isLoaded=true;
        }, undefined, function (error) {
            console.log("error");
            console.error("error",error);
            reject(error);
        }
     );
    });
}

    controlCar() {
        document.addEventListener('keydown', (event) => {
            const keyCode = event.keyCode;
            if (keyCode == 87){
                this.speedchange = 0.001;
            }

            if (keyCode == 83){
                this.speedchange = -0.001;
            }

            if (keyCode == 68){
                this.rotationchange = -0.05;
                this.carMesh.children[4].rotation.y= -Math.PI/6;
                this.carMesh.children[5].rotation.y= -Math.PI/6;
            }

            if (keyCode == 65){
                this.rotationchange = 0.05;
                this.carMesh.children[4].rotation.y=Math.PI/6;
                this.carMesh.children[5].rotation.y=Math.PI/6;
            }

        });

        document.addEventListener('keyup', (event) => {
            if (event.keyCode == 87 && this.speed>0){
                this.speedchange = -this.autoDecrease;
                this.reducing = true;
                /*if (this.speed < 0){
                    this.speedchange = 0;
                    this.speed=0
                }*/
            } else if (event.keyCode == 83 && this.speed<0){
                this.speedchange = this.autoDecrease;
                this.increasing = true;
                /*if (this.speed == 0){
                    this.speedchange = 0;
                }*/
            }
            this.rotationchange = 0;
            
            if (event.keyCode == 68){
                this.carMesh.children[4].rotation.y=0;
                this.carMesh.children[5].rotation.y=0;
            }
            if (event.keyCode == 65){
                this.carMesh.children[4].rotation.y=0;
                this.carMesh.children[5].rotation.y=0;
            }
        });
    }

    

    update() {
        if(this.isLoaded){
            this.controlCar();
            if (this.speed < this.maxSpeed && this.speed> this.minSpeed) {
                this.speed += this.speedchange;
                if (this.reducing && this.speed<0){
                    this.speed=0
                    this.speedchange=0
                    this.reducing=false
                }

                if (this.increasing && this.speed>0){
                    this.speed=0
                    this.speedchange=0
                    this.increasing=false
                }
                console.log(this.speed)
            }
            else if (this.speed>=this.maxSpeed && this.speedchange<0){
                this.speed += this.speedchange;
            }
            else if (this.speed<=this.minSpeed && this.speedchange>0){
                this.speed += this.speedchange;
            }

            this.rotationspeed += this.rotationchange;
    
            this.carMesh.position.z += this.speed * Math.cos(this.carMesh.rotation.y);
            this.carMesh.position.x += this.speed * Math.sin(this.carMesh.rotation.y);

            //console.log(this.speed)
    
            this.carMesh.rotation.y += this.rotationspeed;
    
            this.rotationspeed = 0;

            this.carMesh.children[2].rotation.x += 2*this.speed;
            this.carMesh.children[3].rotation.x += 2*this.speed;
            this.carMesh.children[4].rotation.x += 2*this.speed;
            this.carMesh.children[5].rotation.x += 2*this.speed;

        }
    }
}

export { MyVehicle };