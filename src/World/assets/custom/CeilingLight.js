import * as THREE from 'three';


class CeilingLight {
    static create() {
        const group = new THREE.Group();

        const ductGeom = new THREE.BoxGeometry(0.52, 0.12, 4.5);
        const ductMat = new THREE.MeshStandardMaterial({ color: 0xCCCCCC, metalness: 0.3, roughness: 0.6 });
        const duct = new THREE.Mesh(ductGeom, ductMat);
        duct.position.set(0, -0.06, 0);
        group.add(duct);

        // luz
        const tubeGeom = new THREE.CylinderGeometry(0.135, 0.135, 3.8, 12);
        const tubeMat = new THREE.MeshStandardMaterial({
            color: 0xFFFFEE,
            emissive: 0xFFFFEE,
            emissiveIntensity: 1.5,
            roughness: 0.2,
        });
        const tube = new THREE.Mesh(tubeGeom, tubeMat);
        tube.rotation.x = Math.PI / 2;
        tube.position.set(0, -0.12, 0);
        group.add(tube);

        const numLights = 5;
        const tubeLength = 3.8;
        const usableLength = tubeLength - 0.6;
        const spacing = usableLength / (numLights - 1);


        //usando 5 luzes pontuais para simular a luz 
        for (let i = 0; i < numLights; i++) {
            const ptLight = new THREE.PointLight(0xFFF8E7, 3.0 / numLights * 1.5, 12, 1.5);

            const zPos = -(usableLength / 2) + (i * spacing);
            ptLight.position.set(0, -0.2, zPos);

            // Para evitar lentidão extrema (5 shadow maps), apenas a luz central projeta sombra
            if (i === Math.floor(numLights / 2)) {
                ptLight.castShadow = true;
                ptLight.shadow.mapSize.width = 512;
                ptLight.shadow.mapSize.height = 512;
            }

            group.add(ptLight);
        }

        return group;
    }
}

export { CeilingLight };
