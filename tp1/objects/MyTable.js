import * as THREE from 'three';

class MyTable {

    build(tableWidth, tableHeight, tableLength, tableMaterial, legRadius, legHeight, legMaterial) {

        

        const tableMesh = new THREE.Mesh()

        const tableTop = new THREE.BoxGeometry(tableHeight, tableLength, tableWidth);
        const tableTopMesh = new THREE.Mesh(tableTop, tableMaterial);
        tableTopMesh.rotation.z = -Math.PI / 2;
        
        const tableLeg = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 20)

        const tableLegMesh1 = new THREE.Mesh(tableLeg, legMaterial);
        const tableLegMesh2 = new THREE.Mesh(tableLeg, legMaterial);
        const tableLegMesh3 = new THREE.Mesh(tableLeg, legMaterial);
        const tableLegMesh4 = new THREE.Mesh(tableLeg, legMaterial);

        const slack = tableLength / 12

        tableLegMesh1.rotation.z = -Math.PI / 2
        tableLegMesh1.position.x = legHeight / 2
        tableLegMesh1.position.y = -tableLength / 2 + slack
        tableLegMesh1.position.z = -tableWidth / 2 + slack

        tableLegMesh2.rotation.z = -Math.PI / 2
        tableLegMesh2.position.x = legHeight / 2
        tableLegMesh2.position.y = -tableLength / 2 + slack
        tableLegMesh2.position.z = tableWidth / 2 - slack

        tableLegMesh3.rotation.z = -Math.PI / 2
        tableLegMesh3.position.x = legHeight / 2
        tableLegMesh3.position.y = tableLength / 2 - slack
        tableLegMesh3.position.z = -tableWidth / 2 + slack

        tableLegMesh4.rotation.z = -Math.PI / 2
        tableLegMesh4.position.x = legHeight / 2
        tableLegMesh4.position.y = tableLength / 2 - slack
        tableLegMesh4.position.z = tableWidth / 2 - slack

        tableTopMesh.add(tableLegMesh1);
        tableTopMesh.add(tableLegMesh2);
        tableTopMesh.add(tableLegMesh3);
        tableTopMesh.add(tableLegMesh4);
        tableMesh.add(tableTopMesh);
        tableMesh.position.y=legHeight;

        return tableMesh

    }

}

export { MyTable };