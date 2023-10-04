import * as THREE from 'three';

class MyTelevision {
    build(height, width, depth, border, video, texture) {
        const tv = new THREE.Mesh();

        const backPlate = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth - border), texture);
        tv.add(backPlate);

        const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(width - border, height - border), video);
        //tvScreen.position.z = depth - border - 0.01;
        tvScreen.position.z = 0.5;
        tv.add(tvScreen);

        const border1 = new THREE.Mesh(new THREE.BoxGeometry(width, border, border), texture);
        border1.position.y = height / 2 - border / 2;
        border1.position.z = depth - border;
        tv.add(border1);

        const border2 = new THREE.Mesh(new THREE.BoxGeometry(width, border, border), texture);
        border2.position.y = - height / 2 + border / 2;
        border2.position.z = depth - border;
        tv.add(border2)

        const border3 = new THREE.Mesh(new THREE.BoxGeometry(border, height, border), texture);
        border3.position.x = width / 2 - border / 2;
        border3.position.z = depth - border;
        tv.add(border3);

        const border4 = new THREE.Mesh(new THREE.BoxGeometry(border, height, border), texture);
        border4.position.x = - width / 2 + border / 2;
        border4.position.z = depth - border;
        tv.add(border4);

        const light = new THREE.Mesh(new THREE.BoxGeometry(border, border, border), new THREE.MeshPhongMaterial({
            color: 0x5e0e00,
            specular: "#ff0000",
            shininess: 30,
        }));
        light.position.x = width / 2 - border * 2;
        light.position.y = -border;

        border2.add(light);
        return tv;


    }
} export { MyTelevision }
