import * as THREE from 'three';

class MyPicking {
    constructor(objects, near, far, camera, pickingHandler, listeners) {
        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = near;
        this.raycaster.far = far;

        this.pointer = new THREE.Vector2();

        this.pickableObjects = objects ? objects : [];
        this.updateLayer();

        this.pickingHandler = pickingHandler;
        this.camera = camera;

        this._addListeners(listeners);
    }

    _handlePointerEvent(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.pickableObjects);

        this.pickingHandler(intersects, event);
    }

    updateCamera(camera) {
        this.camera = camera;
    }

    updateLayer(layer) {
        if (layer === undefined || layer === null) {
            this.raycaster.layers.enableAll()
        } else if (layer < 0 || layer > 31) {
            throw new Error("Layer must be between 0 and 31");
        } else {
            this.raycaster.layers.set(layer)
        }
    }

    _addListeners(listeners) {
        listeners.forEach(listener => {
            window.addEventListener(listener, this._handlePointerEvent.bind(this));
        });
    }

    addPickableObject(object) {
        this.pickableObjects.push(object);
    }

}

export { MyPicking };