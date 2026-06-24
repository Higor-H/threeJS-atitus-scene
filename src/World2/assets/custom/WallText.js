import * as THREE from 'three';

class WallText {

    static #buildCanvas() {
        const W = 2048, H = 900;
        const canvas = document.createElement('canvas');
        canvas.width  = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');

        // Fundo transparente
        ctx.clearRect(0, 0, W, H);

        ctx.save();
        ctx.font = '700 420px "Arial", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
        ctx.fillText('ATITUS', W / 2, H * 0.4);
        ctx.restore();

        ctx.save();
        ctx.font = '300 155px "Arial", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';

        const text = 'EDUCAÇÃO';
        const letterSpacing = 28;
        const totalW = ctx.measureText(text).width + letterSpacing * (text.length - 1);
        let startX = W / 2 - totalW / 2;
        for (const ch of text) {
            ctx.fillText(ch, startX + ctx.measureText(ch).width / 2, H * 0.82);
            startX += ctx.measureText(ch).width + letterSpacing;
        }
        ctx.restore();

        return canvas;
    }

    /**
     * Cria o mesh com o texto e o posiciona na parede frontal.
     * @param {number} wallZ  - Z da parede frontal (default 8)
     */
    static create(wallZ = 8) {
        const canvas  = WallText.#buildCanvas();
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        const mat = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            roughness: 0.85,
            metalness: 0,
            depthWrite: false,
        });


        const planeW = 9;
        const planeH = planeW * (900 / 2048);

        const geo  = new THREE.PlaneGeometry(planeW, planeH);
        const mesh = new THREE.Mesh(geo, mat);

        mesh.position.set(0, 3.6, wallZ - 0.05);
        mesh.rotation.y = Math.PI;
        mesh.receiveShadow = false;

        return mesh;
    }
}

export { WallText };
