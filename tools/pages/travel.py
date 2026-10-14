STAMP_CSS = '''
        /* A passport page: pale guilloche lines, and one ink stamp per country */
        .passport {
            position: relative; padding: clamp(1.25rem, 4vw, 2.5rem); border-radius: 18px;
            background:
                repeating-radial-gradient(circle at 20% 30%, rgb(61 139 125 / 0.07) 0 1px, transparent 1px 9px),
                repeating-radial-gradient(circle at 85% 80%, rgb(47 93 140 / 0.06) 0 1px, transparent 1px 11px),
                #f7f3ea;
            border: 1px solid var(--line); box-shadow: var(--shadow);
        }
        .passport-top { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 1.5rem; }
        .stamps { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 1.5rem 1rem; }
        .stamp {
            --c: var(--seal);
            position: relative; display: grid; justify-items: center; gap: 0.15rem; padding: 1.1rem 0.75rem 0.9rem;
            color: var(--c); text-decoration: none; text-align: center;
            border: 2.5px solid var(--c); border-radius: var(--shape, 14px);
            transform: rotate(var(--tilt, -3deg)); mix-blend-mode: multiply;
            transition: transform 0.35s var(--ease-back);
            filter: url(#stamp-ink);
        }
        .stamp::before { content: ''; position: absolute; inset: 5px; border: 1px solid var(--c); border-radius: inherit; opacity: 0.7; }
        .stamp:hover { transform: rotate(0deg) scale(1.04); color: var(--c); }
        .stamp .native { font-family: var(--brush), var(--serif-display); font-size: 2rem; line-height: 1.1; }
        .stamp .name { font: 600 0.8rem/1.2 var(--mono); letter-spacing: 0.14em; text-transform: uppercase; }
        .stamp .meta { font: 0.7rem/1.4 var(--mono); opacity: 0.85; }
        .stamp .tallies { margin-top: 0.3rem; font-size: 1.1rem; }
        .stamp .sample { margin-top: 0.3rem; justify-self: center; }
        /* The map: the world sketched in blue pen, visited countries hatched in red marker */
        .map-sheet { position: relative; }
        .map-sheet svg { display: block; width: 100%; height: auto; }
        .land { fill: rgb(61 82 181 / 0.04); stroke: var(--pen, #3d52b5); stroke-width: 0.6; stroke-linejoin: round; }
        .land.visited { fill: url(#hatch); stroke: #b3362b; stroke-width: 1.1; cursor: pointer; }
        .land.visited:hover, .land.visited:focus-visible { fill: rgb(179 54 43 / 0.35); outline: none; }
        .graticule { fill: none; stroke: rgb(61 82 181 / 0.12); stroke-width: 0.5; stroke-dasharray: 2 3; }
        .trail { fill: none; stroke: var(--pen, #3d52b5); stroke-width: 1.2; stroke-dasharray: 1 5; stroke-linecap: round; }
        .pin { fill: #b3362b; stroke: #fff; stroke-width: 1.5; }
        .map-tip {
            position: absolute; pointer-events: none; padding: 0.15rem 0.5rem; transform: translate(-50%, -130%) rotate(-2deg);
            font: 500 1.3rem/1.2 var(--hand, cursive); color: var(--pen, #3d52b5); background: var(--postit, #f7e9a6);
            box-shadow: 0 6px 12px -6px rgb(80 60 10 / 0.35); white-space: nowrap;
        }
        .map-note { color: var(--muted); font-size: 0.9rem; padding: 2rem; text-align: center; }
        .totals { display: flex; gap: 1.25rem; flex-wrap: wrap; }
        .totals div { min-width: 8.5rem; }
        .totals div { display: grid; }
        .totals b { font: 600 2.4rem/1 var(--serif-display); }
        .totals span { color: var(--muted); font-size: 0.9rem; }
'''
INK_FILTER = '''    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
        <filter id="stamp-ink"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="5" result="n"/>
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -6 4.6" result="holes"/>
            <feComposite in="SourceGraphic" in2="holes" operator="in"/></filter>
    </svg>
'''

page('travel/index.html', 'Travel', 'Every country I have been to, how many times, and where to eat.', 'travel', STAMP_CSS, INK_FILTER + '''
    <main class="page">
        <div class="page-head">
            <span class="watermark" aria-hidden="true">旅</span>
            <p class="eyebrow">Travel</p>
            <h1>Stamps in the passport</h1>
            <p>Every country I've been to. Visits are counted the way my family counts, in 正: five strokes, five times. Open a stamp for the highlights and where to eat.</p>
            ''' + note('one stroke per visit. 正 = five!') + '''
        </div>
        <div class="totals" id="totals"></div>
        <section class="section">
            <div class="section-head"><h2>The map</h2><p>hover me ↓</p></div>
            <div class="window blue" data-title="the world, so far"><div class="map-sheet" id="map"><p class="map-note">Sketching the map…</p></div></div>
        </section>
        <section class="section">
            <div class="section-head"><h2>Countries</h2><div class="chips" id="regions" role="group" aria-label="Filter by region"></div></div>
            <div class="passport taped" style="--tape-tilt:3deg">
                <div class="passport-top"><span>Natalie Voo · 鄔欣汝</span><span>Visas / Visas / 签证</span></div>
                <div class="stamps" id="stamps"></div>
            </div>
        </section>
    </main>
''', '''    <script src="../data/travel.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/d3-array@3.2.4/dist/d3-array.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/d3-geo@3.1.1/dist/d3-geo.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js"></script>
    <script>
        // ─── The map ───
        (async () => {
            const { esc } = SITE;
            const box = document.getElementById('map');
            const places = window.TRAVEL || [];
            // A country in data/travel.js is found on the map by its English name ("The" dropped),
            // or by `mapName` if the map spells it differently
            const key = (c) => (c.mapName || c.name).replace(/^The /, '');
            const visited = new Map(places.map((c) => [key(c), c]));
            let world;
            try {
                world = await (await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json')).json();
            } catch {
                box.innerHTML = '<p class="map-note">The map needs an internet connection to draw the world.</p>';
                return;
            }
            const W = 960, H = 470;
            const countries = topojson.feature(world, world.objects.countries).features.filter((f) => f.properties.name !== 'Antarctica');
            const projection = d3.geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], { type: 'FeatureCollection', features: countries });
            const path = d3.geoPath(projection);
            const ns = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(ns, 'svg');
            svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-label', `World map with ${visited.size} countries marked: ${places.map((c) => c.name).join(', ')}`);
            svg.innerHTML = `
                <defs><pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
                    <rect width="5" height="5" fill="rgb(179 54 43 / 0.12)"/><line x1="0" y1="0" x2="0" y2="5" stroke="#b3362b" stroke-width="1.6" opacity=".75"/></pattern></defs>
                <path class="graticule" d="${path(d3.geoGraticule10())}"/>
                <g filter="url(#pencil-wobble)">${countries.map((f) => {
                    const c = visited.get(f.properties.name);
                    return c
                        ? `<a href="country.html?c=${encodeURIComponent(c.id)}" aria-label="${esc(c.name)}"><path class="land visited" data-id="${esc(c.id)}" d="${path(f)}"/></a>`
                        : `<path class="land" d="${path(f)}"/>`;
                }).join('')}</g>`;
            // Dashed pen trails between countries, in the order I first went
            const order = places.filter((c) => countries.some((f) => f.properties.name === key(c))).sort((a, b) => a.firstVisit - b.firstVisit);
            const centre = (c) => projection(d3.geoCentroid(countries.find((f) => f.properties.name === key(c))));
            const g = document.createElementNS(ns, 'g');
            g.innerHTML = order.slice(1).map((c, i) => {
                const [x1, y1] = centre(order[i]), [x2, y2] = centre(c);
                const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.25;
                return `<path class="trail" d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}"/>`;
            }).join('') + order.map((c) => { const [x, y] = centre(c); return `<circle class="pin" cx="${x}" cy="${y}" r="3.5"/>`; }).join('');
            svg.append(g);
            box.innerHTML = '';
            box.append(svg);
            // A sticky-note label follows the pointer over a visited country
            const tip = document.createElement('span');
            tip.className = 'map-tip'; tip.hidden = true;
            box.append(tip);
            svg.addEventListener('pointermove', (e) => {
                const el = e.target.closest('.visited');
                if (!el) { tip.hidden = true; return; }
                const c = places.find((p) => p.id === el.dataset.id);
                const r = box.getBoundingClientRect();
                tip.textContent = `${c.name} · ${c.visits}×`;
                tip.style.left = `${e.clientX - r.left}px`; tip.style.top = `${e.clientY - r.top}px`;
                tip.hidden = false;
            });
            svg.addEventListener('pointerleave', () => { tip.hidden = true; });
        })();
    </script>
    <script>
        const { esc, tally, sample } = SITE;
        const COLOURS = ['#b3362b', '#2f5d8c', '#3d8b7d', '#6b4c9a', '#8a5a2b'];
        const SHAPES = ['14px', '50%', '4px', '40px 6px'];
        const all = window.TRAVEL || [];
        const visits = all.reduce((n, c) => n + (c.visits || 0), 0);
        document.getElementById('totals').innerHTML = `
            <div class="postit"><b>${all.length}</b><span>countries</span></div>
            <div class="postit"><b>${visits}</b><span>visits</span></div>
            <div class="postit"><b>${new Set(all.map((c) => c.region)).size}</b><span>continents</span></div>`;
        const regions = ['All', ...new Set(all.map((c) => c.region))];
        let region = 'All';
        const chips = document.getElementById('regions');
        chips.innerHTML = regions.map((r) => `<button class="chip" type="button" aria-pressed="${r === region}">${esc(r)}</button>`).join('');
        chips.addEventListener('click', (e) => {
            const b = e.target.closest('.chip'); if (!b) return;
            region = b.textContent;
            chips.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
            draw();
        });
        function draw() {
            const list = all.filter((c) => region === 'All' || c.region === region).sort((a, b) => b.visits - a.visits);
            document.getElementById('stamps').innerHTML = list.map((c, i) => `
                <a class="stamp" href="country.html?c=${encodeURIComponent(c.id)}" style="--c:${COLOURS[i % COLOURS.length]};--shape:${SHAPES[i % SHAPES.length]};--tilt:${((i * 37) % 11) - 5}deg">
                    <span class="native">${esc(c.native)}</span>
                    <span class="name">${esc(c.name)}</span>
                    <span class="meta">first ${esc(c.firstVisit)} · ${c.visits}×</span>
                    ${tally(c.visits)}${sample(c)}
                </a>`).join('') || '<p class="empty">No countries yet. Add them in data/travel.js.</p>';
        }
        draw();
    </script>
''')

page('travel/country.html', 'Country', 'Highlights and where to eat.', 'travel', STAMP_CSS + '''
        .country-hero { display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: end; padding-block: 2rem 1rem; }
        .country-hero .native { font-family: var(--brush), var(--serif-display); font-size: clamp(4rem, 14vw, 9rem); line-height: 0.95; color: var(--seal); }
        .country-hero h1 { font-size: clamp(2.2rem, 5vw, 3.4rem); }
        .country-hero p { color: var(--ink-soft); font-size: 1.15rem; max-width: 34rem; }
        .facts { display: flex; gap: 1.5rem; flex-wrap: wrap; color: var(--muted); font-size: 0.95rem; align-items: center; margin-top: 0.75rem; }
        .facts .tallies { color: var(--seal); font-size: 1.4rem; }
        /* Highlights as photos taped into a travel journal */
        .prints { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 2rem 1.5rem; padding-top: 1rem; }
        .print { position: relative; padding: 0.75rem 0.75rem 1.1rem; background: #fff; box-shadow: var(--shadow); transform: rotate(var(--tilt)); }
        .print::before { content: ''; position: absolute; top: -10px; left: 50%; width: 70px; height: 22px; transform: translateX(-50%) rotate(-3deg); background: rgb(199 154 91 / 0.45); }
        .print .photo { aspect-ratio: 4 / 3; display: grid; place-items: center; background: repeating-linear-gradient(45deg, var(--paper-deep) 0 8px, var(--paper) 8px 16px); color: var(--muted); font: 0.75rem var(--mono); margin-bottom: 0.75rem; }
        .print h3 { font-size: 1.35rem; }
        .print p { color: var(--ink-soft); font-size: 0.95rem; }
        /* Where to eat: a menu card */
        .menu { max-width: 44rem; padding: 2rem clamp(1.25rem, 4vw, 2.5rem); background: var(--card); border: 1px solid var(--line); border-radius: 6px; box-shadow: var(--shadow); }
        .menu h2 { text-align: center; font-size: 1.8rem; }
        .menu .zh { display: block; text-align: center; font-family: var(--brush); color: var(--seal); font-size: 1.4rem; }
        .dish { display: grid; gap: 0.15rem; padding-block: 1rem; border-bottom: 1px dashed var(--line); }
        .dish:last-child { border-bottom: 0; }
        .dish .row { display: flex; align-items: baseline; gap: 0.5rem; }
        .dish .row b { font: 600 1.2rem var(--serif-display); }
        .dish .row i { flex: 1; border-bottom: 1px dotted var(--muted); transform: translateY(-4px); }
        .dish .where { color: var(--muted); font-size: 0.9rem; }
        .nextprev { display: flex; justify-content: space-between; gap: 1rem; padding-top: 2rem; }
        @media (max-width: 640px) { .country-hero { grid-template-columns: 1fr; } }
''', INK_FILTER + '''
    <main class="page" id="country">
        <a class="back" href="index.html">← All countries</a>
    </main>
''', '''    <script src="../data/travel.js"></script>
    <script>
        const { esc, tally, stars, sample, param } = SITE;
        const all = (window.TRAVEL || []).slice().sort((a, b) => a.name.localeCompare(b.name));
        const i = all.findIndex((c) => c.id === param('c'));
        const main = document.getElementById('country');
        if (i < 0) {
            main.insertAdjacentHTML('beforeend', '<div class="page-head"><h1>Not stamped yet</h1><p>There is no country with that name in data/travel.js.</p></div>');
        } else {
            const c = all[i], prev = all[(i - 1 + all.length) % all.length], next = all[(i + 1) % all.length];
            document.title = `${c.name} · Natalie Voo`;
            main.insertAdjacentHTML('beforeend', `
                <div class="country-hero">
                    <div>
                        <span class="native" aria-hidden="true">${esc(c.native)}</span>
                        <h1>${esc(c.name)}${sample(c)}</h1>
                        <p>${esc(c.line)}</p>
                        <div class="facts"><span>First visit ${esc(c.firstVisit)}</span><span>${c.visits} ${c.visits === 1 ? 'visit' : 'visits'}</span>${tally(c.visits)}</div>
                    </div>
                </div>
                <section class="section">
                    <div class="section-head"><h2>Highlights</h2></div>
                    <div class="prints">${(c.highlights || []).map((h, k) => `
                        <article class="print" style="--tilt:${k % 2 ? 1.5 : -1.5}deg">
                            <div class="photo">${h.image ? `<img src="../${esc(h.image)}" alt="">` : 'photo goes here'}</div>
                            <h3>${esc(h.title)}</h3><p>${esc(h.text)}</p>
                        </article>`).join('') || '<p class="empty">No highlights yet.</p>'}</div>
                </section>
                <section class="section">
                    <div class="menu taped">
                        <span class="zh" aria-hidden="true">好吃</span>
                        <h2>Where to eat</h2>
                        ${(c.restaurants || []).map((r) => `
                            <div class="dish">
                                <div class="row"><b>${esc(r.name)}</b><i></i>${stars(r.stars || 0)}</div>
                                <div class="where">${esc(r.city)} · Order: ${esc(r.dish)}</div>
                                <div>${esc(r.note)}</div>
                            </div>`).join('') || '<p class="empty">No restaurants yet.</p>'}
                    </div>
                </section>
                <nav class="nextprev" aria-label="Other countries">
                    <a class="back" href="country.html?c=${encodeURIComponent(prev.id)}">← ${esc(prev.name)}</a>
                    <a class="back" href="country.html?c=${encodeURIComponent(next.id)}">${esc(next.name)} →</a>
                </nav>`);
        }
    </script>
''')
