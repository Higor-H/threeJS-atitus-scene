import * as THREE from "three";
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Camera }   from './components/Camera.js';
import { Renderer } from './systems/Renderer.js';
import { FlyCamera } from './systems/FlyCamera.js';
import { Scene }    from './components/Scene.js';
import { Light }    from './components/Light.js';

import { OrangeRoom }     from './assets/custom/OrangeRoom.js';
import { OrangeWindow }   from './assets/custom/OrangeWindow.js';
import { BenchPlatform }  from './assets/custom/BenchPlatform.js';
import { PuffGLTF }       from './assets/custom/PuffGLTF.js';
import { TomadaGLTF }    from './assets/custom/TomadaGLTF.js';
import { WallText }      from './assets/custom/WallText.js';

// Inicializa suporte a RectAreaLight
RectAreaLightUniformsLib.init();

let camera, renderer, scene, controls, flyCamera, clock, updateWindowReflection;

class World2 {
  constructor(container) {

    camera = Camera.create();
    renderer = Renderer.create();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.append(renderer.domElement);

    camera.position.set(0, 2.8, 10);
    camera.far = 80;
    camera.updateProjectionMatrix();

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2.5, -3);
    controls.enableDamping  = true;
    controls.dampingFactor  = 0.06;
    controls.minDistance    = 1.5;
    controls.maxDistance    = 18;
    controls.update();

    flyCamera = new FlyCamera(camera, { speed: 0.12, orbitControls: controls });
    clock = new THREE.Clock();

    scene = Scene.create();
    scene.background = new THREE.Color(0x1A1A1A);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // == Luz =========================
    const ambient = Light.createAmbientLight(0xFFE8D0, 0.45);
    mainGroup.add(ambient);

    const winLight = new THREE.DirectionalLight(0xB0C8E8, 0.5);
    winLight.position.set(0, 6, -10);
    winLight.castShadow = true;
    winLight.shadow.mapSize.set(1024, 1024);
    winLight.shadow.camera.left   = -10;
    winLight.shadow.camera.right  =  10;
    winLight.shadow.camera.top    =  8;
    winLight.shadow.camera.bottom = -1;
    winLight.shadow.camera.far    = 30;
    mainGroup.add(winLight);

    const ledFill = new THREE.PointLight(0xFFE0A0, 1.8, 18, 1.5);
    ledFill.position.set(0, 7.2, -5.5);
    mainGroup.add(ledFill);

    const floorBounce = new THREE.PointLight(0xFFFFFF, 0.25, 14, 2);
    floorBounce.position.set(0, 0.5, 0);
    mainGroup.add(floorBounce);

    // == Sala  =======================================
    const room = OrangeRoom.create();
    mainGroup.add(room);

    // == Janela ========================================
    const { group: winGroup, updateReflection } = OrangeWindow.create(renderer, scene);
    winGroup.position.set(0, 3.8, -6.99);
    mainGroup.add(winGroup);
    updateWindowReflection = updateReflection;

    // == Banco ============================
    const bench = BenchPlatform.create();
    mainGroup.add(bench);

    // ==  ATITUS  ============================
    const wallText = WallText.create(8);
    mainGroup.add(wallText);

    // == Puff  =========================
    const puff = PuffGLTF.create();
    puff.position.set(-2.2, 0, -1.8);
    mainGroup.add(puff);



    // == 2 Tomadas no degrau de cima do banco ===========================

    const benchTopZ  = -5.7;
    const benchTopY  =  0.8;

    const tomadaBench1 = TomadaGLTF.create();
    tomadaBench1.position.set(-3, benchTopY, benchTopZ);
    tomadaBench1.rotation.y = 0;
    mainGroup.add(tomadaBench1);

    const tomadaBench2 = TomadaGLTF.create();
    tomadaBench2.position.set( 3, benchTopY, benchTopZ);
    tomadaBench2.rotation.y = 0;
    mainGroup.add(tomadaBench2);

    const grid = new THREE.GridHelper(20, 20, 0x444444, 0x444444);
    grid.visible = false;
    scene.add(grid);

    const axes = new THREE.AxesHelper(4);
    axes.visible = false;
    scene.add(axes);
  }

  render() {
    renderer.setAnimationLoop(() => {
      flyCamera.update();
      if (updateWindowReflection) updateWindowReflection();
      controls.update();
      renderer.render(scene, camera);
    });
  }
}

export { World2 };
