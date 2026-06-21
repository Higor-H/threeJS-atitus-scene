import * as THREE from "three";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Camera } from './components/Camera.js';
import { Scene } from './components/Scene.js';
import { Light } from './components/Light.js';
import { Renderer } from './systems/Renderer.js';
import { Resizer } from './systems/Resizer.js';
import { FlyCamera } from './systems/FlyCamera.js';
import { BlindAnimator } from './systems/BlindAnimator.js';

import { Room } from './assets/custom/Room.js';
import { SofaGLTF } from './assets/custom/SofaGLTF.js';
import { Armchair } from './assets/custom/Armchair.js';
import { Window3D } from './assets/custom/Window3D.js';
import { AirConditionerGLTF } from './assets/custom/AirConditionerGLTF.js';
import { CeilingLight } from './assets/custom/CeilingLight.js';
import { PlantGLTF } from './assets/custom/PlantGLTF.js';


let camera;
let renderer;
let scene;
let controls;
let flyCamera;
let blindAnimator;
let clock;
let resizer;
let mainGroup;

class World {
  constructor(container) {


    camera = Camera.create();
    renderer = Renderer.create();
    container.append(renderer.domElement);
    resizer = new Resizer(container, camera, renderer);


    camera.position.set(-1, 2, 0);
    camera.far = 100;
    camera.updateProjectionMatrix();


    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2, -2);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.update();

    // Controle WSD
    flyCamera = new FlyCamera(camera, { speed: 0.12, orbitControls: controls });

    clock = new THREE.Clock();

    // --- Cena ---
    scene = Scene.create();
    Scene.setBackgroundColor(scene, 0xC8D0D8);

    mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Helpers desabilitados
    Scene.addGridHelper(scene, 30, 30).helper.visible = false;
    Scene.addAxesHelper(scene, 5).helper.visible = false;

    // --- Iluminação ---
    // Luz ambiente
    const ambientLight = Light.createAmbientLight(0xFFF8F0, 0.6);
    mainGroup.add(ambientLight);

    // Luz direcional (simula luz vinda da janela — necessária para materiais PBR)
    const windowLight = Light.createDirectionalLight(-2, 6, 4, 0xFFF5E0, 1.2);
    windowLight.shadow.mapSize.width = 1024;
    windowLight.shadow.mapSize.height = 1024;
    windowLight.shadow.camera.near = 0.5;
    windowLight.shadow.camera.far = 30;
    windowLight.shadow.camera.left = -12;
    windowLight.shadow.camera.right = 12;
    windowLight.shadow.camera.top = 10;
    windowLight.shadow.camera.bottom = -2;
    mainGroup.add(windowLight);



    const room = Room.create();
    mainGroup.add(room);

    // --- Janela (com cortina animável via Rapier) ---
    const { group: windowGroup, blind: windowBlind, winH } = Window3D.create();
    windowGroup.position.set(3.5, 3.75, -7.98);
    mainGroup.add(windowGroup);

    // Animação da cortina usando Rapier (corpo cinemático + função senoidal)
    blindAnimator = new BlindAnimator(windowBlind, {
      blindH: winH * 0.95,
      winH,
      speed: 0.4,   // rad/s — controla a velocidade do ciclo sobe/desce
    });



    const ac = AirConditionerGLTF.create();
    ac.scale.set(4, 4, 4);
    ac.rotation.y = 0;
    ac.position.set(3.5, 5.3, -7.7);
    mainGroup.add(ac);


    const ceilingLight = CeilingLight.create();
    ceilingLight.position.set(7.0, 6.88, -1.0);
    mainGroup.add(ceilingLight);


    const sofa = SofaGLTF.create();
    sofa.position.set(3.5, 0, -5.5);
    mainGroup.add(sofa);


    const armchair = Armchair.create();
    armchair.position.set(7.5, 0, -3.5);
    armchair.rotation.y = -Math.PI / 4;
    mainGroup.add(armchair);


    const plant = PlantGLTF.create();
    plant.scale.set(2, 2, 2);
    plant.position.set(8.8, 0, -7.0);
    mainGroup.add(plant);

  }

  render() {
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();   // segundos desde o último frame
      flyCamera.update();               // WASD move a câmera
      if (blindAnimator) blindAnimator.update(delta); // cortina sobe/desce (Rapier)
      controls.update();                // mouse olha ao redor (damping)
      renderer.render(scene, camera);
    });
  }
}

export { World };
