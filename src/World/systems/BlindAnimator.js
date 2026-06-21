import RAPIER from '@dimforge/rapier3d-compat';


class BlindAnimator {


    constructor(blindMesh, { blindH, winH, speed = 0.35 }) {
        this.blindMesh = blindMesh;
        this.speed = speed;
        this.winH = winH;
        this.blindH = blindH;

        this.topEdge = winH / 2;

        this.bottomY = this.topEdge - blindH / 2;

        this._elapsed = 0;
        this._ready = false;
        this._world = null;
        this._body = null;

        this._init();
    }

    async _init() {

        await RAPIER.init();

        this._world = new RAPIER.World({ x: 0, y: 0, z: 0 });

        const desc = RAPIER.RigidBodyDesc
            .kinematicPositionBased()
            .setTranslation(0, this.bottomY, 0);

        this._body = this._world.createRigidBody(desc);
        this._ready = true;
    }


    update(delta) {
        if (!this._ready) return;

        this._elapsed += delta;


        const factor = (Math.sin(this._elapsed * this.speed) + 1) / 2;


        const s = 1.0 - factor * 0.95;

        // Altura atual da cortina com a escala aplicada
        const currentHeight = this.blindH * s;

        // Nova posição Y do centro para manter a borda superior sempre fixa no topo
        const targetY = this.topEdge - currentHeight / 2;

        this._body.setNextKinematicTranslation({ x: 0, y: targetY, z: 0 });

        // Avança a simulação (um step)
        this._world.step();

        // Lê a posição resultante do corpo e sincroniza a mesh Three.js
        const pos = this._body.translation();
        this.blindMesh.position.y = pos.y;
        this.blindMesh.scale.y = s;
    }
}

export { BlindAnimator };
