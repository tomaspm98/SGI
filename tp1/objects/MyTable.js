import * as THREE from 'three';

class MyTable {

    build(tableWidth, tableHeight, tableLength, tableMaterial, legMaterial) {

        

        const tableMesh = new THREE.Mesh()

        const tableTop = new THREE.BoxGeometry(tableHeight, tableLength, tableWidth);
        const tableTopMesh = new THREE.Mesh(tableTop, tableMaterial);
        tableTopMesh.rotation.z = -Math.PI / 2;

        const tableLegHeight = tableLength / 2
        const tableLegRadius = tableLength / 35

        const tableLeg = new THREE.CylinderGeometry(tableLegRadius, tableLegRadius, tableLegHeight, 20)

        const tableLegMesh1 = new THREE.Mesh(tableLeg, legMaterial);
        const tableLegMesh2 = new THREE.Mesh(tableLeg, legMaterial);
        const tableLegMesh3 = new THREE.Mesh(tableLeg, legMaterial);
        const tableLegMesh4 = new THREE.Mesh(tableLeg, legMaterial);

        const slack = tableLength / 12

        tableLegMesh1.rotation.z = -Math.PI / 2
        tableLegMesh1.position.x = tableLegHeight / 2
        tableLegMesh1.position.y = -tableLength / 2 + slack
        tableLegMesh1.position.z = -tableWidth / 2 + slack

        tableLegMesh2.rotation.z = -Math.PI / 2
        tableLegMesh2.position.x = tableLegHeight / 2
        tableLegMesh2.position.y = -tableLength / 2 + slack
        tableLegMesh2.position.z = tableWidth / 2 - slack

        tableLegMesh3.rotation.z = -Math.PI / 2
        tableLegMesh3.position.x = tableLegHeight / 2
        tableLegMesh3.position.y = tableLength / 2 - slack
        tableLegMesh3.position.z = -tableWidth / 2 + slack

        tableLegMesh4.rotation.z = -Math.PI / 2
        tableLegMesh4.position.x = tableLegHeight / 2
        tableLegMesh4.position.y = tableLength / 2 - slack
        tableLegMesh4.position.z = tableWidth / 2 - slack

        tableTopMesh.add(tableLegMesh1);
        tableTopMesh.add(tableLegMesh2);
        tableTopMesh.add(tableLegMesh3);
        tableTopMesh.add(tableLegMesh4);
        tableMesh.add(tableTopMesh);
        tableMesh.position.y=tableLegHeight;

        return tableMesh

    }

}

export { MyTable };