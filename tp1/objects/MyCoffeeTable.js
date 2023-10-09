import * as THREE from 'three';

class MyCoffeeTable {

    build(tableRadius, tableHeight, tableMaterial, legRadius, legHeight, legMaterial, radialSegments = 32) {
        let coffeeTable = new THREE.Mesh();
        coffeeTable.add(new THREE.Mesh(new THREE.CylinderGeometry(tableRadius, tableRadius, tableHeight, radialSegments), tableMaterial));

        const coffeeTableLeg1 = new THREE.Mesh(new THREE.CylinderGeometry(legRadius, legRadius, legHeight, radialSegments), legMaterial);
        coffeeTable.add(coffeeTableLeg1);
        coffeeTableLeg1.position.x = tableRadius / 2;
        coffeeTableLeg1.rotation.z = Math.PI / 8;
        coffeeTableLeg1.position.y = -legHeight / 2 + tableHeight / 3.5;

        const coffeeTableLeg2 = new THREE.Mesh(new THREE.CylinderGeometry(legRadius, legRadius, legHeight, radialSegments), legMaterial);
        coffeeTable.add(coffeeTableLeg2);
        coffeeTableLeg2.position.x = -tableRadius / 2;
        coffeeTableLeg2.rotation.z = - Math.PI / 8;
        coffeeTableLeg2.position.y = -legHeight / 2 + tableHeight / 3.5;

        const coffeeTableLeg3 = new THREE.Mesh(new THREE.CylinderGeometry(legRadius, legRadius, legHeight, radialSegments), legMaterial);
        coffeeTable.add(coffeeTableLeg3);
        coffeeTableLeg3.position.y = -legHeight / 2 + tableHeight / 3.5;
        coffeeTableLeg3.position.z = tableRadius / 2;
        coffeeTableLeg3.rotation.x = - Math.PI / 8;

        const coffeeTableLeg4 = new THREE.Mesh(new THREE.CylinderGeometry(legRadius, legRadius, legHeight, radialSegments), legMaterial);
        coffeeTable.add(coffeeTableLeg4);
        coffeeTableLeg4.position.y = -legHeight / 2 + tableHeight / 3.5;
        coffeeTableLeg4.position.z = - tableRadius / 2;
        coffeeTableLeg4.rotation.x = Math.PI / 8;


        return coffeeTable;

    }

}

export { MyCoffeeTable };