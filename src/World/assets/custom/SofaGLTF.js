import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


class SofaGLTF {


    static #isFloorMesh(mesh) {
        const box = new THREE.Box3().setFromObject(mesh);
        const size = box.getSize(new THREE.Vector3());

        const flatRatioXZ = size.y / Math.max(size.x, size.z);


        const flatByShape = flatRatioXZ < 0.02;
        const flatByName = /floor|ground|plane|chao|piso/i.test(mesh.name);

        return flatByShape || flatByName;
    }

    static create(path = 'src/World/assets/objects/leather_black_sofa.glb') {
        const group = new THREE.Group();
        const loader = new GLTFLoader();

        loader.load(
            path,
            (gltf) => {
                const model = gltf.scene;

                const toRemove = [];
                model.traverse((child) => {
                    if (child.isMesh) {
                        if (SofaGLTF.#isFloorMesh(child)) {
                            toRemove.push(child);
                            console.log(`SofaGLTF: removendo mesh de chão "${child.name}"`);
                        } else {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    }
                });
                toRemove.forEach((m) => m.removeFromParent());

                const box = new THREE.Box3().setFromObject(model);
                const cx = (box.min.x + box.max.x) / 2;
                const cz = (box.min.z + box.max.z) / 2;
                model.position.x -= cx;
                model.position.z -= cz;
                model.position.y -= box.min.y;

                group.add(model);
            },
            (xhr) => {
                if (xhr.total > 0) {
                    console.log(`SofaGLTF: ${(xhr.loaded / xhr.total * 100).toFixed(1)}% carregado`);
                }
            },
            (err) => {
                console.error('SofaGLTF: erro ao carregar o modelo', err);
            }
        );

        return group;
    }
}

export { SofaGLTF };
