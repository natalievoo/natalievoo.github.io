// A horse galloping, written in characters.
// Each frame of the gallop is drawn as a plain silhouette, then laid over a grid: the more horse
// a cell holds, the denser the character it gets. A few characters change every frame, so it shimmers.
// Use: <canvas data-char-horse></canvas>
(() => {
    const canvas = document.querySelector('[data-char-horse]');
    if (!canvas) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const COLS = 64, ROWS = 38, FRAMES = 8, FRAME_MS = 115;
    const DENSE = ['马', '午', '奔', '腾', '驰'];
    const MID = ['火', '风', '之', '乙'];
    const LIGHT = ['、', '丶', '一'];
    const INK = '#1f2a30', SPARK = '#b3362b';

    // ─── The gallop: one silhouette per frame, on a 64 × 38 grid, facing right ───
    function silhouette(t) {
        const c = document.createElement('canvas');
        const K = 4; // drawn 4× finer than the grid, so each cell can measure how full it is
        c.width = COLS * K; c.height = ROWS * K;
        const x = c.getContext('2d');
        x.scale(K, K);
        x.fillStyle = x.strokeStyle = '#000';
        x.lineCap = 'round'; x.lineJoin = 'round';
        const TAU = Math.PI * 2;
        const bob = Math.sin(t * TAU * 2) * 1.1;
        const nod = Math.sin(t * TAU + 1) * 1.4;
        const oy = 5 + bob;
        // Legs: a thigh and a shin each, swinging out of phase (a transverse gallop)
        const leg = (hx, hy, phase, fore) => {
            const s = Math.sin((t + phase) * TAU);
            const thigh = (fore ? 0.95 : 0.85) * s + (fore ? 0.15 : -0.1);
            const fold = Math.max(0, Math.sin((t + phase) * TAU + (fore ? 1.2 : -1.2))) * (fore ? 1.5 : -1.1);
            const kx = hx + Math.sin(thigh) * 7, ky = hy + Math.cos(thigh) * 7;
            const shin = thigh + fold;
            x.lineWidth = 2.6;
            x.beginPath(); x.moveTo(hx, hy); x.lineTo(kx, ky); x.lineTo(kx + Math.sin(shin) * 7.5, ky + Math.cos(shin) * 7.5); x.stroke();
        };
        leg(22, 22 + oy, 0.08, false); leg(41, 22 + oy, 0.53, true); // far legs
        // Tail, streaming back
        x.lineWidth = 2.4;
        x.beginPath(); x.moveTo(15, 16 + oy); x.quadraticCurveTo(8, 13 + oy + nod, 3, 17 + oy - nod); x.stroke();
        x.lineWidth = 1.4;
        x.beginPath(); x.moveTo(15, 17 + oy); x.quadraticCurveTo(9, 18 + oy - nod, 4, 22 + oy); x.stroke();
        // Body: haunch, barrel, chest
        x.beginPath(); x.ellipse(30, 18 + oy, 13, 6.2, -0.05, 0, TAU); x.fill();
        x.beginPath(); x.arc(19.5, 17.5 + oy, 6.4, 0, TAU); x.fill();
        x.beginPath(); x.arc(40, 16.5 + oy, 6, 0, TAU); x.fill();
        // Neck and head, nodding with the stride
        x.beginPath(); x.moveTo(36, 14 + oy); x.lineTo(43, 20 + oy); x.lineTo(50, 7 + oy + nod); x.lineTo(46.5, 2 + oy + nod); x.closePath(); x.fill();
        x.save(); x.translate(52.5, 6 + oy + nod); x.rotate(0.6); x.beginPath(); x.ellipse(0, 0, 6.8, 3.1, 0, 0, TAU); x.fill(); x.restore();
        x.beginPath(); x.moveTo(47, 2.5 + oy + nod); x.lineTo(48.5, -1.5 + oy + nod); x.lineTo(50, 3 + oy + nod); x.fill();
        // Mane, flying
        x.lineWidth = 1.6;
        x.beginPath(); x.moveTo(47, 3 + oy + nod); x.quadraticCurveTo(41, 6 + oy, 37, 13 + oy); x.stroke();
        leg(20, 21 + oy, 0, false); leg(39, 21 + oy, 0.45, true); // near legs
        // How full each grid cell is
        const d = x.getImageData(0, 0, c.width, c.height).data;
        const grid = new Float32Array(COLS * ROWS);
        for (let gy = 0; gy < ROWS; gy++) for (let gx = 0; gx < COLS; gx++) {
            let a = 0;
            for (let yy = 0; yy < K; yy++) for (let xx = 0; xx < K; xx++) a += d[(((gy * K + yy) * c.width) + gx * K + xx) * 4 + 3];
            grid[gy * COLS + gx] = a / (K * K * 255);
        }
        return grid;
    }
    const frames = Array.from({ length: FRAMES }, (_, i) => silhouette(i / FRAMES));

    // ─── Characters ───
    const pick = (list) => list[(Math.random() * list.length) | 0];
    const glyphs = new Array(COLS * ROWS).fill(null).map(() => ({ dense: pick(DENSE), mid: pick(MID), light: pick(LIGHT), spark: Math.random() < 0.05 }));
    const ctx = canvas.getContext('2d');
    let cell = 12, frame = 0, ground = 0;
    function size() {
        cell = Math.max(7, Math.min(14, Math.floor(canvas.parentElement.clientWidth / COLS)));
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.style.width = `${COLS * cell}px`; canvas.style.height = `${(ROWS + 2) * cell}px`;
        canvas.width = COLS * cell * dpr; canvas.height = (ROWS + 2) * cell * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function render() {
        const g = frames[frame];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = `${cell * 0.95}px 'Ma Shan Zheng', 'KaiTi', serif`;
        for (let i = 0; i < g.length; i++) {
            const v = g[i];
            if (v < 0.12) continue;
            const gl = glyphs[i];
            const ch = v > 0.55 ? gl.dense : v > 0.28 ? gl.mid : gl.light;
            ctx.fillStyle = gl.spark && v > 0.55 ? SPARK : INK;
            ctx.globalAlpha = v > 0.55 ? 0.92 : v > 0.28 ? 0.6 : 0.35;
            ctx.fillText(ch, (i % COLS + 0.5) * cell, ((i / COLS | 0) + 0.5) * cell);
        }
        // The ground going by beneath
        ctx.fillStyle = INK; ctx.globalAlpha = 0.3;
        for (let gx = 0; gx < COLS; gx++) if ((gx + ground) % 5 === 0) ctx.fillText('、', (gx + 0.5) * cell, (ROWS + 0.6) * cell);
        ctx.globalAlpha = 1;
    }
    function shimmer() {
        for (let k = 0; k < glyphs.length * 0.08; k++) {
            const gl = glyphs[(Math.random() * glyphs.length) | 0];
            gl.dense = pick(DENSE); gl.mid = pick(MID); gl.light = pick(LIGHT); gl.spark = Math.random() < 0.05;
        }
    }

    size();
    addEventListener('resize', () => { size(); render(); });
    // Canvas text doesn't make the browser fetch a web font, so ask for these characters explicitly
    const chars = [...DENSE, ...MID, ...LIGHT].join('');
    (document.fonts?.load(`16px 'Ma Shan Zheng'`, chars) || Promise.resolve()).catch(() => {}).then(render);
    if (reduce) return;
    // Gallop only while it's on screen
    let visible = false, last = 0;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
    const loop = (now) => {
        if (visible && now - last > FRAME_MS) {
            last = now;
            frame = (frame + 1) % FRAMES;
            ground = (ground + 1) % 5;
            shimmer();
            render();
        }
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
})();
