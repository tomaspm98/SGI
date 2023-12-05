import * as THREE from 'three';

class MyVehicle {
    constructor() {
        this.carMesh = null;
        this.speed = 0;
        this.rotationspeed = 0;
        this.speedchange=0;
        this.rotationchange=0;
        this.maxSpeed=1;
        this.minSpeed=-0.5;
    }

    build(carMaterial, rectWidth, rectHeight) {
        const rectangle = new THREE.PlaneGeometry(rectWidth, rectHeight);
        this.carMesh = new THREE.Mesh(rectangle, carMaterial);
        this.carMesh.rotation.x = Math.PI / 2;

        return this.carMesh;
    }

    controlCar() {
        document.addEventListener('keydown', (event) => {
            const keyCode = event.keyCode;
            switch (keyCode) {
                case 87: // W key
                    this.speedchange = 0.01; // Increase speed forward
                    break;
                case 83: // S key
                    this.speedchange = -0.01; // Increase speed backward
                    break;
                case 68: // A key
                    this.rotationchange = 0.05; // Increase rotation speed left
                    break;
                case 65: // D key
                    this.rotationchange = -0.05; // Increase rotation speed right
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            // Reset speed and rotation change on key release
            this.speedchange = 0;
            this.rotationchange = 0;
        });
    }

    

    update() {
            this.controlCar();
            if (this.speed < this.maxSpeed && this.speed> this.minSpeed) {
                this.speed += this.speedchange;
            }
            else if (this.speed>=this.maxSpeed && this.speedchange<0){
                this.speed += this.speedchange;
            }
            else if (this.speed<=this.minSpeed && this.speedchange>0){
                this.speed += this.speedchange;

            }

            this.rotationspeed += this.rotationchange;
    
            this.carMesh.position.x += this.speed * Math.cos(this.carMesh.rotation.z);
            this.carMesh.position.z += this.speed * Math.sin(this.carMesh.rotation.z);
    
            this.carMesh.rotation.z += this.rotationspeed;
    
            this.rotationspeed = 0;
            console.log("SPEED",this.speed)
    }
}

export { MyVehicle };