const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand = (a, b) => a + Math.random() * (b - a);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Ink colours, used by the ripples
const PALETTE = [
    { c: [31, 42, 48], w: 5 },      // ink
    { c: [47, 93, 140], w: 3 },     // azurite
    { c: [61, 139, 125], w: 3 },    // malachite
    { c: [127, 179, 163], w: 1.5 }, // stone green
    { c: [199, 154, 91], w: 0.8 },  // ochre
];
const pickColour = () => {
    let n = Math.random() * PALETTE.reduce((s, p) => s + p.w, 0);
    for (const p of PALETTE) if ((n -= p.w) < 0) return p.c;
    return PALETTE[0].c;
};
const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`;

// ─── The water: koi surface now and then, ripples fade ─────────────
const water = document.getElementById('water');
const wctx = water.getContext('2d');
let W = 0, H = 0, dpr = 1;
function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = water.clientWidth; H = water.clientHeight;
    water.width = Math.round(W * dpr); water.height = Math.round(H * dpr);
    wctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
size();
window.addEventListener('resize', () => { size(); layPads(); });
const brush = { col: pickColour() };
let feeding = false;
window.POND = { setFeeding(on) { feeding = on; document.body.classList.toggle('feeding', on); } };

// Ripples on the water: flattened rings that spread and fade
const ripples = [];
function ripple(x, y, big = 1) {
    if (reduce) return;
    ripples.push({ x, y, big, born: performance.now(), life: 2400 });
    wake();
}


// Koi, Ghibli style: chubby, flat warm colours with one shadow tone and
// a highlight, outlines tinted to the body, floaty see-through fins.
// They surface now and then, drift, dart away from the cursor, and sink.
const KOI = [
    { body: '#fbf3e4', shade: '#ecdcc4', line: '#c9a98a', spots: ['#e8673c'] },            // kohaku
    { body: '#fbf3e4', shade: '#ecdcc4', line: '#b89a80', spots: ['#e8673c', '#2b3339'] }, // showa
    { body: '#f0b54a', shade: '#d9963a', line: '#b0702a', spots: [] },                     // gold
    { body: '#e8673c', shade: '#c9502c', line: '#9c3a22', spots: ['#fbf3e4'] },            // orange
];
const kois = [];
const pointer = { x: -1e4, y: -1e4 };
window.addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; });

function newKoi() {
    if (reduce || kois.length >= 3) return null;
    const look = KOI[(Math.random() * KOI.length) | 0];
    const x = rand(0.12, 0.88) * W, y = rand(0.15, 0.88) * H;
    const k = {
        x, y, look, L: rand(70, 100), heading: rand(0, 6.28), turn: rand(-0.3, 0.3),
        speed: rand(22, 36), phase: rand(0, 6), born: performance.now(), life: rand(26000, 40000),
        spots: Array.from({ length: look.spots.length ? rand(2, 4) | 0 : 0 }, () => ({
            u: rand(0.08, 0.7), side: rand(-0.5, 0.5), r: rand(0.08, 0.15),
            c: look.spots[(Math.random() * look.spots.length) | 0],
        })),
        dive: 0,
    };
    kois.push(k);
    ripple(x, y, 0.6);
    return k;
}
function spawnKoi() { if (document.hidden) return; if (newKoi()) wake(); }
function scheduleKoi(delay = rand(5000, 9000)) {
    setTimeout(() => { spawnKoi(); scheduleKoi(); }, delay);
}

const angleTo = (from, to) => ((to - from + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
function swim(k, dt) {
    k.turn = Math.max(-0.6, Math.min(0.6, k.turn + rand(-1, 1) * dt * 0.8));
    let speed = k.speed;
    // Food nearby: swim to the nearest crumb and eat it
    let near = null, nd = 1e9;
    for (const c of crumbs) { const d = Math.hypot(c.x - k.x, c.y - k.y); if (d < nd) { nd = d; near = c; } }
    if (near) {
        k.heading += angleTo(k.heading, Math.atan2(near.y - k.y, near.x - k.x)) * Math.min(1, dt * 4);
        speed *= nd > 60 ? 2.6 : 1.2;
        if (nd < 14) { crumbs.splice(crumbs.indexOf(near), 1); ripple(near.x, near.y, 0.25); }
        k.phase += dt * speed * 0.03;
        k.x += Math.cos(k.heading) * speed * dt; k.y += Math.sin(k.heading) * speed * dt;
        keepInPond(k);
        return;
    }
    // Startled by the cursor: turn away and dart
    const dx = k.x - pointer.x, dy = k.y - pointer.y;
    if (Math.hypot(dx, dy) < 140) {
        k.heading += angleTo(k.heading, Math.atan2(dy, dx)) * Math.min(1, dt * 5);
        speed *= 3.4;
        if (!k.startled) ripple(k.x, k.y, 0.45);
        k.startled = true;
    } else {
        k.startled = false;
    }
    if (k.dive && performance.now() - k.dive < 1500) speed *= 3; // fleeing a splash
    keepInPond(k);
    k.heading += k.turn * dt;
    k.x += Math.cos(k.heading) * speed * dt;
    k.y += Math.sin(k.heading) * speed * dt;
    k.phase += dt * (3.5 + speed * 0.06);
}

function keepInPond(k) {
    if (k.x < 70 || k.x > W - 70 || k.y < 70 || k.y > H - 70) k.heading += angleTo(k.heading, Math.atan2(H / 2 - k.y, W / 2 - k.x)) * 0.03;
}
function drawKoi(ctx, k, now) {
    const age = now - k.born;
    const diving = k.dive ? Math.max(0, 1 - Math.abs((now - k.dive) - 1500) / 1500) : 0; // down, then up again over 3s
    const vis = Math.max(0, Math.min(1, age / 1100, (k.life - age) / 1400)) * (1 - diving * 0.92);
    const ev = vis * vis * (3 - 2 * vis);
    const L = k.L * (0.86 + 0.14 * ev);
    const N = 14, ch = Math.cos(k.heading), sh = Math.sin(k.heading);
    const at = (x, y) => [k.x + x * ch - y * sh, k.y + x * sh + y * ch];
    // The spine: the tail swings more than the head
    const spine = [];
    for (let i = 0; i <= N; i++) {
        const u = i / N;
        const lat = Math.sin(k.phase - u * 3.4) * L * 0.1 * Math.pow(u, 1.5) + Math.sin(k.phase) * L * 0.012;
        spine.push({ u, p: at(-u * L, lat) });
    }
    const width = (u) => L * 0.21 * (u < 0.3 ? 0.6 + 0.4 * Math.sin((u / 0.3) * Math.PI / 2) : 1 - Math.pow((u - 0.3) / 0.7, 0.8) * 0.82);
    const left = [], right = [];
    spine.forEach((sp, i) => {
        const a = spine[Math.max(0, i - 1)].p, b = spine[Math.min(N, i + 1)].p;
        const tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty) || 1;
        const nx = -ty / tl, ny = tx / tl, w = width(sp.u);
        sp.n = [nx, ny]; sp.back = [tx / tl, ty / tl];
        left.push([sp.p[0] + nx * w, sp.p[1] + ny * w]);
        right.push([sp.p[0] - nx * w, sp.p[1] - ny * w]);
    });
    const nose = at(L * 0.07, Math.sin(k.phase) * L * 0.012);
    const outline = [nose, ...left, ...right.slice().reverse()];
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const bodyPath = () => {
        ctx.beginPath();
        const s0 = mid(outline[outline.length - 1], outline[0]);
        ctx.moveTo(s0[0], s0[1]);
        for (let i = 0; i < outline.length; i++) {
            const pt = outline[i], q = mid(pt, outline[(i + 1) % outline.length]);
            ctx.quadraticCurveTo(pt[0], pt[1], q[0], q[1]);
        }
        ctx.closePath();
    };
    const rot = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
    const fin = (base, dir, len, spread, colour) => {
        const tip = [base[0] + dir[0] * len, base[1] + dir[1] * len];
        ctx.beginPath();
        ctx.moveTo(base[0], base[1]);
        ctx.quadraticCurveTo(base[0] + dir[0] * len * 0.6 - dir[1] * spread, base[1] + dir[1] * len * 0.6 + dir[0] * spread, tip[0], tip[1]);
        ctx.quadraticCurveTo(base[0] + dir[0] * len * 0.4 + dir[1] * spread * 0.4, base[1] + dir[1] * len * 0.4 - dir[0] * spread * 0.4, base[0], base[1]);
        ctx.fillStyle = colour; ctx.fill();
        ctx.save(); ctx.globalAlpha *= 0.6; ctx.strokeStyle = k.look.line; ctx.lineWidth = 0.8; ctx.stroke(); ctx.restore();
    };
    const lk = k.look;
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';

    // A soft shadow on the pond floor
    ctx.save(); ctx.translate(7, 10); ctx.globalAlpha = ev * 0.12; ctx.fillStyle = '#1f2a30'; bodyPath(); ctx.fill(); ctx.restore();

    // Fins: a flowing tail, and two pectoral fins that paddle
    const tail = spine[N], swing = Math.sin(k.phase - 3.4) * 0.5;
    ctx.globalAlpha = ev * 0.7;
    fin(tail.p, rot(tail.back, 0.5 + swing), L * 0.42, L * 0.16, lk.shade);
    fin(tail.p, rot(tail.back, -0.5 + swing), L * 0.42, -L * 0.16, lk.shade);
    const pec = spine[4], paddle = Math.sin(k.phase * 1.3) * 0.35;
    fin(pec.p, rot(pec.n, 0.9 + paddle), L * 0.3, L * 0.1, lk.shade);
    fin(pec.p, rot([-pec.n[0], -pec.n[1]], -0.9 - paddle), L * 0.3, -L * 0.1, lk.shade);
    ctx.globalAlpha = ev;

    // Body: flat colour, one shadow tone down one flank, spots, then a highlight
    bodyPath(); ctx.fillStyle = lk.body; ctx.fill();
    ctx.save(); bodyPath(); ctx.clip();
    ctx.beginPath();
    right.forEach((pt, i) => (i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1])));
    spine.slice().reverse().forEach((sp) => ctx.lineTo(sp.p[0] - sp.n[0] * width(sp.u) * 0.25, sp.p[1] - sp.n[1] * width(sp.u) * 0.25));
    ctx.fillStyle = lk.shade; ctx.fill();
    for (const spot of k.spots) {
        const sp = spine[Math.round(spot.u * N)], w = width(spot.u);
        ctx.beginPath();
        ctx.ellipse(sp.p[0] + sp.n[0] * w * spot.side, sp.p[1] + sp.n[1] * w * spot.side, L * spot.r, L * spot.r * 0.75, k.heading, 0, Math.PI * 2);
        ctx.fillStyle = spot.c; ctx.fill();
    }
    ctx.beginPath();
    spine.slice(1, 9).forEach((sp, i) => {
        const w = width(sp.u) * 0.4, x = sp.p[0] + sp.n[0] * w, y = sp.p[1] + sp.n[1] * w;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = L * 0.035; ctx.stroke();
    ctx.restore();
    bodyPath(); ctx.strokeStyle = lk.line; ctx.lineWidth = 1.1; ctx.stroke();

    // Eyes, each with a glint
    const head = spine[1], ew = width(0.07) * 0.62;
    for (const side of [1, -1]) {
        const ex = head.p[0] + head.n[0] * ew * side, ey = head.p[1] + head.n[1] * ew * side;
        ctx.beginPath(); ctx.arc(ex, ey, L * 0.022, 0, Math.PI * 2); ctx.fillStyle = '#2b3339'; ctx.fill();
        ctx.beginPath(); ctx.arc(ex - L * 0.006, ey - L * 0.006, L * 0.008, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    }
    ctx.restore();
}

// ─── The pond ───────────────────────────────────────────────────────
// Pale blue water, light drifting on the surface, a few lily pads, specks floating by,
// and the koi beneath.
const PADS = [], SPECKS = [];
function layPads() {
    PADS.length = 0;
    const n = W < 700 ? 3 : 5;
    for (let i = 0; i < n; i++) {
        const edge = i % 2 ? 'r' : 'l';
        PADS.push({
            x: edge === 'l' ? rand(0.02, 0.1) * W : rand(0.9, 0.98) * W, y: rand(0.1, 0.9) * H,
            r: rand(26, 44), a: rand(0, 6.28), notch: rand(0.5, 0.9), tone: Math.random(),
            bud: Math.random() < 0.35, drift: rand(0, 6.28),
        });
    }
    SPECKS.length = 0;
    for (let i = 0; i < 40; i++) SPECKS.push({ x: Math.random(), y: Math.random(), r: rand(0.6, 1.6), s: rand(0.004, 0.012), p: rand(0, 6.28) });
}
const CAUSTICS = Array.from({ length: 11 }, (_, i) => ({ x: Math.random(), y: Math.random(), rx: rand(0.12, 0.3), ry: rand(0.06, 0.16), s: rand(0.05, 0.12), p: rand(0, 6.28), i }));
function drawPond(now) {
    const t = now / 1000;
    const g = wctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.85);
    g.addColorStop(0, '#dff1f7'); g.addColorStop(0.55, '#c9e4ef'); g.addColorStop(1, '#a9d1e3');
    wctx.fillStyle = g; wctx.fillRect(0, 0, W, H);
    // light moving on the surface
    for (const c of CAUSTICS) {
        const x = (c.x + Math.sin(t * c.s + c.p) * 0.06) * W, y = (c.y + Math.cos(t * c.s * 0.8 + c.p) * 0.04) * H;
        const rg = wctx.createRadialGradient(x, y, 0, x, y, c.rx * W);
        const a = 0.09 + 0.04 * Math.sin(t * c.s * 3 + c.i);
        rg.addColorStop(0, `rgba(255,255,250,${a})`); rg.addColorStop(0.5, `rgba(255,255,250,${a * 0.45})`); rg.addColorStop(1, 'rgba(255,255,250,0)');
        wctx.fillStyle = rg;
        wctx.save(); wctx.translate(x, y); wctx.scale(1, c.ry / c.rx); wctx.beginPath(); wctx.arc(0, 0, c.rx * W, 0, 6.283); wctx.fill(); wctx.restore();
    }
    // slow surface ripple lines, like a breath of wind
    wctx.strokeStyle = 'rgba(255,255,255,0.22)'; wctx.lineWidth = 1.2;
    for (let k = 0; k < 7; k++) {
        const y0 = ((k / 7) + ((t * 0.01 + k * 0.13) % 1)) % 1 * H;
        wctx.beginPath();
        for (let x = 0; x <= W; x += 24) wctx.lineTo(x, y0 + Math.sin(x * 0.012 + t * 0.6 + k) * 5 + Math.sin(x * 0.03 - t * 0.4) * 2);
        wctx.stroke();
    }
}
function drawSpecks(now) {
    const t = now / 1000;
    wctx.fillStyle = 'rgba(255,255,255,0.45)';
    for (const sp of SPECKS) {
        const x = ((sp.x + t * sp.s) % 1) * W, y = (sp.y + Math.sin(t * 0.3 + sp.p) * 0.01) * H;
        wctx.beginPath(); wctx.arc(x, y, sp.r, 0, 6.283); wctx.fill();
    }
}
function drawPads(now) {
    const t = now / 1000;
    for (const p of PADS) {
        const x = p.x + Math.sin(t * 0.18 + p.drift) * 4, y = p.y + Math.cos(t * 0.14 + p.drift) * 3;
        wctx.save(); wctx.translate(x, y);
        // the pad's shadow on the water
        wctx.beginPath(); wctx.arc(3, 5, p.r, 0, 6.283); wctx.fillStyle = 'rgba(40,70,45,0.1)'; wctx.fill();
        wctx.rotate(p.a);
        wctx.beginPath(); wctx.moveTo(0, 0); wctx.arc(0, 0, p.r, p.notch * 0.5, 6.283 - p.notch * 0.5); wctx.closePath();
        const pg = wctx.createRadialGradient(-p.r * 0.3, -p.r * 0.3, 0, 0, 0, p.r);
        pg.addColorStop(0, p.tone < 0.5 ? '#9fbf9a' : '#8fb38c'); pg.addColorStop(1, p.tone < 0.5 ? '#6f9a6e' : '#5f8a60');
        wctx.fillStyle = pg; wctx.fill();
        wctx.strokeStyle = 'rgba(40,70,45,0.25)'; wctx.lineWidth = 1; wctx.stroke();
        wctx.strokeStyle = 'rgba(40,70,45,0.18)'; wctx.lineWidth = 0.8;
        for (let k = 0; k < 6; k++) { const a = p.notch * 0.5 + (6.283 - p.notch) * (k + 0.5) / 6; wctx.beginPath(); wctx.moveTo(0, 0); wctx.lineTo(Math.cos(a) * p.r * 0.92, Math.sin(a) * p.r * 0.92); wctx.stroke(); }
        if (p.bud) { wctx.beginPath(); wctx.ellipse(p.r * 0.55, -p.r * 0.5, 5, 8, -0.4, 0, 6.283); wctx.fillStyle = '#f2bfc9'; wctx.fill(); wctx.beginPath(); wctx.ellipse(p.r * 0.55, -p.r * 0.5, 2.2, 5, -0.4, 0, 6.283); wctx.fillStyle = '#e48ea3'; wctx.fill(); }
        wctx.restore();
    }
}

// ─── Food: throw some in and the koi come ───
const crumbs = [];
function feed(x, y) {
    for (let k = 0; k < 7; k++) crumbs.push({ x: x + rand(-18, 18), y: y + rand(-12, 12), born: performance.now(), life: rand(9000, 14000), vx: rand(-3, 3), vy: rand(-2, 2) });
    ripple(x, y, 0.5);
    // any koi that aren't here yet come up to see
    while (kois.length < 3) { const k = newKoi(); if (!k) break; k.x = rand(0.1, 0.9) * W; k.y = rand(0.1, 0.9) * H; }
    wake();
}
function drawCrumbs(now) {
    for (let i = crumbs.length - 1; i >= 0; i--) {
        const c = crumbs[i], age = now - c.born;
        if (age > c.life) { crumbs.splice(i, 1); continue; }
        c.x += c.vx * 0.016; c.y += c.vy * 0.016;
        const a = Math.min(1, (c.life - age) / 1500);
        wctx.fillStyle = `rgba(214,170,96,${0.9 * a})`; wctx.beginPath(); wctx.arc(c.x, c.y, 2.2, 0, 6.283); wctx.fill();
        wctx.fillStyle = `rgba(255,240,200,${0.6 * a})`; wctx.beginPath(); wctx.arc(c.x - 0.6, c.y - 0.6, 0.8, 0, 6.283); wctx.fill();
    }
}

// ─── A click on the water: a splash, and the fish dive ───
const splashes = [];
water.style.pointerEvents = 'none';
document.addEventListener('pointerdown', (e) => {
    // the welcome panel is the pond; other panels are paper over it
    if (e.target.closest('a, button, .panel:not(#panel-welcome) .col, .tin, .sticker, .dock, .top-nav, input, textarea, .hero-wing, .name-row')) return;
    if (feeding) { feed(e.clientX, e.clientY); return; }
    ripple(e.clientX, e.clientY, 1.4);
    ripple(e.clientX, e.clientY, 0.8);
    for (let k = 0; k < 10; k++) splashes.push({ x: e.clientX, y: e.clientY, vx: rand(-90, 90), vy: rand(-160, -40), born: performance.now(), life: rand(400, 700) });
    for (const k of kois) { const d = Math.hypot(k.x - e.clientX, k.y - e.clientY); if (d < 260) { k.dive = performance.now(); k.heading = Math.atan2(k.y - e.clientY, k.x - e.clientX); } }
    wake();
});
function drawSplashes(now) {
    for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i], t = (now - s.born) / s.life;
        if (t >= 1) { splashes.splice(i, 1); continue; }
        const x = s.x + s.vx * t * (s.life / 1000), y = s.y + s.vy * t * (s.life / 1000) + 300 * t * t * (s.life / 1000);
        wctx.fillStyle = `rgba(255,255,255,${0.8 * (1 - t)})`; wctx.beginPath(); wctx.arc(x, y, 2.2 * (1 - t * 0.5), 0, 6.283); wctx.fill();
    }
}

// ─── The frame loop: the pond is always moving, slowly ───
let running = false, lastT = 0;
function wake() {
    if (running) return;
    running = true; lastT = performance.now();
    requestAnimationFrame(frame);
}
function frame(now) {
    const dt = Math.min(now - lastT, 50) / 1000;
    lastT = now;
    drawPond(now);
    drawCrumbs(now);
    for (let i = kois.length - 1; i >= 0; i--) {
        const k = kois[i];
        if (now - k.born >= k.life) { ripple(k.x, k.y, 0.5); kois.splice(i, 1); continue; }
        swim(k, dt);
        drawKoi(wctx, k, now);
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const t = (now - r.born) / r.life;
        if (t >= 1) { ripples.splice(i, 1); continue; }
        const e = 1 - Math.pow(1 - t, 2);
        for (let k = 0; k < 3; k++) {
            const rr = (e * 190 - k * 30) * r.big;
            if (rr <= 0) continue;
            wctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - t) * (1 - k * 0.3)})`;
            wctx.lineWidth = 1.6;
            wctx.beginPath();
            wctx.ellipse(r.x, r.y, rr, rr * 0.38, 0, 0, Math.PI * 2);
            wctx.stroke();
        }
    }

    drawSpecks(now);
    drawSplashes(now);
    drawPads(now);
    requestAnimationFrame(frame);
}

// ─── 2. The name, brushed stroke by stroke in real stroke order ────
// Each stroke's shape and centre line come from hanzi-writer-data
// (Kai, the regular script of brush calligraphy). A stroke only ever
// shows inside its own shape, revealed along its centre line, so the
// order is always right. Strokes are slightly see-through, so ink is
// darker where they cross, and the edges are roughened like wet ink.
const nameEl = document.querySelector('[data-hanzi]');
const SVGNS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs) => {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
};
async function drawName() {
    const chars = [...nameEl.dataset.hanzi];
    const S = Math.round(Math.min(window.innerWidth * 0.26, 160));
    const data = await Promise.all(chars.map((ch) =>
        fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encodeURIComponent(ch)}.json`)
            .then((r) => (r.ok ? r.json() : null)).catch(() => null)));
    if (data.some((d) => !d)) {
        // No stroke data (offline): show the name in the brush font
        nameEl.textContent = chars.join('');
        nameEl.classList.add('hanzi-text');
        return;
    }
    // Stroke order comes from the data file (Make Me a Hanzi). If one character needs a
    // different order, list it here as the file's stroke indexes in the order to draw them.
    // 阝 in 邬: the stroke file has hook-then-vertical (the textbook order). Natalie writes the
    // vertical first, so her name is written her way. Remove the entry to go back to the textbook.
    const ORDER = { '邬': [0, 1, 2, 3, 5, 4] };
    for (const [ci, ch] of chars.entries()) {
        const o = ORDER[ch];
        if (o && data[ci] && o.length === data[ci].strokes.length) data[ci] = { strokes: o.map((k) => data[ci].strokes[k]), medians: o.map((k) => data[ci].medians[k]) };
    }
    let t = reduce ? 0 : 250; // a beat before the brush touches paper
    chars.forEach((ch, ci) => {
        const svg = svgEl('svg', { viewBox: '0 0 1024 1024', width: S, height: S, class: 'zi', 'aria-hidden': 'true' });
        const defs = svgEl('defs', {});
        const sumi = svgEl('g', { filter: 'url(#sumi)' });
        const glyph = svgEl('g', { transform: 'translate(0 900) scale(1 -1)' });
        svg.append(defs, sumi); sumi.append(glyph); nameEl.append(svg);
        data[ci].strokes.forEach((shape, si) => {
            const id = `zi-${ci}-${si}`;
            const mask = svgEl('mask', { id, maskUnits: 'userSpaceOnUse', x: -100, y: -200, width: 1224, height: 1324 });
            const med = data[ci].medians[si];
            const line = svgEl('path', {
                d: `M${med.map((p) => p.join(' ')).join(' L')}`, fill: 'none', stroke: '#fff',
                'stroke-width': 190, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
                pathLength: 1, 'stroke-dasharray': '1 2', 'stroke-dashoffset': reduce ? 0 : 1,
            });
            mask.append(line); defs.append(mask);
            glyph.append(svgEl('path', { d: shape, mask: `url(#${id})`, class: 'zi-ink' }));
            if (reduce) return;
            let len = 0;
            for (let i = 1; i < med.length; i++) len += Math.hypot(med[i][0] - med[i - 1][0], med[i][1] - med[i - 1][1]);
            // A brush stroke: quick, eased in and out, longer strokes take a little longer
            const dur = 70 + len * 0.22;
            line.animate([
                { strokeDashoffset: 1, opacity: 0 },
                { strokeDashoffset: 0.97, opacity: 1, offset: 0.03 },
                { strokeDashoffset: 0, opacity: 1 },
            ], { duration: dur, delay: t, easing: 'cubic-bezier(.45, 0, .25, 1)', fill: 'both' });
            t += dur + 50;
        });
        t += 180;
    });
    await wait(t);
}
drawName().finally(() => {
    document.body.classList.add('named');
    scheduleKoi(1200); setTimeout(spawnKoi, 2400);
});

layPads();
if (reduce) { drawPond(0); drawPads(0); } else wake();
const yr = document.querySelector('[data-year]'); if (yr) yr.textContent = new Date().getFullYear();
