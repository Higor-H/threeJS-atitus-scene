import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


class AirConditionerGLTF {

    static create(path = 'src/World/assets/objects/indoor_air_conditioner_unit.glb') {
        const group = new THREE.Group();
        const loader = new GLTFLoader();

        loader.load(
            path,
            (gltf) => {
                const model = gltf.scene;

                const whiteMat = new THREE.MeshStandardMaterial({ color: 0xEDEBE4, roughness: 0.55, metalness: 0.05 });
                const darkMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7, metalness: 0.05 });

                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;

                        if (child.material?.map) {

                            child.material.metalnessMap = null;
                            child.material.roughnessMap = null;
                            child.material.metalness = 0.05;
                            child.material.roughness = 0.6;
                            child.material.needsUpdate = true;
                        } else {
                            const name = (child.name || '').toLowerCase();
                            child.material = (name.includes('grill') || name.includes('vent') || name.includes('grid'))
                                ? darkMat
                                : whiteMat;
                        }
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
                    console.log(`AirConditionerGLTF: ${(xhr.loaded / xhr.total * 100).toFixed(1)}% carregado`);
                }
            },
            (err) => {
                console.error('AirConditionerGLTF: erro ao carregar o modelo', err);
            }
        );

        return group;
    }
}

export { AirConditionerGLTF };
