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

    /**
     * Handles pointer events for raycasting.
     * @param {Event} event - The pointer event.
     */
    _handlePointerEvent(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.pickableObjects);

        if (intersects.length > 0) {
            const parent = this._getParent(intersects[0].object);
            this.pickingHandler(parent, event);
            
            if(!this.savePickedHelpers.includes(parent)) {
                this.lastPickedObject = parent
            }else{
                this.lastPickedObject = null
            }
            
        } else if (this.resetPickedObject && this.lastPickedObject) {
            this.resetPickedObject(this.lastPickedObject)
            this.lastPickedObject = null
        }
    }

    /**
     * Updates the camera used for raycasting.
     * @param {THREE.Camera} camera - The new camera.
     */
    updateCamera(camera) {
        this.camera = camera;
    }

    /**
     * Updates the layer for raycasting.
     * @param {number} layer - The layer index (0 to 31) or undefined for all layers.
     */
    updateLayer(layer) {
        if (layer === undefined || layer === null) {
            this.raycaster.layers.enableAll()
        } else if (layer < 0 || layer > 31) {
            throw new Error("Layer must be between 0 and 31");
        } else {
            this.raycaster.layers.set(layer)
        }
    }

    /**
     * Adds event listeners for picking.
     * @param {string[]} listeners - An array of event types to listen for.
     */
    addListeners(listeners) {
        for(const listener of listeners) {
            this.listeners.push({type: listener, handler: this._handlePointerEvent.bind(this)})
        }
    }
    
    /**
     * Starts listening for pointer events.
     */
    startListeners() {
        this.listeners.forEach(listener => {
            window.addEventListener(listener.type, listener.handler);
        });
    }
    
    /**
     * Stops listening for pointer events and resets the last picked object.
     */
    stopListeners() {
        // Before stopping, reset last picked object
        if (this.resetPickedObject && this.lastPickedObject) {
            this.resetPickedObject(this.lastPickedObject)
            this.lastPickedObject = null
        }
        
        this.clearPickedHelpers()
        
        this.listeners.forEach(listener => {
            window.removeEventListener(listener.type, listener.handler);
        });
    }

    /**
     * Adds a new object to the list of pickable objects.
     * @param {THREE.Object3D} object - The object to be added.
     */
    addPickableObject(object) {
        this.pickableObjects.push(object);
    }
    
    /**
     * Adds an object to the list of saved picked helpers.
     * @param {THREE.Object3D} object - The object to be added.
     */
    addPickedHelper(object) {
        this.savePickedHelpers.push(object);
    }
    
    /**
     * Removes an object from the list of saved picked helpers.
     * @param {THREE.Object3D} object - The object to be removed.
     */
    removePickedHelper(object) {
        const len = this.savePickedHelpers.length;
        this.savePickedHelpers = this.savePickedHelpers.filter(h => h !== object);
        if(this.savePickedHelpers.length !== len) {
            this.resetPickedObject(object);
        }
    }
    
    /**
     * Clears the list of saved picked helpers and resets them.
     */
    clearPickedHelpers() {
        this.savePickedHelpers.forEach((h) => {
            this.resetPickedObject(h)
        });
        this.savePickedHelpers = [];
    }

    /**
     * Retrieves the topmost parent in the hierarchy of an object that is pickable.
     * @param {THREE.Object3D} object - The child object.
     * @returns {THREE.Object3D} - The topmost parent pickable object.
     */
    _getParent(object) {
        let parent = object;
        while(!this.pickableObjects.includes(parent)) {
            parent = parent.parent;
        }
        return parent;
    }
}

export { MyPicking };