import * as THREE from 'three';

class FlyCamera {
    constructor(camera, { speed = 0.08, orbitControls = null } = {}) {
        this.camera = camera;
        this.speed = speed;
        this.orbitControls = orbitControls;

        this._keys = new Set();

        this._onKeyDown = (e) => this._keys.add(e.code);
        this._onKeyUp = (e) => this._keys.delete(e.code);

        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
    }

    update() {
        const keys = this._keys;
        const turbo = keys.has('ShiftLeft') || keys.has('ShiftRight');
        const spd = this.speed * (turbo ? 3 : 1);


        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);


        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

        const up = new THREE.Vector3(0, 1, 0);

        let moved = false;

        if (keys.has('KeyW') || keys.has('ArrowUp')) { this.camera.position.addScaledVector(forward, spd); moved = true; }
        if (keys.has('KeyS') || keys.has('ArrowDown')) { this.camera.position.addScaledVector(forward, -spd); moved = true; }
        if (keys.has('KeyA') || keys.has('ArrowLeft')) { this.camera.position.addScaledVector(right, -spd); moved = true; }
        if (keys.has('KeyD') || keys.has('ArrowRight')) { this.camera.position.addScaledVector(right, spd); moved = true; }
        if (keys.has('KeyE') || keys.has('PageUp')) { this.camera.position.addScaledVector(up, spd); moved = true; }
        if (keys.has('KeyQ') || keys.has('PageDown')) { this.camera.position.addScaledVector(up, -spd); moved = true; }

        if (moved && this.orbitControls) {
            this.orbitControls.target
                .copy(this.camera.position)
                .addScaledVector(forward, 5);
        }
    }

    /** Remove os event listeners quando o controle não for mais necessário. */
    dispose() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
    }
}

export { FlyCamera };
