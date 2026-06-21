import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class PlantGLTF {

    static create(path = 'src/World/assets/objects/potted_plant_mediterranean_med_leaf_low_poly.glb') {
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
                    }
                });

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
                    console.log(`PlantGLTF: ${(xhr.loaded / xhr.total * 100).toFixed(1)}% carregado`);
                }
            },
            (err) => {
                console.error('PlantGLTF: erro ao carregar o modelo', err);
            }
        );

        return group;
    }
}

export { PlantGLTF };
