import * as THREE from 'three';

class BenchPlatform {

    static #hexPrism(radius, height, mat) {
        const geo = new THREE.CylinderGeometry(radius, radius, height, 6, 1);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    static #box(w, h, d, mat) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    static create() {
        const group = new THREE.Group();

        const mat = new THREE.MeshStandardMaterial({
            color: 0xA0481A,
            roughness: 0.75,
            metalness: 0,
        });

        const hexR1 =  3;
        const hexR2 =  2.2;

        const h1    =  0.7;
        const h2    =  1.5;

        const armXStart = -6.5;
        const armXEnd   =  9;
        const armW      = armXEnd - armXStart;
        const armCX     = (armXStart + armXEnd) / 2;

        const hex1 = BenchPlatform.#hexPrism(hexR1, h1, mat);
        hex1.position.set(6, h1 / 2, -5);
        hex1.rotation.y = Math.PI / 6;
        group.add(hex1);

        const hexStep = h2 - h1;
        const hex2 = BenchPlatform.#hexPrism(hexR2, hexStep, mat);
        hex2.position.set(6, h1 + hexStep / 2, -5);
        hex2.rotation.y = Math.PI / 6;
        group.add(hex2);

        const arm1 = BenchPlatform.#box(armW, h1, 1, mat);
        arm1.position.set(armCX, h1 / 2, -5.5);
        group.add(arm1);

        const arm2 = BenchPlatform.#box(armW, h2, 1.8, mat);
        arm2.position.set(armCX, h2 / 2, -6.6);
        group.add(arm2);

        return group;
    }
}

export { BenchPlatform };
