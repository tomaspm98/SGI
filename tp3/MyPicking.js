import * as THREE from 'three';

class MyPicking {
    constructor(objects, near, far, camera, pickingHandler, resetPickedObject, listeners) {
        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = near;
        this.raycaster.far = far;

        this.pointer = new THREE.Vector2();

        this.pickableObjects = objects ? objects : [];
        this.updateLayer();

        this.pickingHandler = pickingHandler;
        this.resetPickedObject = resetPickedObject
        this.camera = camera;

        this.lastPickedObject = null
        this.savePickedHelpers = []
    
        this.listeners = []
        this.addListeners(listeners);
    }

    _handlePointerEvent(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.pickableObjects);

        if (intersects.length > 0) {
            this.pickingHandler(intersects[0].object, event);
            
            if(!this.savePickedHelpers.includes(intersects[0].object)) {
                this.lastPickedObject = intersects[0].object
            }else{
                this.lastPickedObject = null
            }
            
        } else if (this.resetPickedObject && this.lastPickedObject) {
            this.resetPickedObject(this.lastPickedObject)
            this.lastPickedObject = null
        }
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

    addListeners(listeners) {
        for(const listener of listeners) {
            this.listeners.push({type: listener, handler: this._handlePointerEvent.bind(this)})
        }
    }
    
    startListeners() {
        this.listeners.forEach(listener => {
            window.addEventListener(listener.type, listener.handler);
        });
    }
    
    stopListeners() {
        // Before stopping, reset last picked object
        if (this.resetPickedObject && this.lastPickedObject) {
            this.resetPickedObject(this.lastPickedObject)
            this.lastPickedObject = null
        }
        
        this.listeners.forEach(listener => {
            window.removeEventListener(listener.type, listener.handler);
        });
    }

    addPickableObject(object) {
        this.pickableObjects.push(object);
    }
    
    addPickedHelper(object) {
        this.savePickedHelpers.push(object);
    }
    
    removePickedHelper(object) {
        const len = this.savePickedHelpers.length;
        this.savePickedHelpers = this.savePickedHelpers.filter(h => h !== object);
        if(this.savePickedHelpers.length !== len) {
            this.resetPickedObject(object);
        }
    }
    
    clearPickedHelpers() {
        this.savePickedHelpers.forEach((h) => {
            this.resetPickedObject(h)
        });
        this.savePickedHelpers = [];
    }
}

export { MyPicking };