import * as THREE from 'three';

class OrangeWindow {

    static create(renderer, scene) {
        const group = new THREE.Group();

        const winW  = 7.2;
        const winH  = 2.6;
        const t     = 0.1;
        const cols  = 4;
        const colW  = (winW - t * (cols + 1)) / cols;

        const frameMat = new THREE.MeshStandardMaterial({
            color: 0xF2F2F2,
            roughness: 0.45,
            metalness: 0.05,
        });

        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter,
        });
        const cubeCamera = new THREE.CubeCamera(0.1, 50, cubeRenderTarget);
        cubeCamera.position.set(0, 0, 0.1);
        group.add(cubeCamera);

        const glassMat = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            metalness: 1,
            roughness: 0,
            envMap: cubeRenderTarget.texture,
            envMapIntensity: 1,
        });

        const addBar = (w, h, x, y, z = 0.06) => {
            const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, t * 0.8), frameMat);
            m.position.set(x, y, z);
            m.castShadow = true;
            group.add(m);
        };

        addBar(winW + t * 2, t, 0,  winH / 2);   // topo
        addBar(winW + t * 2, t, 0, -winH / 2);   // base
        addBar(t, winH + t * 2, -winW / 2, 0);   // esquerda
        addBar(t, winH + t * 2,  winW / 2, 0);   // direita

        for (let i = 0; i < cols; i++) {
            const cx = -winW / 2 + t + colW / 2 + i * (colW + t);

            // Vidro reflexivo
            const glassGeo = new THREE.PlaneGeometry(colW, winH - t * 2);
            const glassMesh = new THREE.Mesh(glassGeo, glassMat);
            glassMesh.position.set(cx, 0, 0.02);
            group.add(glassMesh);

            if (i < cols - 1) {
                addBar(t, winH, cx + colW / 2 + t / 2, 0);
            }
        }

        const updateReflection = () => {
            glassMat.visible = false;    // evita auto-reflexo
            cubeCamera.update(renderer, scene);
            glassMat.visible = true;
        };

        return { group, winH, updateReflection };
    }
}

export { OrangeWindow };
