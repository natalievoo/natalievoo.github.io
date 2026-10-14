// Chasing chickens: a courtyard in the village, a girl, and chickens that will not be caught.
// Everything is drawn at 200 × 125 pixels and scaled up whole, so every pixel stays crisp.
(() => {
    const W = 200, H = 125;
    const ROUND = 45; // seconds
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const stage = document.getElementById('stage');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (s) => document.querySelector(s);
    const rand = (a, b) => a + Math.random() * (b - a);

    // ─── Sprites: one letter per pixel ───
    const PAL = {
        H: '#22191a', S: '#f1c9a5', K: '#22191a', R: '#d23c2f', B: '#3d5f95', P: '#f2a19b',
        W: '#fbf6ec', w: '#d9d0c0', O: '#e8a33a', r: '#d23c2f', Y: '#f6d55c', y: '#e3b53a', N: '#b5794a', n: '#8a5732',
    };
    const GIRL = {
        idle: ['...HHHH...', '..HHHHHH..', '.HHHHHHHH.', 'HHSSSSSSHH', 'HHSKSSKSHH', '.HSPSSPSH.', '..SSSSSS..', '..RRRRRR..', '.SRRRRRRS.', '.SRRRRRRS.', '..BBBBBB..', '..BB..BB..', '..BB..BB..', '..KK..KK..'],
        run1: ['...HHHH...', '..HHHHHH..', '.HHHHHHHH.', 'HHSSSSSSHH', 'HHSKSSKSHH', '.HSPSSPSH.', '..SSSSSS..', '.SRRRRRR..', '..RRRRRRS.', '..RRRRRR..', '..BBBBBB..', '.BB...BB..', 'BB.....BB.', 'K.......KK'],
        run2: ['...HHHH...', '..HHHHHH..', '.HHHHHHHH.', 'HHSSSSSSHH', 'HHSKSSKSHH', '.HSPSSPSH.', '..SSSSSS..', '..RRRRRRS.', '.SRRRRRR..', '..RRRRRR..', '..BBBBBB..', '...BBBB...', '...BB.BB..', '..KK..KK..'],
    };
    const HEN = {
        walk1: ['......RR..', '.....WWWR.', '.....WKWOO', '.....WWWr.', 'W...WWWW..', 'WWWWWWWW..', '.WwwwWWW..', '..WWWWW...', '...O..O...'],
        walk2: ['......RR..', '.....WWWR.', '.....WKWOO', '.....WWWr.', 'W...WWWW..', 'WWWWWWWW..', '.WwwwWWW..', '..WWWWW...', '..O....O..'],
        peck: ['..........', '..........', 'W.........', 'WWWWWW.RR.', '.WWWWWWWWR', '.WwwwWWKWO', '..WWWWWWOO', '...WWWW...', '...O..O...'],
        flap: ['..W...RR..', '.WW..WWWR.', 'WWW..WKWOO', '.WWW.WWWr.', 'W.WWWWWW..', 'WWWWWWWW..', '.WWWWWWW..', '..WWWWW...', '..O....O..'],
    };
    const CHICK = {
        walk1: ['..YY..', '.YYKO.', 'YYYY..', 'YyYYY.', '.YYY..', '.O.O..'],
        walk2: ['..YY..', '.YYKO.', 'YYYY..', 'YyYYY.', '.YYY..', 'O...O.'],
        peck: ['......', '..YY..', 'YYYYKO', 'YyYYY.', '.YYY..', '.O.O..'],
        flap: ['Y.YY..', 'YYYKO.', 'YYYY..', 'YyYYY.', '.YYY..', 'O...O.'],
    };
    // Bake each sprite (and its mirror) into a tiny canvas once
    function bake(rows, swap = {}) {
        const make = (flip) => {
            const c = document.createElement('canvas');
            c.width = rows[0].length; c.height = rows.length;
            const x = c.getContext('2d');
            rows.forEach((r, j) => [...r].forEach((ch, i) => {
                const col = PAL[swap[ch] || ch];
                if (ch === '.' || !col) return;
                x.fillStyle = col; x.fillRect(flip ? r.length - 1 - i : i, j, 1, 1);
            }));
            return c;
        };
        return { r: make(false), l: make(true) };
    }
    const bakeSet = (set, swap) => Object.fromEntries(Object.entries(set).map(([k, v]) => [k, bake(v, swap)]));
    const SPR = {
        girl: bakeSet(GIRL),
        hen: bakeSet(HEN),
        brown: bakeSet(HEN, { W: 'N', w: 'n' }),
        chick: bakeSet(CHICK),
    };

    // ─── The courtyard, painted once ───
    const YARD = { x0: 6, x1: 194, y0: 50, y1: 119 };
    const OBST = [{ x: 34, y: 82, r: 11 }, { x: 168, y: 74, r: 12 }]; // the well, the haystack
    const bg = document.createElement('canvas');
    bg.width = W; bg.height = H;
    (function paint() {
        const b = bg.getContext('2d');
        const R = (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; })();
        const fill = (c, x, y, w, h) => { b.fillStyle = c; b.fillRect(x, y, w, h); };
        // Packed earth with grit
        fill('#c9a77c', 0, 40, W, H - 40);
        for (let i = 0; i < 900; i++) fill(R() < 0.5 ? '#bb9870' : '#d6b78d', (R() * W) | 0, 40 + ((R() * (H - 40)) | 0), 1, 1);
        // Grass along the front edge and in the corners
        for (let i = 0; i < 160; i++) { const x = (R() * W) | 0, y = H - 1 - ((R() * 6) | 0); fill(R() < 0.5 ? '#6f9a4f' : '#5c8740', x, y, 1, 1 + ((R() * 2) | 0)); }
        // The house: tiled roof, whitewashed wall
        fill('#e9e0cf', 0, 12, W, 34);
        fill('#d8ccb6', 0, 44, W, 2);
        fill('#56616b', 0, 4, W, 9);
        for (let x = 0; x < W; x += 4) { fill('#46505a', x, 4, 1, 9); fill('#6b7680', x + 2, 4, 1, 9); }
        fill('#3a434b', 0, 12, W, 2);
        fill('#56616b', 0, 2, W, 2);
        // Lattice windows
        for (const wx of [24, 152]) {
            fill('#5a3a26', wx, 20, 24, 16); fill('#f4ead6', wx + 2, 22, 20, 12);
            for (let i = 0; i < 20; i += 4) fill('#5a3a26', wx + 2 + i, 22, 1, 12);
            for (let j = 0; j < 12; j += 4) fill('#5a3a26', wx + 2, 22 + j, 20, 1);
        }
        // The door, red couplets either side, 福 upside down on the door
        fill('#4a2c1c', 88, 18, 24, 28); fill('#6a412a', 90, 20, 9, 26); fill('#6a412a', 101, 20, 9, 26);
        fill('#d23c2f', 82, 18, 4, 26); fill('#d23c2f', 114, 18, 4, 26); fill('#d23c2f', 86, 14, 28, 3);
        for (let j = 0; j < 6; j++) { fill('#f2c14e', 83, 20 + j * 4, 2, 2); fill('#f2c14e', 115, 20 + j * 4, 2, 2); }
        for (let i = 0; i < 5; i++) fill('#d23c2f', 98 - i, 26 + i, 4 + i * 2 - 2, 1);
        for (let i = 0; i < 4; i++) fill('#d23c2f', 95 + i, 31 + i, 10 - i * 2, 1);
        fill('#f2c14e', 99, 29, 2, 3);
        // Lanterns
        for (const lx of [72, 128]) {
            fill('#3a2a20', lx + 2, 13, 1, 4);
            fill('#d23c2f', lx, 17, 5, 6); fill('#e85a3e', lx + 1, 18, 1, 4); fill('#f2c14e', lx, 16, 5, 1); fill('#f2c14e', lx, 23, 5, 1); fill('#f2c14e', lx + 2, 24, 1, 2);
        }
        // Step and shadow along the wall
        fill('#b7956b', 0, 46, W, 4);
        // The well: stone ring, dark water, wooden frame
        const ring = (cx, cy, r, c) => { for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y * 2.2 <= r * r) fill(c, cx + x, cy + y, 1, 1); };
        ring(34, 84, 12, '#8d8a84'); ring(34, 84, 10, '#a6a29a'); ring(34, 83, 7, '#2c3a44'); ring(33, 82, 3, '#3f5260');
        fill('#6a412a', 22, 66, 2, 18); fill('#6a412a', 45, 66, 2, 18); fill('#5a3a26', 21, 65, 27, 3); fill('#8a5a3a', 33, 68, 2, 7);
        // Haystack
        for (let y = -11; y <= 9; y++) for (let x = -14; x <= 14; x++) {
            if ((x * x) / 196 + (y * y) / (y < 0 ? 121 : 81) <= 1) fill(R() < 0.3 ? '#d9b04a' : R() < 0.5 ? '#c99a35' : '#e7c35e', 168 + x, 72 + y, 1, 1);
        }
        // A little vegetable bed in the corner
        fill('#7a5a3a', 176, 100, 18, 14);
        for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { fill('#5c8740', 178 + i * 4, 102 + j * 4, 2, 2); fill('#79ad55', 179 + i * 4, 102 + j * 4, 1, 1); }
    })();

    // ─── State ───
    let girl, flock, feathers, puffs, bubbles, caught, timeLeft, running = false, last = 0, keys = {}, target = null;
    const BEST = 'chicken-best';
    const best = () => { try { return +localStorage.getItem(BEST) || 0; } catch { return 0; } };

    function reset() {
        girl = { x: 100, y: 96, vx: 0, vy: 0, face: 'r', t: 0 };
        flock = [];
        const kinds = ['hen', 'hen', 'brown', 'hen', 'brown', 'chick', 'chick'];
        kinds.forEach((kind) => flock.push(newChicken(kind)));
        feathers = []; puffs = []; bubbles = []; caught = 0; timeLeft = ROUND;
        $('#score').textContent = '0';
        $('#time').textContent = ROUND;
    }
    function newChicken(kind, x, y) {
        return {
            kind, x: x ?? rand(YARD.x0 + 10, YARD.x1 - 10), y: y ?? rand(YARD.y0 + 6, YARD.y1 - 4),
            vx: 0, vy: 0, face: Math.random() < 0.5 ? 'l' : 'r', state: 'wander', timer: rand(0.5, 2),
            goal: null, stamina: 1, t: rand(0, 1), hop: 0, away: 0,
            speed: kind === 'chick' ? 30 : 46, // fleeing top speed; the girl runs at 40
        };
    }

    // ─── Input: arrow keys / WASD, or hold a finger or the mouse where you want to run ───
    addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key) && running) e.preventDefault();
        keys[e.key.toLowerCase()] = true;
    });
    addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });
    const toGame = (e) => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; };
    canvas.addEventListener('pointerdown', (e) => { if (!running) return; canvas.setPointerCapture(e.pointerId); target = toGame(e); });
    canvas.addEventListener('pointermove', (e) => { if (target) target = toGame(e); });
    canvas.addEventListener('pointerup', () => { target = null; });
    canvas.addEventListener('pointercancel', () => { target = null; });

    // ─── Physics helpers ───
    function keepIn(o, pad = 3) {
        o.x = Math.max(YARD.x0 + pad, Math.min(YARD.x1 - pad, o.x));
        o.y = Math.max(YARD.y0, Math.min(YARD.y1, o.y));
        for (const ob of OBST) {
            const dx = o.x - ob.x, dy = (o.y - ob.y) * 1.4, d = Math.hypot(dx, dy);
            if (d < ob.r) { o.x = ob.x + dx / (d || 1) * ob.r; o.y = ob.y + dy / (d || 1) * ob.r / 1.4; }
        }
    }

    // ─── One frame ───
    function step(dt) {
        if (running) {
            timeLeft -= dt;
            $('#time').textContent = Math.max(0, Math.ceil(timeLeft));
            if (timeLeft <= 0) return end();
        } else {
            girl.x = -999; girl.vx = girl.vy = 0; // before the game starts she waits off stage
        }

        // The girl
        let ix = 0, iy = 0;
        if (keys.arrowleft || keys.a) ix -= 1;
        if (keys.arrowright || keys.d) ix += 1;
        if (keys.arrowup || keys.w) iy -= 1;
        if (keys.arrowdown || keys.s) iy += 1;
        if (target) { const dx = target.x - girl.x, dy = target.y - girl.y, d = Math.hypot(dx, dy); if (d > 2) { ix = dx / d; iy = dy / d; } }
        const il = Math.hypot(ix, iy);
        const sp = 40;
        girl.vx += ((il ? ix / il * sp : 0) - girl.vx) * Math.min(1, dt * 12);
        girl.vy += ((il ? iy / il * sp : 0) - girl.vy) * Math.min(1, dt * 12);
        girl.x += girl.vx * dt; girl.y += girl.vy * dt;
        if (running) keepIn(girl);
        if (Math.abs(girl.vx) > 2) girl.face = girl.vx > 0 ? 'r' : 'l';
        const moving = Math.hypot(girl.vx, girl.vy) > 8;
        girl.t += dt * (moving ? 1 : 0);
        if (moving && Math.random() < dt * 10) puffs.push({ x: girl.x + rand(-3, 3), y: girl.y, life: 0.4, t: 0 });

        // The chickens
        for (const c of flock) {
            c.t += dt;
            const dx = c.x - girl.x, dy = c.y - girl.y, d = Math.hypot(dx, dy);
            const scare = c.kind === 'chick' ? 30 : 38;
            if (d < scare) {
                if (c.state !== 'flee' && Math.random() < 0.6) bubbles.push({ x: c.x, y: c.y - 12, text: Math.random() < 0.5 ? '咯!' : '咯咯咯!', life: 0.9, t: 0 });
                c.state = 'flee'; c.timer = rand(0.6, 1.2);
                // Run away from her, with a wobble, and tire the longer the chase goes on
                const ang = Math.atan2(dy, dx) + Math.sin(c.t * 7) * 0.6;
                const v = c.speed * (0.45 + 0.55 * c.stamina);
                c.vx += (Math.cos(ang) * v - c.vx) * Math.min(1, dt * 8);
                c.vy += (Math.sin(ang) * v - c.vy) * Math.min(1, dt * 8);
                c.stamina = Math.max(0, c.stamina - dt * 0.28);
                if (c.hop <= 0 && Math.random() < dt * 2.5) c.hop = 0.35;
            } else {
                c.stamina = Math.min(1, c.stamina + dt * 0.12);
                c.timer -= dt;
                if (c.timer <= 0) {
                    if (c.state === 'peck' || c.state === 'flee') { c.state = 'wander'; c.goal = { x: rand(YARD.x0 + 8, YARD.x1 - 8), y: rand(YARD.y0 + 4, YARD.y1 - 4) }; c.timer = rand(1.5, 3.5); }
                    else { c.state = 'peck'; c.timer = rand(0.6, 1.8); }
                }
                let tx = 0, ty = 0;
                if (c.state === 'wander' && c.goal) { const gx = c.goal.x - c.x, gy = c.goal.y - c.y, gd = Math.hypot(gx, gy); if (gd > 2) { tx = gx / gd * 12; ty = gy / gd * 12; } }
                c.vx += (tx - c.vx) * Math.min(1, dt * 4);
                c.vy += (ty - c.vy) * Math.min(1, dt * 4);
            }
            c.x += c.vx * dt; c.y += c.vy * dt;
            keepIn(c);
            c.hop = Math.max(0, c.hop - dt);
            if (Math.abs(c.vx) > 1) c.face = c.vx > 0 ? 'r' : 'l';

            // Caught!
            if (d < 7 && c.hop < 0.1) {
                caught++;
                $('#score').textContent = caught;
                for (let i = 0; i < 14; i++) feathers.push({ x: c.x, y: c.y - 4, vx: rand(-30, 30), vy: rand(-45, -10), life: rand(0.6, 1.2), t: 0, col: c.kind === 'brown' ? '#b5794a' : c.kind === 'chick' ? '#f6d55c' : '#fbf6ec' });
                bubbles.push({ x: c.x, y: c.y - 14, text: c.kind === 'chick' ? '叽叽!' : '咯咯哒!', life: 1.1, t: 0, big: true });
                // It wriggles free and comes back in from the side of the yard
                const side = Math.random() < 0.5;
                Object.assign(c, newChicken(c.kind, side ? YARD.x0 + 4 : YARD.x1 - 4, rand(YARD.y0 + 6, YARD.y1 - 6)));
                c.state = 'flee';
            }
        }

        for (const list of [feathers, puffs, bubbles]) for (let i = list.length - 1; i >= 0; i--) {
            const p = list[i]; p.t += dt;
            if (p.vx !== undefined) { p.vy += 60 * dt; p.vx *= 0.97; p.x += p.vx * dt; p.y += p.vy * dt; }
            if (p.t > p.life) list.splice(i, 1);
        }
    }

    // ─── Drawing ───
    function shadow(x, y, w) { ctx.fillStyle = 'rgba(70,45,25,0.28)'; ctx.fillRect(Math.round(x - w / 2), Math.round(y), w, 2); ctx.fillRect(Math.round(x - w / 2 + 1), Math.round(y - 1), w - 2, 1); }
    function render() {
        ctx.drawImage(bg, 0, 0);
        for (const p of puffs) { ctx.fillStyle = `rgba(214,190,150,${0.7 * (1 - p.t / p.life)})`; ctx.fillRect(Math.round(p.x), Math.round(p.y - p.t * 6), 2, 2); }
        const actors = [...(running ? [{ y: girl.y, draw: drawGirl }] : []), ...flock.map((c) => ({ y: c.y, draw: () => drawChicken(c) }))].sort((a, b) => a.y - b.y);
        actors.forEach((a) => a.draw());
        for (const f of feathers) { ctx.fillStyle = f.col; ctx.fillRect(Math.round(f.x), Math.round(f.y), 2, 1); }
        renderBubbles();
    }
    function drawGirl() {
        const moving = Math.hypot(girl.vx, girl.vy) > 8;
        const frame = moving ? (Math.floor(girl.t * 10) % 2 ? 'run1' : 'run2') : 'idle';
        const bob = moving && Math.floor(girl.t * 10) % 2 ? 1 : 0;
        shadow(girl.x, girl.y, 8);
        ctx.drawImage(SPR.girl[frame][girl.face], Math.round(girl.x - 5), Math.round(girl.y - 14 - bob));
    }
    function drawChicken(c) {
        const set = SPR[c.kind];
        const fleeing = c.state === 'flee' && Math.hypot(c.vx, c.vy) > 15;
        const frame = c.state === 'peck' ? (Math.floor(c.t * 4) % 2 ? 'peck' : 'walk1') : fleeing ? (Math.floor(c.t * 14) % 2 ? 'flap' : 'walk2') : (Math.floor(c.t * 6) % 2 ? 'walk1' : 'walk2');
        const spr = set[frame][c.face];
        const lift = c.hop > 0 ? Math.round(Math.sin((1 - c.hop / 0.35) * Math.PI) * 5) : 0;
        shadow(c.x, c.y, c.kind === 'chick' ? 5 : 8);
        ctx.drawImage(spr, Math.round(c.x - spr.width / 2), Math.round(c.y - spr.height - lift));
    }
    // Speech bubbles are HTML on top of the canvas, so the characters stay sharp
    const bubbleLayer = $('#bubbles');
    function renderBubbles() {
        bubbleLayer.innerHTML = bubbles.map((b) => {
            const a = Math.min(1, (b.life - b.t) / 0.3);
            return `<span class="bubble${b.big ? ' big' : ''}" style="left:${b.x / W * 100}%;top:${(b.y - b.t * 8) / H * 100}%;opacity:${a}">${b.text}</span>`;
        }).join('');
    }

    function loop(now) {
        if (!running) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        step(dt);
        if (running) render();
        requestAnimationFrame(loop);
    }

    // ─── Start and end ───
    function start() {
        reset();
        $('#intro').hidden = true; $('#over').hidden = true;
        document.body.classList.add('no-idle'); // the screensaver stays away while a round is on
        running = true; last = performance.now();
        canvas.focus();
        requestAnimationFrame(loop);
    }
    function end() {
        running = false; target = null;
        document.body.classList.remove('no-idle');
        const prev = best();
        if (caught > prev) { try { localStorage.setItem(BEST, caught); } catch { /* fine */ } }
        $('#final').textContent = caught;
        $('#best').textContent = Math.max(prev, caught);
        $('#verdict').textContent = caught === 0 ? 'Exactly as good as I was.'
            : caught < 4 ? `${caught} more than six-year-old me. She would be impressed.`
            : caught < 9 ? 'The chickens are talking about you.'
            : 'The village has never seen anything like it.';
        $('#over').hidden = false;
        $('#again').focus();
    }
    $('#start').addEventListener('click', start);
    $('#again').addEventListener('click', start);

    // Fit the stage: the largest whole-number scale that fits the column
    function fit() {
        // Measured from the page column, minus the console's own frame (about 64px across)
        const room = document.querySelector('main').clientWidth - 64;
        const s = Math.max(1, Math.floor(Math.min(room / W, (innerHeight * 0.68) / H)));
        canvas.style.width = `${W * s}px`; canvas.style.height = `${H * s}px`;
        stage.style.width = `${W * s}px`;
    }
    addEventListener('resize', fit);
    fit();
    // Show the yard behind the start screen, with the flock pecking about
    reset();
    render();
    if (!reduce) {
        let idleLast = performance.now();
        const idle = (now) => {
            if (running) return;
            const dt = Math.min(0.05, (now - idleLast) / 1000); idleLast = now;
            step(dt); render();
            requestAnimationFrame(idle);
        };
        requestAnimationFrame(idle);
    }
})();
