import * as THREE from 'three';

class Room {
    static #createFloor() {
        const geometry = new THREE.PlaneGeometry(20, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0xF0EEEA,
            roughness: 0.3,
            metalness: 0.05,
        });
        const floor = new THREE.Mesh(geometry, material);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(0, 0, 0);
        floor.receiveShadow = true;
        return floor;
    }

    static #createCeiling() {
        const geometry = new THREE.PlaneGeometry(20, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0xF5F5F5, roughness: 0.9 });
        const ceiling = new THREE.Mesh(geometry, material);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(0, 7, 0);
        ceiling.receiveShadow = true;
        return ceiling;
    }

    static #createBackWall() {
        // Parede branca por baixo da janela
        const botGeom = new THREE.PlaneGeometry(20, 2.5);
        const mat = new THREE.MeshStandardMaterial({ color: 0xF2F2F0, roughness: 0.85 });
        const bot = new THREE.Mesh(botGeom, mat);
        bot.position.set(0, 1.25, -8);
        bot.receiveShadow = true;

        // Parede branca por cima da janela
        const topGeom = new THREE.PlaneGeometry(20, 2.0);
        const top = new THREE.Mesh(topGeom, mat.clone());
        top.position.set(0, 6.0, -8);
        top.receiveShadow = true;

        // Lado esquerdo 
        const leftGeom = new THREE.PlaneGeometry(9, 2.5);
        const leftSide = new THREE.Mesh(leftGeom, mat.clone());
        leftSide.position.set(-5.5, 3.75, -8);
        leftSide.receiveShadow = true;

        // Lado direito 
        const rightGeom = new THREE.PlaneGeometry(2, 2.5);
        const rightSide = new THREE.Mesh(rightGeom, mat.clone());
        rightSide.position.set(9.0, 3.75, -8);
        rightSide.receiveShadow = true;

        const group = new THREE.Group();
        group.add(bot, top, leftSide, rightSide);
        return group;
    }


    static #createLeftWall() {
        const geometry = new THREE.PlaneGeometry(16, 7);
        const material = new THREE.MeshStandardMaterial({ color: 0xF2F2F0, roughness: 0.85 });
        const wall = new THREE.Mesh(geometry, material);
        wall.rotation.y = Math.PI / 2;
        wall.position.set(-10, 3.5, 0);
        wall.receiveShadow = true;
        return wall;
    }


    static #createRightWall() {
        const geometry = new THREE.PlaneGeometry(16, 7);
        const material = new THREE.MeshStandardMaterial({ color: 0x1A1A2E, roughness: 0.9 });
        const wall = new THREE.Mesh(geometry, material);
        wall.rotation.y = -Math.PI / 2;
        wall.position.set(10, 3.5, 0);
        wall.receiveShadow = true;


        const group = new THREE.Group();
        group.add(wall);
        return group;
    }

    static create() {
        const group = new THREE.Group();
        group.add(
            Room.#createFloor(),
            Room.#createCeiling(),
            Room.#createBackWall(),
            Room.#createLeftWall(),
            Room.#createRightWall(),
        );
        return group;
    }
}

export { Room };
