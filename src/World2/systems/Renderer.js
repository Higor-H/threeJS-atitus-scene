import * as THREE from 'three';

class Renderer {
  static create() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Recommended for realism
    renderer.toneMappingExposure = 1.0;

    return renderer;
  }
}


export { Renderer };
