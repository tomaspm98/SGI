import * as THREE from 'three';

/**
 * A class representing a remote control object.
 */
class MyRemote {

    /**
     * Builds a remote control object with the given parameters.
     * @param {number} remoteWidth - The width of the remote.
     * @param {number} remoteHeight - The height of the remote.
     * @param {number} remoteDepth - The depth of the remote.
     * @param {THREE.Material} remoteMaterial - The material for the remote.
     * @param {number} buttonSize - The size of the buttons.
     * @param {THREE.Material} buttonMaterial - The material for the buttons.
     * @param {THREE.Material} powerMaterial - The material for the power button.
     * @returns {THREE.Mesh} The remote control object.
     */
    build(remoteWidth, remoteHeight, remoteDepth, remoteMaterial, buttonSize, buttonMaterial, powerMaterial) {
        const remote = new THREE.Mesh(new THREE.BoxGeometry(remoteWidth, remoteHeight, remoteDepth), remoteMaterial);

        // Create the power button mesh
        const powerButton = new THREE.Mesh(new THREE.CylinderGeometry(buttonSize / 2, buttonSize, remoteDepth / 3, 32), powerMaterial);
        powerButton.position.z = remoteDepth / 2;
        powerButton.position.y = remoteHeight / 2 - 0.25;
        powerButton.position.x = -remoteWidth / 2 + 0.25;
        powerButton.rotation.x = Math.PI / 2;
        remote.add(powerButton);

        // Create the normal buttons meshes
        const normalButton = new THREE.Mesh(new THREE.BoxGeometry(buttonSize, buttonSize, remoteDepth / 3), buttonMaterial);

        const normalButtonMesh1 = normalButton.clone();
        normalButtonMesh1.position.z = remoteDepth / 2;
        normalButtonMesh1.position.y = remoteHeight / 2 - 0.25;
        normalButtonMesh1.position.x = remoteWidth / 2 - 0.25;
        remote.add(normalButtonMesh1);

        const normalButtonMesh2 = normalButton.clone();
        normalButtonMesh2.position.z = remoteDepth / 2;
        normalButtonMesh2.position.y = remoteHeight / 3 - 0.375;
        normalButtonMesh2.position.x = -remoteWidth / 2 + 0.25;
        remote.add(normalButtonMesh2);

        const normalButtonMesh3 = normalButton.clone();
        normalButtonMesh3.position.z = remoteDepth / 2;
        normalButtonMesh3.position.y = remoteHeight / 3 - 0.375;
        remote.add(normalButtonMesh3);

        const normalButtonMesh4 = normalButton.clone();
        normalButtonMesh4.position.z = remoteDepth / 2;
        normalButtonMesh4.position.y = remoteHeight / 3 - 0.375;
        normalButtonMesh4.position.x = remoteWidth / 2 - 0.25;
        remote.add(normalButtonMesh4);

        const normalButtonMesh5 = normalButton.clone();
        normalButtonMesh5.position.z = remoteDepth / 2;
        normalButtonMesh5.position.x = -remoteWidth / 2 + 0.25;
        remote.add(normalButtonMesh5);

        const normalButtonMesh6 = normalButton.clone();
        normalButtonMesh6.position.z = remoteDepth / 2;
        remote.add(normalButtonMesh6);

        const normalButtonMesh7 = normalButton.clone();
        normalButtonMesh7.position.z = remoteDepth / 2;
        normalButtonMesh7.position.x = remoteWidth / 2 - 0.25;
        remote.add(normalButtonMesh7);

        const normalButtonMesh8 = normalButton.clone();
        normalButtonMesh8.position.z = remoteDepth / 2;
        normalButtonMesh8.position.y = -remoteHeight / 3 + 0.375;
        normalButtonMesh8.position.x = -remoteWidth / 2 + 0.25;
        remote.add(normalButtonMesh8);

        const normalButtonMesh9 = normalButton.clone();
        normalButtonMesh9.position.z = remoteDepth / 2;
        normalButtonMesh9.position.y = -remoteHeight / 3 + 0.375;
        remote.add(normalButtonMesh9);

        const normalButtonMesh10 = normalButton.clone();
        normalButtonMesh10.position.z = remoteDepth / 2;
        normalButtonMesh10.position.y = -remoteHeight / 3 + 0.375;
        normalButtonMesh10.position.x = remoteWidth / 2 - 0.25;
        remote.add(normalButtonMesh10);

        // Enable shadows for all meshes
        remote.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });

        return remote;
    }
}

export { MyRemote };