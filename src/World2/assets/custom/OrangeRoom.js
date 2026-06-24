import * as THREE from 'three';
class OrangeRoom {

    static W  = 18;    // largura total
    static D  = 15;    // profundidade total
    static H  = 7.5;   // altura total
    static Z0 = -7;    // Z da parede de fundo
    static Z1 = 8;     // Z da parede frontal
    static ZC = 0.5;   // Z do centro (Z0 + D/2)

    static #createFloor() {
        const { W, D, Z0, ZC } = OrangeRoom;
        const group = new THREE.Group();

        const floorMat = new THREE.MeshStandardMaterial({
            color: 0xEEEEEE,
            roughness: 0.25,
            metalness: 0.08,
        });
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(0, 0, ZC);
        floor.receiveShadow = true;
        group.add(floor);

        const lineMat = new THREE.LineBasicMaterial({ color: 0xC8581A });
        const tile = 1.2;
        const x0 = -W / 2, x1 = W / 2;
        const z0 = Z0, z1 = Z0 + D;

        for (let x = x0; x <= x1 + 0.01; x += tile) {
            const pts = [new THREE.Vector3(x, 0.003, z0), new THREE.Vector3(x, 0.003, z1)];
            group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
        }
        for (let z = z0; z <= z1 + 0.01; z += tile) {
            const pts = [new THREE.Vector3(x0, 0.003, z), new THREE.Vector3(x1, 0.003, z)];
            group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
        }

        return group;
    }

    static #createCeiling() {
        const { W, D, H, Z0, ZC } = OrangeRoom;
        const group = new THREE.Group();

        const ceilMat = new THREE.MeshStandardMaterial({ color: 0xF8F8F8, roughness: 0.85 });
        const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), ceilMat);
        ceil.rotation.x = Math.PI / 2;
        ceil.position.set(0, H, ZC);
        ceil.receiveShadow = true;
        group.add(ceil);

        const sancaMat = new THREE.MeshStandardMaterial({ color: 0xE8E8E8, roughness: 0.7 });
        const sanca = new THREE.Mesh(new THREE.BoxGeometry(W, 0.14, 0.24), sancaMat);
        sanca.position.set(0, H - 0.07, Z0 + 0.15);
        group.add(sanca);

        const ledMat = new THREE.MeshStandardMaterial({
            color: 0xFFF5C0,
            emissive: 0xFFF5C0,
            emissiveIntensity: 3.8,
            roughness: 0.1,
            side: THREE.DoubleSide,
        });
        const led = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.5, 0.18), ledMat);
        led.rotation.x = Math.PI / 2;
        led.position.set(0, H - 0.01, Z0 + 0.14);
        group.add(led);

        const glowMat = new THREE.MeshStandardMaterial({
            color: 0xC8581A,
            emissive: 0xC8581A,
            emissiveIntensity: 0,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,
        });
        const glow = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.5, 4), glowMat);
        glow.rotation.x = Math.PI / 2;
        glow.position.set(0, H - 0.005, Z0 + 2.2);
        group.add(glow);

        [-6, -3, 0, 3, 6].forEach(x => {
            const pt = new THREE.PointLight(0xFFF8C0, 0.7, 7, 2);
            pt.position.set(x, H - 0.35, Z0 + 0.3);
            group.add(pt);
        });

        return group;
    }

    static #createBackWall() {
        const { W, H, Z0 } = OrangeRoom;
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0xC8581A, roughness: 0.82 });

        const wW = 7.2, wH = 2.6, wY = 3.8;
        const sideW = (W - wW) / 2;      // largura de cada lado lateral
        const botH  = wY - wH / 2;       // altura da faixa abaixo
        const topH  = H - (wY + wH / 2); // altura da faixa acima

        const bot = new THREE.Mesh(new THREE.PlaneGeometry(W, botH), mat);
        bot.position.set(0, botH / 2, Z0);
        group.add(bot);

        const top = new THREE.Mesh(new THREE.PlaneGeometry(W, topH), mat);
        top.position.set(0, wY + wH / 2 + topH / 2, Z0);
        group.add(top);

        const left = new THREE.Mesh(new THREE.PlaneGeometry(sideW, wH), mat);
        left.position.set(-wW / 2 - sideW / 2, wY, Z0);
        group.add(left);

        const right = new THREE.Mesh(new THREE.PlaneGeometry(sideW, wH), mat);
        right.position.set(wW / 2 + sideW / 2, wY, Z0);
        group.add(right);

        return group;
    }

    static #createLeftWall() {
        const { D, H, ZC } = OrangeRoom;
        const geo = new THREE.PlaneGeometry(D, H);
        // Branca conforme solicitado
        const mat = new THREE.MeshStandardMaterial({ color: 0xF5F5F5, roughness: 0.8 });
        const wall = new THREE.Mesh(geo, mat);
        wall.rotation.y = Math.PI / 2;
        wall.position.set(-9, H / 2, ZC);
        wall.receiveShadow = true;
        return wall;
    }

    static #createRightWall() {
        const { D, H, ZC } = OrangeRoom;
        const geo = new THREE.PlaneGeometry(D, H);
        const mat = new THREE.MeshStandardMaterial({ color: 0xC8581A, roughness: 0.82 });
        const wall = new THREE.Mesh(geo, mat);
        wall.rotation.y = -Math.PI / 2;
        wall.position.set(9, H / 2, ZC);
        wall.receiveShadow = true;
        return wall;
    }

    static #createFrontWall() {
        const { W, H, Z1 } = OrangeRoom;
        const geo = new THREE.PlaneGeometry(W, H);
        const mat = new THREE.MeshStandardMaterial({
            color: 0xC8581A, roughness: 0.82, side: THREE.BackSide,
        });
        const wall = new THREE.Mesh(geo, mat);
        wall.position.set(0, H / 2, Z1);
        wall.receiveShadow = true;
        return wall;
    }

    static create() {
        const group = new THREE.Group();
        group.add(
            OrangeRoom.#createFloor(),
            OrangeRoom.#createCeiling(),
            OrangeRoom.#createBackWall(),
            OrangeRoom.#createLeftWall(),
            OrangeRoom.#createRightWall(),
            OrangeRoom.#createFrontWall(),
        );
        return group;
    }
}

export { OrangeRoom };
