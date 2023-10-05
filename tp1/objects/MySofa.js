import * as THREE from 'three';

class MySofa {

    build(baseWidth, baseDepth, baseHeight, armWidth, armHeight, backHeight, backDepth, baseMaterial, armMaterial, backMaterial) {
        if (armMaterial === null) {
            armMaterial = baseMaterial;
        }
        if (backMaterial === null) {
            backMaterial = baseMaterial;
        }

        let sofa = new THREE.Mesh();
        sofa.add(new THREE.Mesh(new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth), baseMaterial));

        const sofaArm1 = new THREE.Mesh(new THREE.BoxGeometry(armWidth, armHeight + baseHeight, baseDepth + backDepth), armMaterial);
        sofa.add(sofaArm1);
        sofaArm1.position.y = armHeight / 2;
        sofaArm1.position.x = baseWidth / 2 + armWidth / 2;
        sofaArm1.position.z = -backDepth / 2;

        const sofaArm2 = new THREE.Mesh(new THREE.BoxGeometry(armWidth, armHeight + baseHeight, baseDepth + backDepth), armMaterial);
        sofa.add(sofaArm2);
        sofaArm2.position.y = armHeight / 2;
        sofaArm2.position.x = -baseWidth / 2 - armWidth / 2;
        sofaArm2.position.z = -backDepth / 2;

        const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(baseWidth, backHeight + baseHeight, backDepth), backMaterial);
        sofa.add(sofaBack);
        sofaBack.position.y = backHeight / 2;
        sofaBack.position.z = -baseDepth / 2 - backDepth / 2;



        return sofa;
    }

}

class MyArmchair {

    build(baseWidth, baseDepth, baseHeight, armWidth, armHeight, backHeight, backDepth, legHeight, legRadius, legMaterial, baseMaterial, armMaterial, backMaterial) {
        const armchair = new MySofa().build(baseWidth, baseDepth, baseHeight, armWidth, armHeight, backHeight, backDepth, baseMaterial, armMaterial, backMaterial);
        const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 32), legMaterial);
        armchair.add(leg1);
        leg1.position.x = baseWidth / 2.5 + armWidth / 2.5;
        leg1.position.y = -baseHeight / 2.5 - legHeight / 2.5;
        leg1.position.z = -baseDepth / 2.5 - backDepth / 2.5;

        const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 32), legMaterial);
        armchair.add(leg2);
        leg2.position.x = -baseWidth / 2.5 - armWidth / 2.5;
        leg2.position.y = -baseHeight / 2.5 - legHeight / 2.5;
        leg2.position.z = -baseDepth / 2.5 - backDepth / 2.5;

        const leg3 = new THREE.Mesh(new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 32), legMaterial);
        armchair.add(leg3);
        leg3.position.x = baseWidth / 2.5 + armWidth / 2.5;
        leg3.position.y = -baseHeight / 2.5 - legHeight / 2.5;
        leg3.position.z = baseDepth / 2.5 - backDepth / 2.5;

        const leg4 = new THREE.Mesh(new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 32), legMaterial);
        armchair.add(leg4);
        leg4.position.x = - baseWidth / 2.5 - armWidth / 2.5;
        leg4.position.y = -baseHeight / 2.5 - legHeight / 2.5;
        leg4.position.z = baseDepth / 2.5 - backDepth / 2.5;

        return armchair;
    }
}

export { MySofa, MyArmchair };