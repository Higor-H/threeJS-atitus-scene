import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class PuffGLTF {

    /**
     * @param {string} path   - Caminho para o arquivo .glb
     * @param {number} targetSize - Tamanho máximo desejado (altura/diâmetro) em unidades da cena
     */
    static create(path = 'src/World2/assets/objects/puff.glb', targetSize = 0.75) {
        const group = new THREE.Group();
        const loader = new GLTFLoader();

        loader.load(
            path,
            (gltf) => {
                const model = gltf.scene;

                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (child.material) {
                            child.material.needsUpdate = true;
                        }
                    }
                });

                const box = new THREE.Box3().setFromObject(model);
                const size = new THREE.Vector3();
                box.getSize(size);
                const maxDim = Math.max(size.x, size.y, size.z);

                console.log(`PuffGLTF: tamanho original — x:${size.x.toFixed(3)} y:${size.y.toFixed(3)} z:${size.z.toFixed(3)}`);

                if (maxDim > 0) {
                    const s = targetSize / maxDim;
                    model.scale.setScalar(s);
                    console.log(`PuffGLTF: escala aplicada = ${s.toFixed(4)}`);
                }

                const box2 = new THREE.Box3().setFromObject(model);
                const cx = (box2.min.x + box2.max.x) / 2;
                const cy = box2.min.y;
                const cz = (box2.min.z + box2.max.z) / 2;
                model.position.set(-cx, -cy, -cz);

                group.add(model);
                console.log('PuffGLTF: carregado e adicionado à cena');
            },
            (xhr) => {
                if (xhr.total > 0) {
                    console.log(`PuffGLTF: ${(xhr.loaded / xhr.total * 100).toFixed(1)}% carregado`);
                }
            },
            (err) => {
                console.error('PuffGLTF: erro ao carregar o modelo', err);
            }
        );

        return group;
    }
}

export { PuffGLTF };
