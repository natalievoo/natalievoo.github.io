// Leave a page alone for a while and it turns to night: the Pisces constellation draws itself
// in, star by star, and the two fish swim out of the lines. Any touch brings the page back.
(() => {
    const IDLE_MS = 50000;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer = null, overlay = null, raf = null;

    // Pisces, roughly as it sits in the sky: the circlet (western fish) at the lower left, the long
    // cord up to the knot at Alrescha, and the northern fish at the top. Coordinates are 0–1.
    const STARS = [[0.08, 0.64], [0.14, 0.69], [0.21, 0.66], [0.21, 0.58], [0.13, 0.56], // circlet
        [0.30, 0.63], [0.40, 0.60], [0.50, 0.56], [0.60, 0.52], [0.70, 0.49], // the cord to the knot
        [0.65, 0.39], [0.61, 0.29], [0.58, 0.19], [0.53, 0.12], [0.60, 0.08], [0.67, 0.13]]; // up to the northern fish
    const LINES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [2, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 12]];

    function show() {
        if (overlay || document.hidden || document.body.classList.contains('no-idle')) return;
        overlay = document.createElement('div');
        overlay.className = 'night';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = '<canvas></canvas><span class="night-label">双鱼 · Pisces</span>';
        document.body.append(overlay);
        requestAnimationFrame(() => overlay.classList.add('in'));
        const canvas = overlay.firstElementChild, ctx = canvas.getContext('2d');
        const dpr = Math.min(devicePixelRatio || 1, 2);
        let W, H;
        const size = () => { W = innerWidth; H = innerHeight; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
        size();
        const field = Array.from({ length: 220 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.3, p: Math.random() * 6.28, s: 0.5 + Math.random() }));
        const comets = [];
        const t0 = performance.now();
        // The constellation sits in the middle, a little above centre, whatever the screen's shape
        const box = () => { const s = Math.min(W * 0.72, H * 0.78); return { x: (W - s) / 2, y: (H - s) / 2 - H * 0.04, s }; };
        const at = ([x, y]) => { const b = box(); return [b.x + x * b.s, b.y + y * b.s]; };
        function frame(now) {
            const t = (now - t0) / 1000;
            ctx.clearRect(0, 0, W, H);
            // Faint stars, breathing
            for (const f of field) {
                ctx.globalAlpha = 0.35 + 0.35 * Math.sin(t * f.s + f.p);
                ctx.fillStyle = '#e9e4d6';
                ctx.beginPath(); ctx.arc(f.x * W, f.y * H, f.r, 0, 6.28); ctx.fill();
            }
            // Now and then a shooting star
            if (!reduce && Math.random() < 0.004) comets.push({ x: Math.random() * W, y: Math.random() * H * 0.5, vx: -4 - Math.random() * 4, vy: 2 + Math.random() * 2, life: 1 });
            for (const c of comets) {
                c.x += c.vx; c.y += c.vy; c.life -= 0.02;
                ctx.globalAlpha = Math.max(0, c.life) * 0.9; ctx.strokeStyle = '#f4efe4'; ctx.lineWidth = 1.2;
                ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x - c.vx * 9, c.y - c.vy * 9); ctx.stroke();
            }
            for (let i = comets.length - 1; i >= 0; i--) if (comets[i].life <= 0) comets.splice(i, 1);
            // The constellation: stars first, then the lines are drawn in one by one
            const drawn = reduce ? LINES.length : Math.min(LINES.length, (t - 1.2) * 2.2);
            ctx.globalAlpha = 1;
            LINES.forEach(([a, b], i) => {
                const u = Math.max(0, Math.min(1, drawn - i));
                if (u <= 0) return;
                const [x1, y1] = at(STARS[a]), [x2, y2] = at(STARS[b]);
                ctx.strokeStyle = 'rgba(199,154,91,0.55)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + (x2 - x1) * u, y1 + (y2 - y1) * u); ctx.stroke();
            });
            STARS.forEach(([x, y], i) => {
                const [px, py] = at([x, y]);
                const big = i === 9 || i === 2 || i === 12; // the knot and the two fish
                const glow = 0.6 + 0.4 * Math.sin(t * 1.3 + i);
                ctx.fillStyle = '#f4efe4';
                ctx.globalAlpha = Math.min(1, Math.max(0, t - 0.4 - i * 0.08)) * glow;
                ctx.beginPath(); ctx.arc(px, py, big ? 3.2 : 2, 0, 6.28); ctx.fill();
                if (big) { ctx.globalAlpha *= 0.25; ctx.beginPath(); ctx.arc(px, py, 9, 0, 6.28); ctx.fill(); }
            });
            // The two fish, swimming slowly at either end of the cord
            if (drawn >= LINES.length) {
                ctx.globalAlpha = Math.min(0.5, (drawn - LINES.length + 1) * 0.5 * (t > 9 ? 1 : (t - 8)));
                ctx.strokeStyle = '#7fb3a3'; ctx.lineWidth = 1;
                const fish = (cx, cy, s, dir, ph) => {
                    const w = Math.sin(t * 1.5 + ph) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(cx + dir * s, cy);
                    ctx.quadraticCurveTo(cx, cy - s * (0.55 + w), cx - dir * s * 0.8, cy);
                    ctx.quadraticCurveTo(cx, cy + s * (0.55 - w), cx + dir * s, cy);
                    ctx.moveTo(cx - dir * s * 0.8, cy); ctx.lineTo(cx - dir * s * 1.3, cy - s * 0.35); ctx.lineTo(cx - dir * s * 1.3, cy + s * 0.35); ctx.closePath();
                    ctx.stroke();
                };
                const b = box();
                fish(...at([0.15, 0.62]), b.s * 0.09, 1, 0);
                fish(...at([0.6, 0.12]), b.s * 0.08, -1, 2);
            }
            ctx.globalAlpha = 1;
            raf = requestAnimationFrame(frame);
        }
        raf = requestAnimationFrame(frame);
        addEventListener('resize', size);
        overlay._cleanup = () => removeEventListener('resize', size);
    }
    function hide() {
        if (!overlay) return;
        cancelAnimationFrame(raf);
        overlay._cleanup();
        const el = overlay; overlay = null;
        el.classList.remove('in');
        setTimeout(() => el.remove(), 900);
    }
    function poke() {
        hide();
        clearTimeout(timer);
        timer = setTimeout(show, IDLE_MS);
    }
    for (const ev of ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll']) addEventListener(ev, poke, { passive: true });
    document.addEventListener('visibilitychange', () => (document.hidden ? clearTimeout(timer) : poke()));
    poke();
    // Open any page with #night on the end to see it straight away
    if (location.hash === '#night') setTimeout(show, 400);

    const css = document.createElement('style');
    css.textContent = `
        .night { position: fixed; inset: 0; z-index: 90; background: radial-gradient(ellipse at 50% 60%, #141b31, #090d19 70%); opacity: 0; transition: opacity 1.2s ease; cursor: none; }
        .night.in { opacity: 1; }
        .night canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
        .night-label { position: absolute; right: 1.5rem; bottom: 1.25rem; font: italic 1rem 'Cormorant Garamond', serif; color: rgb(244 239 228 / 0.45); letter-spacing: 0.08em; }
        @media (prefers-reduced-motion: reduce) { .night { transition: none; } }`;
    document.head.append(css);
})();
