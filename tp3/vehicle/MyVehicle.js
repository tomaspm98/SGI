import * as THREE from 'three';

class MyVehicle {
    constructor() {
        this.carMesh = null;
        this.speed = 0;
        this.rotationSpeed = 0;
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
                    this.speed = 0.1; // Increase speed forward
                    break;
                case 83: // S key
                    this.speed = -0.1; // Increase speed backward
                    break;
                case 65: // A key
                    this.rotationSpeed = 0.05; // Increase rotation speed left
                    break;
                case 68: // D key
                    this.rotationSpeed = -0.05; // Increase rotation speed right
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            const keyCode = event.keyCode;
            switch (keyCode) {
                case 87: // W key
                case 83: // S key
                    this.speed = 0; // Stop the car
                    break;
                case 65: // A key
                case 68: // D key
                    this.rotationSpeed = 0; // Stop rotating the car
                    break;
            }
        });
    }

    update() {
        this.carMesh.position.x += this.speed * Math.sin(this.carMesh.rotation.y);
        this.carMesh.position.z += this.speed * Math.cos(this.carMesh.rotation.y);
        this.carMesh.rotation.y += this.rotationSpeed;
    }
}

export { MyVehicle };