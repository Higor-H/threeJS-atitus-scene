import * as THREE from 'three';

class Window3D {
    static create() {
        const group = new THREE.Group();

        const frameMat = new THREE.MeshStandardMaterial({ color: 0xE8E8E8, roughness: 0.5 });
        const glassMat = new THREE.MeshStandardMaterial({
            color: 0x2A3A4A,
            roughness: 0.05,
            metalness: 0.1,
            transparent: true,
            opacity: 0.75,
        });

        // Moldura externa
        const frameThick = 0.12;
        const winW = 9;
        const winH = 2.5;

        // Painel de vidro
        const glassGeom = new THREE.PlaneGeometry(winW, winH);
        const glass = new THREE.Mesh(glassGeom, glassMat);
        glass.position.set(0, 0, 0.01);
        group.add(glass);

        // Barras da moldura
        const hBar = new THREE.BoxGeometry(winW + frameThick * 2, frameThick, frameThick);
        const vBar = new THREE.BoxGeometry(frameThick, winH + frameThick * 2, frameThick);
        const midBar = new THREE.BoxGeometry(winW + frameThick * 2, frameThick * 0.8, frameThick);

        const makeBar = (geom, x, y) => {
            const m = new THREE.Mesh(geom, frameMat);
            m.position.set(x, y, 0.02);
            m.castShadow = true;
            group.add(m);
        };

        makeBar(hBar, 0, winH / 2);  // topo
        makeBar(hBar, 0, -winH / 2);  // base
        makeBar(vBar, -winW / 2, 0);         // esquerda
        makeBar(vBar, winW / 2, 0);         // direita
        makeBar(midBar, 0, 0);          // divisória horizontal

        // Divisórias verticais (3 painéis)
        [-winW / 3, 0, winW / 3].forEach(x => {
            const vDiv = new THREE.BoxGeometry(frameThick * 0.6, winH, frameThick);
            const d = new THREE.Mesh(vDiv, frameMat);
            d.position.set(x, 0, 0.02);
            d.castShadow = true;
            group.add(d);
        });

        const blindH = winH * 0.95;
        const blindGeom = new THREE.PlaneGeometry(winW - 0.1, blindH);
        const blindMat = new THREE.MeshStandardMaterial({
            color: 0xDDDDDD,
            roughness: 0.9,
            side: THREE.DoubleSide,
        });
        const blind = new THREE.Mesh(blindGeom, blindMat);
        // z = 0.3 — mais à frente do vidro, no interior da sala
        // position.y inicial = completamente abaixada (será controlada pelo BlindAnimator)
        blind.position.set(0, winH / 2 - blindH / 2, 0.3);
        group.add(blind);

        // Trilho da cortina (fixo no topo)
        const railGeom = new THREE.BoxGeometry(winW + 0.2, 0.12, 0.1);
        const railMat = new THREE.MeshStandardMaterial({ color: 0xC0C0C0, metalness: 0.6, roughness: 0.3 });
        const rail = new THREE.Mesh(railGeom, railMat);
        rail.position.set(0, winH / 2 + 0.1, 0.07);
        group.add(rail);

        return { group, blind, winH };
    }
}

export { Window3D };
