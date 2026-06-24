import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class TomadaGLTF {

    static create(path = 'src/World2/assets/objects/tomada.glb') {
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
                const cx = (box.min.x + box.max.x) / 2;
                const cy = box.min.y;
                const cz = (box.min.z + box.max.z) / 2;
                model.position.set(-cx, -cy, -cz);

                group.add(model);
                console.log('TomadaGLTF: modelo carregado com sucesso');
            },
            (xhr) => {
                if (xhr.total > 0) {
                    console.log(`TomadaGLTF: ${(xhr.loaded / xhr.total * 100).toFixed(1)}% carregado`);
                }
            },
            (err) => {
                console.error('TomadaGLTF: erro ao carregar o modelo', err);
            }
        );

        return group;
    }
}

export { TomadaGLTF };
