const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand = (a, b) => a + Math.random() * (b - a);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Ink colours from A Thousand Li of Rivers and Mountains, weighted so
// plain ink is most common and ochre is rare
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

// ─── 1. The painting ───────────────────────────────────────────────
// Two canvases: "paint" is the sheet of paper that keeps everything ever
// drawn; "water" is redrawn every frame for ink still spreading and ripples.
// Ink is only pressed into the paper once a drop has finished spreading:
// adding a sliver of colour every frame is too fine for the canvas to
// store, and the colours drift.
const paint = document.getElementById('paint');
const water = document.getElementById('water');
const pctx = paint.getContext('2d', { alpha: false });
const wctx = water.getContext('2d');
let W = 0, H = 0, dpr = 1;

function size() {
    let snapshot = null;
    if (W) { // W is 0 until the first sizing; a new canvas is 300px wide but blank
        snapshot = document.createElement('canvas');
        snapshot.width = paint.width; snapshot.height = paint.height;
        snapshot.getContext('2d').drawImage(paint, 0, 0);
    }
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = paint.clientWidth; H = paint.clientHeight;
    for (const c of [paint, water]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    wctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Keep the painting when the window changes size
    if (snapshot) {
        pctx.save(); pctx.setTransform(1, 0, 0, 1, 0, 0);
        pctx.drawImage(snapshot, 0, 0, paint.width, paint.height);
        pctx.restore();
    } else {
        paper();
    }
}

// A fresh sheet: the paper colour plus a faint fibre grain
function paper() {
    pctx.fillStyle = '#f4efe4';
    pctx.fillRect(0, 0, W, H);
    const tile = document.createElement('canvas');
    tile.width = tile.height = 160;
    const t = tile.getContext('2d');
    for (let i = 0; i < 2600; i++) {
        t.fillStyle = `rgba(90,76,50,${rand(0.02, 0.07)})`;
        t.fillRect(rand(0, 160), rand(0, 160), rand(0.5, 1.6), rand(0.5, 1.6));
    }
    pctx.fillStyle = pctx.createPattern(tile, 'repeat');
    pctx.fillRect(0, 0, W, H);
}
size();
// Only on width changes: mobile toolbars change the height while scrolling
window.addEventListener('resize', () => { if (paint.clientWidth !== W) size(); });

// Smooth random 1D noise, for mountain ridges
function noise() {
    const pts = Array.from({ length: 32 }, Math.random);
    return (x) => {
        const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
        const a = pts[i & 31], b = pts[(i + 1) & 31];
        return a + (b - a) * u;
    };
}

// The brush: a centre stroke plus two thinner bristle strokes.
// Fast moves make thin lines, slow ones pool ink.
const brush = { col: pickColour(), x: 0, y: 0, mx: 0, my: 0, t: 0, active: false, travel: 0 };

// A drop of ink: grows fast then slows (ease out) and its wobbly edge
// creeps. The middle is darker than the rim, and once it stops it is
// pressed into the paper with a faint dried edge.
const drops = [];
function drop(x, y, R, { alpha = 0.05, life = 2600, col = brush.col } = {}) {
    if (drops.length > 260) drops.shift();
    const harm = [2, 3, 5, 7].map((k) => ({ k, a: rand(0.02, 0.08) * (k < 4 ? 1.5 : 1), p: rand(0, 6.28), s: rand(-0.6, 0.6) }));
    drops.push({ x, y, R, alpha, life: reduce ? 300 : life, col, harm, born: performance.now() });
    wake();
}
function blob(ctx, d, r, t) {
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
        const th = (i / 40) * Math.PI * 2;
        let m = 1;
        for (const h of d.harm) m += h.a * Math.sin(h.k * th + h.p + h.s * t);
        const px = d.x + Math.cos(th) * r * m, py = d.y + Math.sin(th) * r * m;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath();
}
function ink(ctx, d, r, t) {
    blob(ctx, d, r, t);
    const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, r * 1.1);
    g.addColorStop(0, rgba(d.col, d.alpha * 2.2));
    g.addColorStop(0.65, rgba(d.col, d.alpha * 1.4));
    g.addColorStop(1, rgba(d.col, d.alpha * 0.9));
    ctx.fillStyle = g;
    ctx.fill();
}

// Ripples on the water: flattened rings that spread and fade
const ripples = [];
function ripple(x, y, big = 1) {
    if (reduce) return;
    ripples.push({ x, y, big, born: performance.now(), life: 1900 });
    wake();
}

function stroke(x0, y0, cx, cy, x1, y1, w, col) {
    const nx = -(y1 - y0), ny = x1 - x0, len = Math.hypot(nx, ny) || 1;
    pctx.lineCap = 'butt'; // round caps overlap and leave beads where segments meet
    for (let i = -1; i <= 1; i++) {
        const off = i * w * 0.4, ox = (nx / len) * off, oy = (ny / len) * off;
        pctx.strokeStyle = rgba(col, i === 0 ? 0.07 : 0.045);
        pctx.lineWidth = i === 0 ? w : w * 0.4;
        pctx.beginPath();
        pctx.moveTo(x0 + ox, y0 + oy);
        pctx.quadraticCurveTo(cx + ox, cy + oy, x1 + ox, y1 + oy);
        pctx.stroke();
    }
}

window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return; // on touch, taps drop ink instead
    const now = performance.now(), x = e.clientX, y = e.clientY;
    const gap = now - brush.t;
    if (!brush.active || gap > 700) {
        // A pause lifts the brush; the next stroke picks up a new colour
        if (brush.active) brush.col = pickColour();
        Object.assign(brush, { active: true, x, y, mx: x, my: y, t: now, travel: 0 });
        return;
    }
    const dist = Math.hypot(x - brush.x, y - brush.y);
    if (dist < 2) return;
    const speed = dist / Math.max(gap, 1);
    const w = Math.max(1.2, 9 - speed * 4.5);
    const mx = (brush.x + x) / 2, my = (brush.y + y) / 2;
    stroke(brush.mx, brush.my, brush.x, brush.y, mx, my, w, brush.col);
    brush.travel += dist;
    // Ink pools only where the brush moves slowly
    if (brush.travel > 24 && speed < 0.5) {
        brush.travel = 0;
        drop(x + rand(-4, 4), y + rand(-4, 4), rand(6, 12) + 26 / (1 + speed * 3), { alpha: 0.03, life: rand(1800, 3200) });
    }
    Object.assign(brush, { x, y, mx, my, t: now });
});

// A click drops a big splash of ink with a few spatters around it
function splash(x, y) {
    brush.col = pickColour();
    const R = rand(45, 90);
    drop(x, y, R, { alpha: 0.065, life: rand(2600, 3600) });
    for (let i = 0, n = rand(4, 8) | 0; i < n; i++) {
        const a = rand(0, 6.28), d = R * rand(1.15, 1.9);
        drop(x + Math.cos(a) * d, y + Math.sin(a) * d, rand(3, 10), { alpha: 0.08, life: rand(900, 1600) });
    }
    ripple(x, y, 1.3);
}
window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button')) return;
    splash(e.clientX, e.clientY);
});

// Scrolling stirs the water, and now and then leaves a pale wash
let lastY = window.scrollY, rippleAcc = 0, washAcc = 0;
window.addEventListener('scroll', () => {
    const d = Math.abs(window.scrollY - lastY);
    lastY = window.scrollY; rippleAcc += d; washAcc += d;
    if (rippleAcc > 160) { rippleAcc = 0; ripple(rand(0.1, 0.9) * W, rand(0.55, 0.95) * H, rand(0.7, 1.3)); }
    if (washAcc > 520) { washAcc = 0; drop(rand(0, W), rand(0.3, 1) * H, rand(110, 200), { alpha: 0.016, life: rand(4000, 6000), col: pickColour() }); }
}, { passive: true });

// Mountains in the blue-green style of the scroll, different on every
// visit, unrolled left to right when the page opens
const land = { img: null, done: 0, start: 0, active: false };
function landscape() {
    const off = document.createElement('canvas');
    off.width = paint.width; off.height = paint.height;
    const c = off.getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const layers = [
        { base: 0.6, amp: 0.2, f: 1.6, col: [127, 179, 163], a: 0.17 },
        { base: 0.72, amp: 0.15, f: 2.4, col: [61, 139, 125], a: 0.13 },
        { base: 0.84, amp: 0.1, f: 3.2, col: [47, 93, 140], a: 0.11 },
    ];
    for (const L of layers) {
        const n = noise(), shift = rand(0, 20);
        const top = H * (L.base - L.amp);
        c.beginPath(); c.moveTo(0, H);
        for (let x = 0; x <= W + 4; x += 4) {
            const u = (x / W) * L.f + shift;
            const h = Math.pow(n(u) * 0.6 + n(u * 2.7 + 9) * 0.3 + n(u * 7 + 3) * 0.1, 1.4);
            c.lineTo(x, H * L.base - H * L.amp * (h * 1.8 - 0.2));
        }
        c.lineTo(W, H); c.closePath();
        // Mist at the foot of each ridge
        const g = c.createLinearGradient(0, top, 0, H * (L.base + 0.22));
        g.addColorStop(0, rgba(L.col, L.a));
        g.addColorStop(1, rgba(L.col, 0));
        c.fillStyle = g; c.fill();
    }
    Object.assign(land, { img: off, done: 0, start: performance.now(), active: true });
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

function spawnKoi() {
    if (reduce || document.hidden || kois.length >= 2) return;
    const look = KOI[(Math.random() * KOI.length) | 0];
    const x = rand(0.12, 0.88) * W, y = rand(0.15, 0.88) * H;
    kois.push({
        x, y, look, L: rand(70, 100), heading: rand(0, 6.28), turn: rand(-0.3, 0.3),
        speed: rand(28, 42), phase: rand(0, 6), born: performance.now(), life: rand(8000, 12000),
        spots: Array.from({ length: look.spots.length ? rand(2, 4) | 0 : 0 }, () => ({
            u: rand(0.08, 0.7), side: rand(-0.5, 0.5), r: rand(0.08, 0.15),
            c: look.spots[(Math.random() * look.spots.length) | 0],
        })),
    });
    ripple(x, y, 0.6);
    wake();
}
function scheduleKoi(delay = rand(6000, 13000)) {
    setTimeout(() => { spawnKoi(); scheduleKoi(); }, delay);
}

const angleTo = (from, to) => ((to - from + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
function swim(k, dt) {
    k.turn = Math.max(-0.6, Math.min(0.6, k.turn + rand(-1, 1) * dt * 0.8));
    let speed = k.speed;
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
    // Stay in the pond
    if (k.x < 70 || k.x > W - 70 || k.y < 70 || k.y > H - 70) {
        k.heading += angleTo(k.heading, Math.atan2(H / 2 - k.y, W / 2 - k.x)) * dt * 1.6;
    }
    k.heading += k.turn * dt;
    k.x += Math.cos(k.heading) * speed * dt;
    k.y += Math.sin(k.heading) * speed * dt;
    k.phase += dt * (3.5 + speed * 0.06);
}

function drawKoi(ctx, k, now) {
    const age = now - k.born;
    const vis = Math.max(0, Math.min(1, age / 1100, (k.life - age) / 1400));
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

// ─── The frame loop: runs only while something is moving ───
let running = false, lastT = 0;
function wake() {
    if (running) return;
    running = true; lastT = performance.now();
    requestAnimationFrame(frame);
}
function frame(now) {
    const dt = Math.min(now - lastT, 50) / 1000;
    lastT = now;
        if (land.active) {
        const t = reduce ? 1 : Math.min(1, (now - land.start) / 2800);
        const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const to = Math.round(e * land.img.width);
        if (to > land.done) {
            pctx.save(); pctx.setTransform(1, 0, 0, 1, 0, 0);
            pctx.drawImage(land.img, land.done, 0, to - land.done, land.img.height, land.done, 0, to - land.done, land.img.height);
            pctx.restore();
            land.done = to;
        }
        if (t >= 1) land.active = false;
    }

    wctx.clearRect(0, 0, W, H);
    for (let i = kois.length - 1; i >= 0; i--) {
        const k = kois[i];
        if (now - k.born >= k.life) { ripple(k.x, k.y, 0.5); kois.splice(i, 1); continue; }
        swim(k, dt);
        drawKoi(wctx, k, now);
    }
    for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        const t = Math.min(1, (now - d.born) / d.life);
        if (t < 1) {
            ink(wctx, d, d.R * (0.2 + 0.8 * (1 - Math.pow(1 - t, 3))), t);
            continue;
        }
        ink(pctx, d, d.R, 1);
        pctx.strokeStyle = rgba(d.col, d.alpha * 1.6);
        pctx.lineWidth = 1.1;
        pctx.stroke();
        drops.splice(i, 1);
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const t = (now - r.born) / r.life;
        if (t >= 1) { ripples.splice(i, 1); continue; }
        const e = 1 - Math.pow(1 - t, 2);
        for (let k = 0; k < 3; k++) {
            const rr = (e * 150 - k * 26) * r.big;
            if (rr <= 0) continue;
            wctx.strokeStyle = rgba([31, 42, 48], 0.2 * (1 - t) * (1 - k * 0.3));
            wctx.lineWidth = 1;
            wctx.beginPath();
            wctx.ellipse(r.x, r.y, rr, rr * 0.38, 0, 0, Math.PI * 2);
            wctx.stroke();
        }
    }

    if (land.active || drops.length || ripples.length || kois.length) requestAnimationFrame(frame);
    else running = false;
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
            const dur = 40 + len * 0.16;
            line.animate([
                { strokeDashoffset: 1, opacity: 0 },
                { strokeDashoffset: 0.97, opacity: 1, offset: 0.03 },
                { strokeDashoffset: 0, opacity: 1 },
            ], { duration: dur, delay: t, easing: 'cubic-bezier(.45, 0, .25, 1)', fill: 'both' });
            t += dur + 20;
        });
        t += 90;
    });
    await wait(t);
}
drawName().finally(() => {
    document.body.classList.add('named');
    scheduleKoi(2500);
    setTimeout(startGreeting, 1600);
});

// ─── 3. Hello in every language I speak ────────────────────────────
const GREETINGS = ['Hello', 'Apa khabar', '你好', 'Hoi'];
const greet = document.querySelector('.greet');
const gWord = greet.querySelector('.greet-word');
function startGreeting() {
    let i = 0;
    setInterval(async () => {
        i = (i + 1) % GREETINGS.length;
        greet.classList.add('out');
        await wait(reduce ? 0 : 450);
        gWord.textContent = GREETINGS[i];
        greet.classList.remove('out');
    }, 2800);
}

// ─── 4. Sections soak in as they scroll into view ──────────────────
const seen = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); seen.unobserve(e.target); }
    });
}, { threshold: 0.15 });
document.querySelectorAll('.bleed').forEach((el) => seen.observe(el));

// ─── Start ─────────────────────────────────────────────────────────
landscape();
// If the browser drops the canvas (low memory, GPU reset), paint new mountains
paint.addEventListener('contextrestored', () => { paper(); landscape(); });
document.querySelector('[data-year]').textContent = new Date().getFullYear();
