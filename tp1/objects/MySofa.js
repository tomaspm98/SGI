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

        const sofaArmTop1 = new THREE.Mesh(new THREE.CylinderGeometry(armWidth / 2, armWidth / 2, baseDepth + backDepth, 32, 1, false, Math.PI / 2, Math.PI), armMaterial);
        sofaArmTop1.position.y = (armHeight + baseHeight) / 2;
        sofaArmTop1.rotation.x = Math.PI / 2;
        sofaArm1.add(sofaArmTop1);
        
        const sofaArm2 = new THREE.Mesh(new THREE.BoxGeometry(armWidth, armHeight + baseHeight, baseDepth + backDepth), armMaterial);
        sofa.add(sofaArm2);
        sofaArm2.position.y = armHeight / 2;
        sofaArm2.position.x = -baseWidth / 2 - armWidth / 2;
        sofaArm2.position.z = -backDepth / 2;

        const sofaArmTop2 = new THREE.Mesh(new THREE.CylinderGeometry(armWidth / 2, armWidth / 2, baseDepth + backDepth, 32, 1, false, Math.PI / 2, Math.PI), armMaterial);
        sofaArmTop2.position.y = (armHeight + baseHeight) / 2;
        sofaArmTop2.rotation.x = Math.PI / 2;
        sofaArm2.add(sofaArmTop2);


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
        
        const sofaBack = armchair.children[3];
        
        const armchairBackTop = new THREE.Mesh(new THREE.CylinderGeometry(backDepth / 2, backDepth / 2, baseWidth, 32, 1, false, Math.PI / 2, Math.PI), backMaterial);
        armchairBackTop.rotation.z = Math.PI / 2;
        armchairBackTop.rotation.x = Math.PI / 2;
        armchairBackTop.position.y = (backHeight + baseHeight) / 2;
        sofaBack.add(armchairBackTop);

        
        const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 32), legMaterial);
        armchair.add(leg1);
        leg1.position.x = baseWidth / 2.5 + armWidth / 2.5;
        leg1.position.y = -baseHeight / 2.5 - legHeight / 2.5;
        leg1.position.z = -baseDepth / 2.5 - backDepth / 2.5;
        leg1.rotation.x = Math.PI / 8;
        leg1.rotation.z = Math.PI / 8;

        const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 32), legMaterial);
        armchair.add(leg2);
        leg2.position.x = -baseWidth / 2.5 - armWidth / 2.5;
        leg2.position.y = -baseHeight / 2.5 - legHeight / 2.5;
        leg2.position.z = -baseDepth / 2.5 - backDepth / 2.5;
        leg2.rotation.x = Math.PI / 8;
        leg2.rotation.z = -Math.PI / 8;

        const leg3 = new THREE.Mesh(new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 32), legMaterial);
        armchair.add(leg3);
        leg3.position.x = baseWidth / 2.5 + armWidth / 2.5;
        leg3.position.y = -baseHeight / 2.5 - legHeight / 2.5;
        leg3.position.z = baseDepth / 2.5 - backDepth / 2.5;
        leg3.rotation.x = -Math.PI / 8;
        leg3.rotation.z = Math.PI / 8;

        const leg4 = new THREE.Mesh(new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 32), legMaterial);
        armchair.add(leg4);
        leg4.position.x = - baseWidth / 2.5 - armWidth / 2.5;
        leg4.position.y = -baseHeight / 2.5 - legHeight / 2.5;
        leg4.position.z = baseDepth / 2.5 - backDepth / 2.5;
        leg4.rotation.x = -Math.PI / 8;
        leg4.rotation.z = -Math.PI / 8;

        return armchair;
    }
}

export { MySofa, MyArmchair };