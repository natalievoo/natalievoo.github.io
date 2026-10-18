// What each panel holds. Every app has render(panel, param); a few have unmount().
// Content comes from data/*.js. Entries marked sample: true show a small tag until replaced.
window.APPS_RENDER = (() => {
    const { esc, stars, sample, date, tally, MONTHS, reduce } = SITE;
    const go = (app, param, label, cls = '') => `<a href="#${app}${param ? '/' + encodeURIComponent(param) : ''}" data-go="${app}" data-param="${esc(param || '')}" class="${cls}">${label}</a>`;
    const file = (name, body, extra = '') => `<section class="file">${body}<div class="file-foot"><span class="filename">${esc(name)}</span>${extra}</div></section>`;
    const tile = (name, body, cls = '', tag = 'div', attrs = '') => `<${tag} class="tile ${cls}" ${attrs}><div class="tile-bar"><span class="tile-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="tile-name">${esc(name)}</span><span></span></div><div class="tile-body">${body}</div></${tag}>`;

    // ─── about ───
    const about = {
        render(root) {
            const A = window.ABOUT || {};
            const edit = A.edit ? `<span class="edit"><s>${esc(A.edit.before)}</s><ins>${esc(A.edit.after)}</ins></span>` : '';
            const stampDate = (i) => { const d = new Date(SITE_INFO?.updated || Date.now()); d.setMonth(d.getMonth() - i * 3); return `${String(d.getDate()).padStart(2, '0')} ${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getFullYear()).slice(2)}`; };
            root.innerHTML = `<div class="col">
                <div class="prints-row">${(A.prints || []).map((p, i) => `<figure class="dprint" style="--tilt:${[6, -3, 2][i % 3]}deg"><div class="img">${p.image ? `<img src="${esc(p.image)}" alt="">` : 'photo'}<span class="stamp-date" aria-hidden="true">${stampDate(i)}</span></div><figcaption class="cap">${esc(p.caption)}${sample(p)}</figcaption></figure>`).join('')}</div>
                <h2>About me</h2>
                <div class="about-grid">
                    <div>
                        ${file('about.txt', (A.bio || []).map((p) => `<p>${esc(p.text).replace('{edit}', edit)}${sample(p)}</p>`).join(''))}
                        ${file('likes.txt', `<p class="likes">${(A.likes || []).map((x) => `<span>${esc(x)}</span>`).join('')}</p>`)}
                        ${file('secret.txt', `<div class="secret" id="secret"><div class="text"><p class="cipher" aria-hidden="true"></p><p class="plain">${esc(A.secret || '')}</p>
                            <div class="lens" role="img" aria-label="A magnifying glass. Drag it over the text to read it."><svg viewBox="0 0 110 110"><circle cx="55" cy="55" r="50" fill="rgb(255 255 255 / 0.05)" stroke="#1e1a15" stroke-width="2.5"/><circle cx="55" cy="55" r="44" fill="none" stroke="rgb(255 255 255 / 0.7)" stroke-width="1.2"/><path d="M31 41 a28 28 0 0 1 13 -13" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/><path d="M90 90 L122 122" stroke="#1e1a15" stroke-width="10" stroke-linecap="round"/></svg></div></div>
                            <p class="hint">${A.secretSample ? '<span class="sample">sample</span> ' : ''}drag the glass over it<button class="read-plain" type="button">or just read it</button></p></div>`)}
                    </div>
                    <div>
                        ${file('languages.txt', `<ul class="langs">${(A.languages || []).map((l) => `<li><b>${esc(l.name)}</b><span class="hello">${esc(l.hello)}</span><span class="strokes" role="img" aria-label="${l.level} out of 5">${[1, 2, 3, 4, 5].map((k) => `<i class="${k <= l.level ? '' : 'off'}"></i>`).join('')}</span>${l.note || l.sample ? `<span class="note">${esc(l.note || '')}${sample(l)}</span>` : ''}</li>`).join('')}</ul>`)}
                        ${file('now.txt', `<ul class="now-list">${(A.now || []).map((n) => `<li><b>${esc(n.label)}:</b> ${esc(n.text)}${sample(n)}</li>`).join('')}</ul>`, `<span class="filename">${window.SITE_INFO ? date(SITE_INFO.updated) : ''}</span>`)}
                    </div>
                </div></div>`;
            const box = root.querySelector('#secret'), cipher = box.querySelector('.cipher'), text = box.querySelector('.text'), lens = box.querySelector('.lens');
            const secret = A.secret || '', POOL = 'αβγδεζηθικλμνξοπρστυφχψω马水鱼山风月花书雨光';
            const scramble = () => { cipher.textContent = [...secret].map((ch) => (/\s/.test(ch) ? ch : POOL[(Math.random() * POOL.length) | 0])).join(''); };
            scramble();
            if (!reduce) { const t = setInterval(() => { if (!document.contains(box)) return clearInterval(t); if (!box.classList.contains('open')) scramble(); }, 170); }
            const move = (e) => { const r = text.getBoundingClientRect(); text.style.setProperty('--lx', `${Math.max(0, Math.min(r.width, e.clientX - r.left))}px`); text.style.setProperty('--ly', `${Math.max(0, Math.min(r.height, e.clientY - r.top))}px`); };
            lens.addEventListener('pointerdown', (e) => { e.preventDefault(); lens.setPointerCapture(e.pointerId); lens.addEventListener('pointermove', move); const up = () => lens.removeEventListener('pointermove', move); lens.addEventListener('pointerup', up, { once: true }); lens.addEventListener('pointercancel', up, { once: true }); });
            box.querySelector('.read-plain').addEventListener('click', (e) => { box.classList.toggle('open'); e.target.textContent = box.classList.contains('open') ? 'hide it again' : 'or just read it'; });
        },
    };

    // ─── travel ───
    const SHAPES = ['10px', '50%', '4px', '30px 6px'];
    const loadScript = (u) => new Promise((res, rej) => { if (document.querySelector(`script[src="${u}"]`)) return res(); const s = document.createElement('script'); s.src = u; s.onload = res; s.onerror = rej; document.head.append(s); });
    const travel = {
        render(root, param) {
            const all = (window.TRAVEL || []).slice().sort((a, b) => a.name.localeCompare(b.name));
            if (param) return this.country(root, all, param);
            const visits = all.reduce((n, c) => n + (c.visits || 0), 0);
            root.innerHTML = `<div class="col col-wide">
                <h2>Stamps</h2>
                <p class="lead">Every country I've been to, counted the way my family counts: 正, one stroke per visit.</p>
                <p class="totals"><b>${all.length}</b> countries &nbsp; <b>${visits}</b> visits &nbsp; <b>${new Set(all.map((c) => c.region)).size}</b> continents</p>
                ${tile('world_map.png', '<p class="quiet" style="padding:16px">sketching the map…</p>', 'map-tile')}
                <div class="stamps">${all.slice().sort((a, b) => b.visits - a.visits).map((c, i) => go('travel', c.id, `<span class="native">${esc(c.native)}</span><span class="name">${esc(c.name)}</span><span class="meta">first ${esc(c.firstVisit)} · ${c.visits}×</span>${tally(c.visits)}${sample(c)}`, 'stamp').replace('class="stamp"', `class="stamp" style="--shape:${SHAPES[i % SHAPES.length]};--tilt:${((i * 37) % 7) - 3}deg"`)).join('')}</div>
            </div>`;
            this.map(root.querySelector('.map-tile .tile-body'), all);
        },
        async map(box, places) {
            try {
                await loadScript('https://cdn.jsdelivr.net/npm/d3-array@3.2.4/dist/d3-array.min.js');
                await loadScript('https://cdn.jsdelivr.net/npm/d3-geo@3.1.1/dist/d3-geo.min.js');
                await loadScript('https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js');
                const world = await (await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json')).json();
                if (!document.contains(box)) return;
                const key = (c) => (c.mapName || c.name).replace(/^The /, '');
                const visited = new Map(places.map((c) => [key(c), c]));
                const W = 960, H = 470;
                const countries = topojson.feature(world, world.objects.countries).features.filter((f) => f.properties.name !== 'Antarctica');
                const projection = d3.geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], { type: 'FeatureCollection', features: countries });
                const path = d3.geoPath(projection);
                const order = places.filter((c) => countries.some((f) => f.properties.name === key(c))).sort((a, b) => a.firstVisit - b.firstVisit);
                const centre = (c) => projection(d3.geoCentroid(countries.find((f) => f.properties.name === key(c))));
                box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="World map, ${visited.size} countries marked">
                    <defs><pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="5" height="5" fill="#b3362b1a"/><line x1="0" y1="0" x2="0" y2="5" stroke="#b3362b" stroke-width="1.4" opacity=".7"/></pattern></defs>
                    <path class="graticule" d="${path(d3.geoGraticule10())}"/>
                    <g>${countries.map((f) => { const c = visited.get(f.properties.name); return c ? `<a href="#travel/${encodeURIComponent(c.id)}" data-go="travel" data-param="${esc(c.id)}" aria-label="${esc(c.name)}"><path class="land visited" data-name="${esc(c.name)} · ${c.visits}×" d="${path(f)}"/></a>` : `<path class="land" d="${path(f)}"/>`; }).join('')}</g>
                    <g>${order.slice(1).map((c, i) => { const [x1, y1] = centre(order[i]), [x2, y2] = centre(c); return `<path class="trail" d="M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.25} ${x2} ${y2}"/>`; }).join('')}${order.map((c) => { const [x, y] = centre(c); return `<circle class="pin" cx="${x}" cy="${y}" r="3"/>`; }).join('')}</g>
                </svg><span class="map-tip" hidden></span>`;
                const tip = box.querySelector('.map-tip');
                box.addEventListener('pointermove', (e) => { const el = e.target.closest('.visited'); if (!el) { tip.hidden = true; return; } const r = box.getBoundingClientRect(); tip.textContent = el.dataset.name; tip.style.left = `${e.clientX - r.left}px`; tip.style.top = `${e.clientY - r.top}px`; tip.hidden = false; });
                box.addEventListener('pointerleave', () => { tip.hidden = true; });
            } catch { box.innerHTML = '<p class="quiet" style="padding:16px">the map needs an internet connection to draw the world.</p>'; }
        },
        country(root, all, id) {
            const i = all.findIndex((c) => c.id === id);
            if (i < 0) { root.innerHTML = `<div class="col">${go('travel', '', '← all countries', 'back')}<h2>Not stamped yet.</h2></div>`; return; }
            const c = all[i], prev = all[(i - 1 + all.length) % all.length], next = all[(i + 1) % all.length];
            root.innerHTML = `<div class="col">
                ${go('travel', '', '← all countries', 'back')}
                <div class="country-head"><span class="native" aria-hidden="true">${esc(c.native)}</span><div><h2 style="margin:0">${esc(c.name)}${sample(c)}</h2><p class="quiet">${esc(c.line)}</p></div></div>
                <div class="facts"><span>first visit ${esc(c.firstVisit)}</span><span>${c.visits} ${c.visits === 1 ? 'visit' : 'visits'}</span>${tally(c.visits)}</div>
                <h3>Highlights</h3>
                <div class="prints">${(c.highlights || []).map((h, k) => `<article class="print" style="--tilt:${k % 2 ? 1.2 : -1.2}deg"><div class="photo">${h.image ? `<img src="${esc(h.image)}" alt="">` : 'photo goes here'}</div><h4>${esc(h.title)}</h4><p>${esc(h.text)}</p></article>`).join('') || '<p class="quiet">No highlights yet.</p>'}</div>
                <h3>Where to eat</h3>
                <ul class="index">${(c.restaurants || []).map((r) => `<li class="dish"><span><span class="t">${esc(r.name)}</span> <span class="m">${esc(r.city)}</span><br><span class="d">${esc(r.note)}</span></span>${stars(r.stars || 0)}<span class="where">order: ${esc(r.dish)}</span></li>`).join('') || '<li class="quiet">No restaurants yet.</li>'}</ul>
                <nav class="row-links">${go('travel', prev.id, `← ${esc(prev.name)}`, 'back')}${go('travel', next.id, `${esc(next.name)} →`, 'back')}</nav>
            </div>`;
        },
    };

    // ─── reading ───
    const reading = {
        render(root, param) {
            const R = window.READING || { books: [] };
            if (param) return this.review(root, R, param);
            const link = (b) => (b.longReview ? b.id : null);
            const favs = R.books.filter((b) => b.favourite);
            const years = [...new Set(R.books.map((b) => b.year))].sort((a, b) => b - a);
            const year = +(root.dataset.year || years[0]);
            const inYear = R.books.filter((b) => b.year === year);
            const ranked = inYear.slice().sort((a, b) => b.stars - a.stars || a.month - b.month);
            const coverInner = (b) => `<b>${esc(b.title)}</b><small>${esc(b.author)}</small>`;
            root.innerHTML = `<div class="col">
                <h2>On the shelf</h2>
                <p class="lead">The books I keep coming back to, a favourite from each month, and every year in order. <a href="${esc(R.goodreads || '#')}" rel="noopener">all of it on Goodreads ↗</a></p>
                <div class="covers">${favs.map((b) => (link(b) ? go('reading', b.id, coverInner(b), 'cover') : `<div class="cover">${coverInner(b)}</div>`)).join('') || '<p class="quiet">Mark books with favourite: true to shelve them.</p>'}</div>
                <div class="years">${years.map((y) => `<button type="button" class="year${y === year ? ' on' : ''}" data-year="${y}">${y}</button>`).join('')}</div>
                <div class="months">${MONTHS.map((m, i) => { const b = inYear.find((x) => x.month === i + 1 && x.pick); const label = `<span class="m">${m.slice(0, 3)}</span>`; if (!b) return `<div class="month">${label}</div>`; const inner = `${label}<b>${esc(b.title)}</b><small>${esc(b.author)}</small>${sample(b)}`; return link(b) ? go('reading', b.id, inner, 'month') : `<div class="month">${inner}</div>`; }).join('')}</div>
                <h3>${year}, in order</h3>
                <ul class="index ranked">${ranked.map((b, i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><span><span class="t">${link(b) ? go('reading', b.id, esc(b.title)) : esc(b.title)}</span> <span class="m">${esc(b.author)}</span>${sample(b)}</span>${stars(b.stars)}<span class="d">${esc(b.review || '')}</span></li>`).join('')}</ul>
            </div>`;
            root.querySelectorAll('.year').forEach((y) => y.addEventListener('click', () => { root.dataset.year = y.dataset.year; this.render(root); }));
        },
        review(root, R, id) {
            const b = R.books.find((x) => x.id === id);
            if (!b) { root.innerHTML = `<div class="col">${go('reading', '', '← the shelf', 'back')}<h2>Not on the shelf.</h2></div>`; return; }
            root.innerHTML = `<div class="col">${go('reading', '', '← the shelf', 'back')}
                <article class="review"><div class="cover"><b>${esc(b.title)}</b><small>${esc(b.author)}</small></div>
                <div><h2 style="margin:0">${esc(b.title)}${sample(b)}</h2><p class="quiet">${esc(b.author)}</p><div class="meta">${stars(b.stars)}<span>finished ${MONTHS[b.month - 1].toLowerCase()} ${b.year}</span></div>
                <div class="body">${String(b.longReview || b.review || '').split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join('')}</div></div></article></div>`;
        },
    };

    // ─── writing ───
    const writing = {
        render(root) {
            const W = window.WRITING || { posts: [] };
            root.innerHTML = `<div class="col">
                <h2>Things I wrote down</h2>
                <p class="lead">Essays and notes. They live on Substack, where you can <a href="${esc(W.substack || '#')}" rel="noopener">subscribe to get the next one ↗</a></p>
                <ul class="index posts">${W.posts.slice().sort((a, b) => b.date.localeCompare(a.date)).map((p) => `<li><span class="m">${date(p.date)}</span><a href="${esc(p.url)}" rel="noopener"><span class="t">${esc(p.title)}</span>${sample(p)}<br><span class="d">${esc(p.blurb)}</span></a><span class="arrow">↗</span></li>`).join('') || '<li class="quiet">Nothing yet.</li>'}</ul>
            </div>`;
        },
    };

    // ─── projects ───
    const face = (p, which) => which === 'sketch'
        ? `<div class="sketch">${p.sketch ? `<img src="${esc(p.sketch)}" alt="First sketch of ${esc(p.title)}">` : `<span class="pencil" aria-hidden="true">${esc(p.zi || '作')}</span><span class="note">sketch goes here</span>`}</div>`
        : `<div class="final">${p.final ? `<img src="${esc(p.final)}" alt="${esc(p.title)}">` : `<span class="inkmark" aria-hidden="true">${esc(p.zi || '作')}</span>`}</div>`;
    const fname = (p) => `${p.id}.${{ live: 'app', building: 'wip', idea: 'txt' }[p.status] || 'app'}`;
    const badge = (p) => `<span class="badge ${esc(p.status)}"><i></i>${{ live: 'shipped', building: 'building', idea: 'idea' }[p.status] || p.status}</span>`;
    const projects = {
        render(root, param) {
            const P = window.PROJECTS || [];
            if (param) return this.one(root, P, param);
            root.innerHTML = `<div class="col col-wide">
                <h2>Things I've made</h2>
                <p class="lead">Data tools, small experiments and a game. Each one shows what it became; hover for the first sketch.</p>
                <div class="tiles">${P.map((p) => tile(fname(p), `<div class="face">${face(p, 'final')}${face(p, 'sketch')}</div><div class="tile-meta"><span class="title">${esc(p.title)}${sample(p)}</span><small>${esc(p.line)}</small><span>${badge(p)}</span></div>`, '', 'a', `href="#projects/${encodeURIComponent(p.id)}" data-go="projects" data-param="${esc(p.id)}"`)).join('')}</div>
            </div>`;
        },
        one(root, P, id) {
            const p = P.find((x) => x.id === id);
            if (!p) { root.innerHTML = `<div class="col">${go('projects', '', '← all projects', 'back')}<h2>Not made yet.</h2></div>`; return; }
            const link = p.link ? (/^https?:/.test(p.link) ? `<a href="${esc(p.link)}" rel="noopener">${esc(p.linkLabel || 'open it')} ↗</a>` : go(p.link.split('/')[0], undefined, esc(p.linkLabel || 'open it') + ' →')) : '';
            root.innerHTML = `<div class="col">${go('projects', '', '← all projects', 'back')}
                <p>${badge(p)} <span class="filename">${esc(p.year)}</span></p>
                <h2 style="margin-top:8px">${esc(p.title)}${sample(p)}</h2><p class="lead">${esc(p.line)}</p>${link ? `<p>${link}</p>` : ''}
                <div class="pair"><figure>${tile(`${p.id}.sketch`, face(p, 'sketch'))}<figcaption>first sketch</figcaption></figure><figure>${tile(fname(p), face(p, 'final'))}<figcaption>what it became</figcaption></figure></div>
                <div class="write-up">${(p.sections || []).map((s) => `<section><h4>${esc(s.heading)}</h4><p>${esc(s.text)}</p></section>`).join('')}</div></div>`;
        },
    };

    // ─── life ───
    const TURNTABLE = `<svg class="turntable" viewBox="0 0 330 230" aria-hidden="true">
    <g fill="none" stroke="#2a2423" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 40 L316 36 L318 196 L16 200 Z" fill="#f3ece0"/>
        <path d="M16 200 L18 210 L318 206 L318 196"/>
        <path d="M30 206 V214 M300 203 V211" stroke-width="2.4"/>
        <circle cx="128" cy="118" r="80" fill="#fbf8f2"/>
    </g>
    <g class="vinyl">
        <circle cx="128" cy="118" r="74" fill="#26201f"/>
        <g fill="none" stroke="#f4efe4" stroke-width="0.6" opacity="0.22">
            <circle cx="128" cy="118" r="68"/><circle cx="128" cy="118" r="62"/><circle cx="128" cy="118" r="57"/><circle cx="128" cy="118" r="51"/><circle cx="128" cy="118" r="45"/><circle cx="128" cy="118" r="38"/>
        </g>
        <path d="M78 82 A62 62 0 0 1 104 64" stroke="#f4efe4" stroke-width="2" stroke-linecap="round" opacity=".35" fill="none"/>
        <circle cx="128" cy="118" r="22" fill="#b3362b"/>
        <text x="128" y="120" text-anchor="middle" dominant-baseline="central" font-family="Ma Shan Zheng, KaiTi, serif" font-size="17" fill="#f4efe4">乐</text>
        <circle cx="128" cy="118" r="2.2" fill="#f4efe4"/>
    </g>
    <g fill="none" stroke="#2a2423" stroke-width="1.4" stroke-linecap="round">
        <circle cx="282" cy="172" r="9"/><path d="M282 166 V172"/>
        <path d="M244 168 H262" stroke-width="5" stroke="#b3362b"/>
    </g>
    <text x="236" y="190" font-family="Caveat, cursive" font-size="14" fill="#2a2423">33⅓</text>
    <g class="tonearm" fill="none" stroke="#2a2423" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="276" cy="62" r="13" stroke-width="1.4" fill="#fbf8f2"/><circle cx="276" cy="62" r="3.5" fill="#2a2423" stroke="none"/>
        <path d="M276 62 L270 144 L248 166" stroke-width="2.6"/>
        <path d="M241 160 L253 172" stroke-width="6" stroke="#b3362b"/>
    </g>
</svg>`;
    const DANCER = `<svg class="dancer" viewBox="0 0 160 250" aria-hidden="true">
  <g class="d-turn"><g class="d-bounce">
    <g class="d-hips">
      <g class="d-leg-l" fill="none" stroke="#2a2423" stroke-width="1.3" stroke-linecap="round"><path d="M74 150 L69 200 L65 232"/><path d="M60 233 L67 231 L66 238"/></g>
      <g class="d-leg-r" fill="none" stroke="#2a2423" stroke-width="1.3" stroke-linecap="round"><path d="M86 150 L93 198 L102 228"/><path d="M99 230 L106 226 L108 233"/></g>
      <g class="d-skirt">
        <path d="M68 126 Q80 122 92 126 Q112 160 132 196 Q118 192 106 200 Q96 190 84 198 Q72 188 60 194 Q48 186 36 190 Q54 160 68 126 Z" fill="#b3362b" opacity=".9"/>
        <path d="M70 130 Q60 160 46 186 M80 128 Q78 160 76 194 M90 130 Q104 160 120 192" fill="none" stroke="#8f1f1a" stroke-width="0.9" opacity=".7"/>
        <path d="M36 190 Q48 186 60 194 Q72 188 84 198 Q96 190 106 200 Q118 192 132 196" fill="none" stroke="#2a2423" stroke-width="1.1"/>
      </g>
    </g>
    <g class="d-torso">
      <g class="d-arm-r" fill="none" stroke="#2a2423" stroke-width="1.3" stroke-linecap="round"><path d="M93 86 Q112 96 128 86 Q136 80 142 70"/></g>
      <path d="M70 84 Q80 80 90 84 L92 126 Q80 130 68 126 Z" fill="#b3362b" stroke="#2a2423" stroke-width="1.1"/>
      <path d="M78 70 V80 M82 70 V80" stroke="#2a2423" stroke-width="1.1"/>
      <g class="d-arm-l" fill="none" stroke="#2a2423" stroke-width="1.3" stroke-linecap="round"><path d="M70 86 Q54 72 54 50 Q54 34 62 24"/></g>
      <g class="d-head">
        <g class="d-tail"><path d="M88 46 Q104 44 108 58 Q110 72 102 84 Q104 68 96 58 Q92 52 86 52 Z" fill="#1f1a1c"/></g>
        <ellipse cx="80" cy="58" rx="10" ry="12" fill="#f1d4bc" stroke="#2a2423" stroke-width="1.1"/>
        <path d="M70 58 Q68 44 80 44 Q92 44 90 56 Q86 48 80 49 Q73 50 70 58 Z" fill="#1f1a1c"/>
        <circle cx="90" cy="47" r="3.2" fill="#b3362b"/>
      </g>
    </g>
  </g></g>
</svg>`;
    const PLAY_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path class="i-play" d="M7 4 L20 12 L7 20 Z" fill="#2a2423"/><g class="i-pause" fill="#2a2423"><rect x="5" y="4" width="5" height="16" rx="1.5"/><rect x="14" y="4" width="5" height="16" rx="1.5"/></g></svg>`;
    const life = {
        render(root) {
            const L = window.LIFE || {}, M = L.music || {};
            root.innerHTML = `<div class="col">
                <h2>Life, so far</h2>
                <ul class="index timeline">${(L.timeline || []).map((m) => `<li><span class="m">${esc(m.year)}</span><span><span class="t">${esc(m.title)}</span>${m.place ? ` <span class="m">${esc(m.place)}</span>` : ''}${sample(m)}<br><span class="d">${esc(m.text)}${/chicken/i.test(m.text) ? ` ${go('play', undefined, 'play the memory →')}` : ''}</span></span></li>`).join('')}</ul>
                <h3>2026 in numbers <span class="filename">${L.statsUpdated ? date(L.statsUpdated) : ''}</span></h3>
                <div class="numbers">${(L.stats2026 || []).map((s) => `<div class="num"><b>${Number(s.value).toLocaleString('en-GB')}${s.unit ? `<small>${esc(s.unit)}</small>` : ''}</b><span>${esc(s.label)}${s.goal ? ` · goal ${s.goal}` : ''}${sample(s)}</span>${s.goal ? `<div class="bar" role="img" aria-label="${Math.round(s.value / s.goal * 100)}% of goal"><i style="--p:${Math.min(100, s.value / s.goal * 100)}%"></i></div>` : ''}</div>`).join('')}</div>
                <h3>to do:</h3>
                <ul class="todo">${(L.goals || []).map((g) => `<li class="${g.done ? 'done' : ''}"><span>${esc(g.text)}</span>${sample(g)}</li>`).join('')}</ul>
                <h3>Music</h3>
                ${tile('turntable.app', `<div class="music-desk" id="music-desk"><div class="player">${TURNTABLE}<div class="notes" aria-hidden="true"><span>♪</span><span>♫</span><span>♪</span></div><button class="play" type="button" aria-pressed="false" aria-label="Play the record">${PLAY_ICON}</button></div><div class="stage">${DANCER}</div><div class="music-notes"><p><b>I play</b>${(M.instruments || []).map(esc).join(', ')}${sample(M)}</p><p><b>I dance</b>${(M.dance || []).map(esc).join(', ')}</p><p><a href="${esc(M.spotify || '#')}" rel="noopener">my Spotify ↗</a></p></div></div>`, 'music-tile')}
            </div>`;
            const desk = root.querySelector('#music-desk'), play = desk.querySelector('.play');
            const set = (on) => { desk.classList.toggle('playing', on); play.setAttribute('aria-pressed', String(on)); play.setAttribute('aria-label', on ? 'Stop the record' : 'Play the record'); };
            play.addEventListener('click', () => set(!desk.classList.contains('playing')));
        },
        unmount() { const d = document.querySelector('#music-desk'); d?.classList.remove('playing'); },
    };

    // ─── play ───
    const play = {
        render(root) {
            root.innerHTML = `<div class="col play-col">
                <h2>Chasing chickens</h2>
                <p class="lead">When I was little, in my village in China, I spent whole afternoons chasing the chickens round the courtyard. I never caught a single one. Your turn.</p>
                ${tile('courtyard.game', `<div class="hud" aria-live="polite"><span>caught <b id="score">0</b></span><span>time <b id="time">45</b></span></div>
                    <div id="stage"><canvas id="game" width="200" height="125" tabindex="0" aria-label="The courtyard. Use the arrow keys, or hold where you want to run."></canvas><div id="bubbles" aria-hidden="true"></div></div>
                    <div class="overlay" id="intro"><span class="zh" aria-hidden="true">抓鸡</span><h3>catch the chickens</h3><p>45 seconds. They run faster than you, but they tire. Corner them by the well or the haystack.</p><button class="press" id="start" type="button">start</button></div>
                    <div class="overlay" id="over" hidden><h3>time's up</h3><span class="big" id="final">0</span><p>chickens caught. <span id="verdict"></span></p><p>your best: <b id="best">0</b> · six-year-old me: <b>0</b></p><button class="press" id="again" type="button">again</button></div>`, 'game-tile')}
                <p class="controls">arrow keys or <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> to run<br>on a phone, hold your finger where you want to go</p>
            </div>`;
            window.ChickenGame?.mount(root.querySelector('.game-tile .tile-body'));
        },
        unmount() { window.ChickenGame?.unmount(); },
    };

    return { about, travel, reading, writing, projects, life, play };
})();
