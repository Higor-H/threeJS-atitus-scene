// ========= Scene 1 ===================================================================

// import { World } from './World/World.js';
//
// function main() {
//   const container = document.querySelector('#scene-container');
//   const world = new World(container);
//   world.render();
// }
// main();


// ========= Scene 2 =============================================

import { World2 } from './World2/World2.js';

function main() {
  const container = document.querySelector('#scene-container');
  const world = new World2(container);

  world.render();
}

main();
