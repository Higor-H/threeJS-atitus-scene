import * as THREE from 'three';


class Armchair {
    static create() {
        const mat = new THREE.MeshStandardMaterial({
            color: 0x5C3D2E,
            roughness: 0.85,
            metalness: 0.05,
        });

        const group = new THREE.Group();

        // Assento
        const seatGeom = new THREE.BoxGeometry(1.6, 0.4, 1.5);
        const seat = new THREE.Mesh(seatGeom, mat);
        seat.position.set(0, 0.55, 0);
        seat.castShadow = true;
        seat.receiveShadow = true;
        group.add(seat);

        // Encosto
        const backGeom = new THREE.BoxGeometry(1.6, 1.3, 0.3);
        const back = new THREE.Mesh(backGeom, mat);
        back.position.set(0, 1.3, -0.6);
        back.castShadow = true;
        back.receiveShadow = true;
        group.add(back);

        // Braços
        const armGeom = new THREE.BoxGeometry(0.3, 0.65, 1.5);
        const armMat = mat.clone();
        armMat.color.set(0x4A3020);

        const leftArm = new THREE.Mesh(armGeom, armMat);
        leftArm.position.set(-0.8, 0.85, 0);
        leftArm.castShadow = true;
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeom, armMat);
        rightArm.position.set(0.8, 0.85, 0);
        rightArm.castShadow = true;
        group.add(rightArm);

        // Pés
        const legGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x1A1A1A, metalness: 0.5, roughness: 0.5 });
        const legPositions = [[-0.65, 0.15, 0.55], [0.65, 0.15, 0.55], [-0.65, 0.15, -0.55], [0.65, 0.15, -0.55]];
        legPositions.forEach(([x, y, z]) => {
            const leg = new THREE.Mesh(legGeom, legMat);
            leg.position.set(x, y, z);
            leg.castShadow = true;
            group.add(leg);
        });

        return group;
    }
}

export { Armchair };
