// Shared by every page: the header, the sticker tin, and small helpers.
// Pages say what they need with <header data-site-head="travel"> (the current
// section) or data-site-head="minimal" (just the sticker tin, for the homepage).
(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Where the site starts, worked out from this script's own address, so links work from any folder
    const root = document.currentScript.src.replace(/assets\/site\.js.*$/, '');

    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const param = (k) => new URLSearchParams(location.search).get(k);
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const stars = (n) => `<span class="stars" aria-label="${n} out of 5">${'★'.repeat(n)}<span aria-hidden="true" style="opacity:.25">${'★'.repeat(5 - n)}</span></span>`;
    const sample = (o) => (o && o.sample ? ' <span class="sample">sample</span>' : '');
    const date = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    // Counting the Chinese way: 正 has five strokes, one stroke per visit
    const TALLY = [[3, 3, 17, 3], [10, 3, 10, 17], [10, 10, 15.5, 10], [5, 9, 5, 17], [2, 17, 18, 17]];
    const tally = (n) => {
        const out = [];
        for (let left = n; left > 0; left -= 5) {
            const k = Math.min(5, left);
            out.push(`<svg class="tally" viewBox="0 0 20 20" aria-hidden="true">${TALLY.slice(0, k).map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`).join('')}</svg>`);
        }
        return `<span class="tallies" role="img" aria-label="${n} ${n === 1 ? 'visit' : 'visits'}">${out.join('')}</span>`;
    };
    window.SITE = { root, esc, param, reduce, MONTHS, stars, sample, date, tally };

    const SECTIONS = [
        ['travel', '旅', 'Travel'], ['reading', '读', 'Reading'], ['writing', '写', 'Writing'],
        ['projects', '作', 'Projects'], ['life', '生', 'Life'], ['play', '玩', 'Play'],
    ];
    const SEAL = `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="4" y="4" width="92" height="92" rx="5" fill="#b3362b"/><text x="50" y="53" text-anchor="middle" dominant-baseline="central" font-family="'LXGW WenKai TC', KaiTi, serif" font-weight="700" font-size="74" fill="#f4efe4">鄔</text></svg>`;
    const TIN = `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="9" width="26" height="19" rx="4" fill="#c8352b"/><rect x="2" y="6" width="28" height="6" rx="3" fill="#8f1f1a"/><circle cx="12" cy="19" r="3.4" fill="#f2c14e"/><rect x="18" y="16" width="7" height="6" rx="1.5" fill="#fbefdc" transform="rotate(12 21 19)"/></svg>`;

    // ─── Header ───
    const head = document.querySelector('[data-site-head]');
    if (head) {
        const current = head.dataset.siteHead;
        head.classList.add('site-head');
        // Past the homepage, the site is a sketchbook: graph paper, ballpoint, pixel-set headings
        if (head.dataset.siteHead !== 'minimal') {
            document.body.classList.add('sketchbook');
            document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
                <filter id="pixel-type" x="0" y="0" width="100%" height="100%">
                    <feFlood x="1" y="1" width="1.6" height="1.6"/><feComposite width="3" height="3"/><feTile result="dots"/>
                    <feComposite in="SourceGraphic" in2="dots" operator="in"/><feMorphology operator="dilate" radius="1.5"/>
                </filter>
                <filter id="pencil-wobble"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5"/></filter>
            </svg>`);
        }
        if (current === 'minimal') {
            head.classList.add('minimal');
            head.innerHTML = `<button class="tin-btn" type="button" aria-expanded="false">${TIN}<span>Stickers</span></button>`;
        } else {
            head.innerHTML = `
                <a class="home-seal" href="${root}index.html" aria-label="Home">${SEAL}</a>
                <nav class="site-nav" aria-label="Sections">
                    ${SECTIONS.map(([id, zi, label]) => `<a href="${root}${id}/index.html"${id === current ? ' aria-current="page"' : ''}><span aria-hidden="true">${zi}</span><span>${label}</span></a>`).join('')}
                </nav>
                <button class="tin-btn" type="button" aria-expanded="false">${TIN}<span>Stickers</span></button>`;
        }
    }

    // ─── Stickers ───
    // The white die-cut edge every sticker gets: grow the shape, fill it white, put the drawing on top
    document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
        <filter id="die-cut" x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology in="SourceAlpha" operator="dilate" radius="3.2" result="grown"/>
            <feFlood flood-color="#ffffff"/><feComposite in2="grown" operator="in" result="edge"/>
            <feMerge><feMergeNode in="edge"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter></svg>`);
    const STICKERS = window.STICKERS || [];
    const byId = Object.fromEntries(STICKERS.map((s) => [s.id, s]));
    const draw = (s) => `<svg viewBox="0 0 64 64" aria-hidden="true">${s.svg}</svg>`;

    const layer = document.createElement('div');
    layer.className = 'sticker-layer';
    document.body.append(layer);

    // Stickers stay where each visitor put them, per page, in their own browser only
    const KEY = `stickers:${location.pathname}`;
    const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
    const save = () => {
        const list = [...layer.children].filter((el) => el.dataset.placed).map((el) => ({ id: el.dataset.id, x: +el.dataset.x, y: +el.dataset.y, rot: +el.dataset.rot }));
        try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage blocked: stickers last until the page closes */ }
    };
    // x is a share of the page width, so stickers keep their place when the window is resized
    const place = (el, x, y) => {
        el.dataset.x = x; el.dataset.y = y;
        el.style.left = `${x * 100}%`; el.style.top = `${y}px`;
    };
    const pageW = () => document.documentElement.scrollWidth;

    // ─── The peel ───
    // A sticker is two layers: the front (the part still stuck down) and the flap (the part
    // lifted off, folded back so its white backing shows). Pulling corner C to point P folds
    // the sticker along the line halfway between them, at right angles to C→P.
    const tween = (ms, ease, fn) => new Promise((done) => {
        if (reduce || ms <= 0) { fn(1); done(); return; }
        const t0 = performance.now();
        const tick = (now) => {
            const u = Math.min(1, (now - t0) / ms);
            fn(ease(u));
            if (u < 1) requestAnimationFrame(tick); else done();
        };
        requestAnimationFrame(tick);
    });
    const easeOut = (u) => 1 - Math.pow(1 - u, 3);
    const easeInOut = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
    const settle = (u) => { const c = 1.6; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); }; // overshoots a touch, then rests

    // Keep the part of a polygon on one side of a line (Sutherland–Hodgman, one edge)
    function cut(poly, F, n, keepPositive) {
        const side = (p) => ((p[0] - F[0]) * n[0] + (p[1] - F[1]) * n[1]) * (keepPositive ? 1 : -1);
        const out = [];
        poly.forEach((a, i) => {
            const b = poly[(i + 1) % poly.length], sa = side(a), sb = side(b);
            if (sa >= 0) out.push(a);
            if ((sa >= 0) !== (sb >= 0)) { const t = sa / (sa - sb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
        });
        return out;
    }
    const poly = (pts) => (pts.length < 3 ? 'polygon(0 0, 0 0, 0 0)' : `polygon(${pts.map((p) => `${p[0].toFixed(2)}px ${p[1].toFixed(2)}px`).join(',')})`);

    function setPeel(el, C, P) {
        const front = el.firstElementChild, flap = el.lastElementChild;
        const S = el.offsetWidth, dx = C[0] - P[0], dy = C[1] - P[1], d = Math.hypot(dx, dy);
        if (d < 0.5) { front.style.clipPath = ''; flap.style.display = 'none'; el.classList.remove('peeling'); return; }
        el.classList.add('peeling');
        const n = [dx / d, dy / d], F = [(C[0] + P[0]) / 2, (C[1] + P[1]) / 2];
        // Let the die-cut edge and the drawing's overhang stay visible: work in a box a little bigger than the sticker
        const m = S * 0.08, box = [[-m, -m], [S + m, -m], [S + m, S + m], [-m, S + m]];
        front.style.clipPath = poly(cut(box, F, n, false));
        flap.style.display = 'block';
        flap.style.clipPath = poly(cut(box, F, n, true));
        // Reflect the lifted part across the fold line
        const k = 2 * (F[0] * n[0] + F[1] * n[1]);
        flap.style.transform = `matrix(${1 - 2 * n[0] * n[0]}, ${-2 * n[0] * n[1]}, ${-2 * n[0] * n[1]}, ${1 - 2 * n[1] * n[1]}, ${k * n[0]}, ${k * n[1]})`;
        // The further it's pulled, the more light catches the backing
        flap.style.setProperty('--lift', Math.min(1, d / S).toFixed(3));
    }

    // Where a page point sits inside the sticker's own (rotated) square
    function local(el, pageX, pageY) {
        const r = el.getBoundingClientRect(), S = el.offsetWidth, k = +el.style.getPropertyValue('--s') || 1;
        const cx = r.left + r.width / 2 + scrollX, cy = r.top + r.height / 2 + scrollY;
        const a = -(+el.dataset.rot || 0) * Math.PI / 180, x = (pageX - cx) / k, y = (pageY - cy) / k;
        return [x * Math.cos(a) - y * Math.sin(a) + S / 2, x * Math.sin(a) + y * Math.cos(a) + S / 2];
    }
    const corners = (S) => [[0, 0], [S, 0], [S, S], [0, S]];
    // Where the drawing actually is inside its square (most stickers are round, so the square's corners are empty)
    function artBox(el) {
        if (!el._art) {
            const S = el.offsetWidth, k = S / 64, b = el.querySelector('.st-front svg').getBBox(), m = 2;
            el._art = [(b.x - m) * k, (b.y - m) * k, (b.x + b.width + m) * k, (b.y + b.height + m) * k];
        }
        return el._art;
    }
    // The edge of the drawing in the direction of p, seen from its middle: that's where the peel starts
    function edgePoint(el, p) {
        const [x1, y1, x2, y2] = artBox(el), cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
        let dx = p[0] - cx, dy = p[1] - cy;
        if (Math.hypot(dx, dy) < 1) { const a = Math.random() * Math.PI * 2; dx = Math.cos(a); dy = Math.sin(a); }
        const t = Math.min(Math.abs((dx > 0 ? x2 - cx : x1 - cx) / (dx || 1e-9)), Math.abs((dy > 0 ? y2 - cy : y1 - cy) / (dy || 1e-9)));
        return [cx + dx * t, cy + dy * t];
    }

    function makeSticker(id, x, y, rot) {
        const s = byId[id];
        if (!s) return null;
        const el = document.createElement('div');
        el.className = 'sticker';
        el.dataset.id = id; el.dataset.rot = rot;
        el.style.setProperty('--rot', `${rot}deg`);
        el.setAttribute('role', 'img'); el.setAttribute('aria-label', `${s.name} sticker`);
        el.title = 'Peel it up by a corner to move it. Double-click to peel it off.';
        el.innerHTML = `<div class="st-front">${draw(s)}</div><div class="st-flap" style="display:none">${draw(s)}</div>`;
        place(el, x, y);
        layer.append(el);
        el.addEventListener('pointerdown', (e) => { if (e.button === 0) grab(e, el); });
        el.addEventListener('dblclick', () => peelOff(el));
        return el;
    }

    // Press it down: it lands with a corner still lifted, and that corner smooths flat
    async function stickDown(el, C) {
        const [x1, y1, x2, y2] = artBox(el), mid = [(x1 + x2) / 2, (y1 + y2) / 2];
        C = C || edgePoint(el, [mid[0] + Math.random() - 0.5, mid[1] + Math.random() - 0.5]);
        const P0 = [C[0] + (mid[0] - C[0]) * 0.95, C[1] + (mid[1] - C[1]) * 0.95];
        el.classList.add('pressing');
        await tween(420, settle, (u) => setPeel(el, C, [P0[0] + (C[0] - P0[0]) * Math.min(1, u), P0[1] + (C[1] - P0[1]) * Math.min(1, u)]));
        setPeel(el, C, C);
        el.classList.remove('pressing');
        el.dataset.placed = '1';
        save();
    }
    // Peel it off for good: the corner lifts and the whole sticker folds over itself, then it's gone
    async function peelOff(el) {
        const S = el.offsetWidth, C = corners(S)[1];
        delete el.dataset.placed; save();
        el.style.pointerEvents = 'none';
        const end = [S - C[0] * 1.15 - S * 0.15, S - C[1] * 1.15 + S * 0.15];
        await tween(420, easeInOut, (u) => setPeel(el, C, [C[0] + (end[0] - C[0]) * u, C[1] + (end[1] - C[1]) * u]));
        el.classList.add('gone');
        await tween(200, easeOut, () => {});
        el.remove();
    }

    // ─── Grabbing ───
    // Press on a sticker and the nearest corner follows your pointer. Pull it far enough and the
    // sticker comes away; let go before that and the corner lies back down.
    let activeTin = null;
    function grab(e, el, fromTin) {
        e.preventDefault();
        const [x1, y1, x2, y2] = artBox(el), S = Math.max(x2 - x1, y2 - y1);
        const C = edgePoint(el, local(el, e.pageX, e.pageY));
        let startRot = +el.dataset.rot || 0;
        let free = false, offset = [0, 0], lastX = e.pageX, moved = 0;
        const sx = e.pageX, sy = e.pageY;
        layer.classList.add('busy');
        const move = (ev) => {
            moved = Math.max(moved, Math.hypot(ev.pageX - sx, ev.pageY - sy));
            if (!free) {
                const p = local(el, ev.pageX, ev.pageY);
                const pull = Math.hypot(p[0] - C[0], p[1] - C[1]);
                setPeel(el, C, pull < 3 ? C : p);
                if (pull > S * 0.62) {
                    // It comes away: the flap springs flat as the sticker lifts off the page
                    free = true;
                    el.style.removeProperty('--s');
                    if (el.dataset.landRot) { startRot = +el.dataset.landRot; el.dataset.rot = startRot; delete el.dataset.landRot; }
                    el.classList.add('lifted');
                    const r = el.getBoundingClientRect();
                    offset = [ev.pageX - (r.left + r.width / 2 + scrollX), ev.pageY - (r.top + r.height / 2 + scrollY)];
                    tween(160, easeOut, (u) => { offset = offset.map((o) => o * (1 - u)); setPeel(el, C, [p[0] + (C[0] - p[0]) * u, p[1] + (C[1] - p[1]) * u]); });
                }
                return;
            }
            const lean = Math.max(-14, Math.min(14, (ev.pageX - lastX) * 1.5));
            lastX = ev.pageX;
            el.style.setProperty('--rot', `${startRot + lean}deg`);
            place(el, (ev.pageX - offset[0]) / pageW(), ev.pageY - offset[1]);
        };
        const up = (ev) => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
            window.removeEventListener('pointercancel', up);
            layer.classList.remove('busy');
            if (!free) {
                if (fromTin) { el.remove(); if (moved > 6) fromTin.dataset.dragged = '1'; return; }
                // Not pulled far enough: the corner lies back down
                tween(220, settle, (u) => { const p = local(el, ev.pageX, ev.pageY); setPeel(el, C, [p[0] + (C[0] - p[0]) * Math.min(1, u), p[1] + (C[1] - p[1]) * Math.min(1, u)]); }).then(() => setPeel(el, C, C));
                return;
            }
            if (fromTin) fromTin.dataset.dragged = '1';
            el.classList.remove('lifted');
            el.style.setProperty('--rot', `${startRot}deg`);
            if (overTin(ev)) { el.remove(); save(); return; } // dropped back in the tin: put away
            stickDown(el, C);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
        window.addEventListener('pointercancel', up);
    }

    // ─── The tin ───
    let tin = null;
    const btn = head?.querySelector('.tin-btn');
    const overTin = (ev) => tin && (() => { const r = tin.getBoundingClientRect(); return ev.clientX > r.left && ev.clientX < r.right && ev.clientY > r.top && ev.clientY < r.bottom; })();
    function openTin() {
        tin = document.createElement('div');
        tin.className = 'tin';
        tin.setAttribute('role', 'dialog'); tin.setAttribute('aria-label', 'Sticker tin');
        tin.innerHTML = `
            <h2>Sticker tin</h2>
            <p>Peel a sticker off by its corner and stick it anywhere on the page. Lift it again to move it, or double-click to peel it off. They stay for you on this page.</p>
            <div class="tin-grid">${STICKERS.map((s) => `<button class="tin-item" type="button" data-id="${s.id}" aria-label="Stick ${esc(s.name)}" title="${esc(s.name)}">${draw(s)}</button>`).join('')}</div>
            <div class="tin-actions"><button type="button" data-clear>Peel all off</button><button type="button" data-close>Close</button></div>`;
        document.body.append(tin);
        btn?.setAttribute('aria-expanded', 'true');
        tin.querySelector('[data-close]').addEventListener('click', closeTin);
        tin.querySelector('[data-clear]').addEventListener('click', () => [...layer.children].forEach((el, i) => setTimeout(() => peelOff(el), i * 70)));
        tin.querySelectorAll('.tin-item').forEach((item) => {
            // Keyboard or a plain tap: stick one somewhere in view
            item.addEventListener('click', () => {
                if (item.dataset.dragged) { delete item.dataset.dragged; return; }
                const el = makeSticker(item.dataset.id, 0.15 + Math.random() * 0.6, scrollY + innerHeight * (0.3 + Math.random() * 0.4), Math.round(Math.random() * 30 - 15));
                stickDown(el);
            });
            // Pointer: a copy sits exactly over the one in the tin, and peels off the sheet with you
            item.addEventListener('pointerdown', (e) => {
                if (e.button !== 0) return;
                const r = item.getBoundingClientRect();
                const el = makeSticker(item.dataset.id, (r.left + r.width / 2 + scrollX) / pageW(), r.top + r.height / 2 + scrollY, 0);
                el.style.setProperty('--s', (r.width * 0.86 / 84).toFixed(3));
                el.dataset.landRot = Math.round(Math.random() * 24 - 12); // the angle it takes once it's free
                grab(e, el, item);
            });
        });
        tin.querySelector('.tin-item')?.focus();
    }
    function closeTin() {
        tin?.remove(); tin = null;
        btn?.setAttribute('aria-expanded', 'false');
        btn?.focus();
    }
    btn?.addEventListener('click', () => (tin ? closeTin() : openTin()));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && tin) closeTin(); });

    // Stickers wait for fonts (福 and 中 are drawn with them) and the page's own layout
    const restore = () => load().forEach((s) => { const el = makeSticker(s.id, s.x, s.y, s.rot); if (el) el.dataset.placed = '1'; });
    (document.fonts?.ready || Promise.resolve()).then(restore);
})();
