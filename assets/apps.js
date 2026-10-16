// What each scroll holds. Every app has render(paper, param); a few have unmount().
// The content comes from data/*.js. Entries marked sample: true show a small tag until replaced.
window.APPS_RENDER = (() => {
    const { esc, stars, sample, date, tally, MONTHS, reduce } = SITE;
    const go = (app, param, label, cls = '') => `<a href="#${app}${param ? '/' + encodeURIComponent(param) : ''}" data-open="${app}" data-param="${esc(param || '')}" class="${cls}">${label}</a>`;
    const file = (name, body, cls = '') => `<section class="file ${cls}"><h3 class="file-name">${esc(name)}</h3>${body}</section>`;
    const rule = () => '<hr class="rule">';

    // ─── note: the first thing that unrolls ───
    const note = {
        render(root) {
            const now = (window.ABOUT?.now || []).slice(0, 3);
            root.innerHTML = `<div class="note-body">
                <p class="lede">I work with data, build small things on the side, and collect places, books and languages along the way.</p>
                ${now.length ? `<p class="now">now: ${now.map((n) => `${esc(n.label)} ${esc(n.text)}`).join(' · ')}${now.some((n) => n.sample) ? ' <span class="sample">sample</span>' : ''}</p>` : ''}
                <p class="whisper">The ink on the wall is yours. Move, and it paints.</p>
            </div>`;
        },
    };

    // ─── about ───
    const about = {
        render(root) {
            const A = window.ABOUT || {};
            const edit = A.edit ? `<span class="edit"><s>${esc(A.edit.before)}</s><ins>${esc(A.edit.after)}</ins><span class="caret" aria-hidden="true">^</span></span>` : '';
            root.innerHTML = `
                <div class="prints-row">${(A.prints || []).map((p, i) => `<figure class="dprint" style="--tilt:${[-4, 2, -1][i % 3]}deg"><div class="img">${p.image ? `<img src="${esc(p.image)}" alt="">` : 'photo'}</div><figcaption class="cap">${esc(p.caption)}${sample(p)}</figcaption></figure>`).join('')}</div>
                ${file('about.txt', (A.bio || []).map((p) => `<p>${esc(p.text).replace('{edit}', edit)}${sample(p)}</p>`).join(''))}
                ${file('languages.txt', `<ul class="langs">${(A.languages || []).map((l) => `<li><div class="l-row"><b>${esc(l.name)}</b><span class="hello">${esc(l.hello)}</span><span class="strokes" role="img" aria-label="${l.level} out of 5">${[1, 2, 3, 4, 5].map((k) => `<i class="${k <= l.level ? '' : 'off'}"></i>`).join('')}</span></div>${l.note || l.sample ? `<div class="l-note">${esc(l.note || '')}${sample(l)}</div>` : ''}</li>`).join('')}</ul>`)}
                ${file(`now.txt${window.SITE_INFO ? ' · ' + date(SITE_INFO.updated) : ''}`, `<ul class="now-list">${(A.now || []).map((n) => `<li><b>${esc(n.label)}:</b> ${esc(n.text)}${sample(n)}</li>`).join('')}</ul>`)}
                ${file('likes.txt', `<p class="likes">${(A.likes || []).map((x) => `<span>${esc(x)}</span>`).join('')}</p>`)}
                ${file('secret.txt', `<div class="secret" id="secret"><div class="text"><p class="cipher" aria-hidden="true"></p><p class="plain">${esc(A.secret || '')}</p>
                    <div class="lens" role="img" aria-label="A magnifying glass. Drag it over the text to read it."><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="rgb(255 255 255 / 0.06)" stroke="#1f2a30" stroke-width="3"/><circle cx="60" cy="60" r="48" fill="none" stroke="rgb(255 255 255 / 0.7)" stroke-width="1.5"/><path d="M34 44 a30 30 0 0 1 14 -14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/><path d="M98 98 L132 132" stroke="#1f2a30" stroke-width="12" stroke-linecap="round"/><path d="M100 100 L128 128" stroke="#c79a5b" stroke-width="6" stroke-linecap="round"/></svg></div></div>
                    <p class="hint">${A.secretSample ? '<span class="sample">sample</span> ' : ''}drag the glass over it <button class="read-plain" type="button">or just read it</button></p></div>`)}
                <p class="made">made by hand (and with Claude), fuelled by ${esc(SITE_INFO?.fuel || 'tea')} · currently in ${esc(SITE_INFO?.place || '')}</p>`;
            // The secret line: Greek letters and characters that shimmer, readable only under the glass
            const box = root.querySelector('#secret'), cipher = box.querySelector('.cipher'), text = box.querySelector('.text'), lens = box.querySelector('.lens');
            const secret = A.secret || '', POOL = 'αβγδεζηθικλμνξοπρστυφχψω马水鱼山风月花书雨光';
            const scramble = () => { cipher.textContent = [...secret].map((ch) => (/\s/.test(ch) ? ch : POOL[(Math.random() * POOL.length) | 0])).join(''); };
            scramble();
            if (!reduce) { const t = setInterval(() => { if (!document.contains(box)) return clearInterval(t); if (!box.classList.contains('open')) scramble(); }, 170); }
            const move = (e) => {
                const r = text.getBoundingClientRect();
                text.style.setProperty('--lx', `${Math.max(0, Math.min(r.width, e.clientX - r.left))}px`);
                text.style.setProperty('--ly', `${Math.max(0, Math.min(r.height, e.clientY - r.top))}px`);
            };
            lens.addEventListener('pointerdown', (e) => {
                e.preventDefault(); e.stopPropagation(); lens.setPointerCapture(e.pointerId);
                lens.addEventListener('pointermove', move);
                const up = () => lens.removeEventListener('pointermove', move);
                lens.addEventListener('pointerup', up, { once: true }); lens.addEventListener('pointercancel', up, { once: true });
            });
            box.querySelector('.read-plain').addEventListener('click', (e) => { box.classList.toggle('open'); e.target.textContent = box.classList.contains('open') ? 'hide it again' : 'or just read it'; });
        },
    };

    // ─── travel ───
    const COLOURS = ['#b3362b', '#2f5d8c', '#3d8b7d', '#6b4c9a', '#8a5a2b'], SHAPES = ['14px', '50%', '4px', '40px 6px'];
    const loadScript = (u) => new Promise((res, rej) => { if (document.querySelector(`script[src="${u}"]`)) return res(); const s = document.createElement('script'); s.src = u; s.onload = res; s.onerror = rej; document.head.append(s); });
    const travel = {
        render(root, param) {
            const all = (window.TRAVEL || []).slice().sort((a, b) => a.name.localeCompare(b.name));
            if (param) return this.country(root, all, param);
            const visits = all.reduce((n, c) => n + (c.visits || 0), 0);
            const byVisits = all.slice().sort((a, b) => b.visits - a.visits);
            root.innerHTML = `
                <p class="lede">Every country I've been to, counted the way my family counts: 正, one stroke per visit.</p>
                <p class="totals"><b>${all.length}</b> countries <span class="dot">·</span> <b>${visits}</b> visits <span class="dot">·</span> <b>${new Set(all.map((c) => c.region)).size}</b> continents</p>
                <div class="map-sheet" id="map"><p class="whisper">sketching the map…</p></div>
                ${rule()}
                <div class="passport">
                    <div class="passport-top"><span>Natalie Voo · 鄔欣汝</span><span>Visas / Visas / 签证</span></div>
                    <div class="stamps">${byVisits.map((c, i) => `
                        ${go('travel', c.id, `<span class="native">${esc(c.native)}</span><span class="name">${esc(c.name)}</span><span class="meta">first ${esc(c.firstVisit)} · ${c.visits}×</span>${tally(c.visits)}${sample(c)}`, 'stamp')}`
                        .replace('class="stamp"', `class="stamp" style="--c:${COLOURS[i % COLOURS.length]};--shape:${SHAPES[i % SHAPES.length]};--tilt:${((i * 37) % 11) - 5}deg"`)).join('')}</div>
                </div>`;
            this.map(root.querySelector('#map'), all);
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
                    <defs><pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="5" height="5" fill="rgb(179 54 43 / 0.12)"/><line x1="0" y1="0" x2="0" y2="5" stroke="#b3362b" stroke-width="1.6" opacity=".75"/></pattern></defs>
                    <path class="graticule" d="${path(d3.geoGraticule10())}"/>
                    <g filter="url(#wobble)">${countries.map((f) => { const c = visited.get(f.properties.name); return c ? `<a href="#travel/${encodeURIComponent(c.id)}" data-open="travel" data-param="${esc(c.id)}" aria-label="${esc(c.name)}"><path class="land visited" data-name="${esc(c.name)} · ${c.visits}×" d="${path(f)}"/></a>` : `<path class="land" d="${path(f)}"/>`; }).join('')}</g>
                    <g>${order.slice(1).map((c, i) => { const [x1, y1] = centre(order[i]), [x2, y2] = centre(c); return `<path class="trail" d="M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.25} ${x2} ${y2}"/>`; }).join('')}${order.map((c) => { const [x, y] = centre(c); return `<circle class="pin" cx="${x}" cy="${y}" r="3.5"/>`; }).join('')}</g>
                </svg><span class="map-tip" hidden></span>`;
                const tip = box.querySelector('.map-tip');
                box.addEventListener('pointermove', (e) => { const el = e.target.closest('.visited'); if (!el) { tip.hidden = true; return; } const r = box.getBoundingClientRect(); tip.textContent = el.dataset.name; tip.style.left = `${e.clientX - r.left}px`; tip.style.top = `${e.clientY - r.top}px`; tip.hidden = false; });
                box.addEventListener('pointerleave', () => { tip.hidden = true; });
            } catch { box.innerHTML = '<p class="whisper">The map needs an internet connection to draw the world.</p>'; }
        },
        country(root, all, id) {
            const i = all.findIndex((c) => c.id === id);
            if (i < 0) { root.innerHTML = `<p>${go('travel', '', '← All countries', 'back')}</p><p class="lede">Not stamped yet.</p>`; return; }
            const c = all[i], prev = all[(i - 1 + all.length) % all.length], next = all[(i + 1) % all.length];
            root.innerHTML = `
                <p>${go('travel', '', '← All countries', 'back')}</p>
                <div class="country-hero"><span class="native" aria-hidden="true">${esc(c.native)}</span><h3>${esc(c.name)}${sample(c)}</h3><p>${esc(c.line)}</p>
                    <div class="facts"><span>First visit ${esc(c.firstVisit)}</span><span>${c.visits} ${c.visits === 1 ? 'visit' : 'visits'}</span>${tally(c.visits)}</div></div>
                <div class="prints">${(c.highlights || []).map((h, k) => `<article class="print" style="--tilt:${k % 2 ? 1.5 : -1.5}deg"><div class="photo">${h.image ? `<img src="${esc(h.image)}" alt="">` : 'photo goes here'}</div><h4>${esc(h.title)}</h4><p>${esc(h.text)}</p></article>`).join('') || '<p class="whisper">No highlights yet.</p>'}</div>
                <div class="menu"><span class="zh" aria-hidden="true">好吃</span><h3>Where to eat</h3>${(c.restaurants || []).map((r) => `<div class="dish"><div class="row"><b>${esc(r.name)}</b><i></i>${stars(r.stars || 0)}</div><div class="where">${esc(r.city)} · Order: ${esc(r.dish)}</div><div>${esc(r.note)}</div></div>`).join('') || '<p class="whisper">No restaurants yet.</p>'}</div>
                <nav class="nextprev">${go('travel', prev.id, `← ${esc(prev.name)}`, 'back')}${go('travel', next.id, `${esc(next.name)} →`, 'back')}</nav>`;
        },
    };

    // ─── reading ───
    const reading = {
        render(root, param) {
            const R = window.READING || { books: [] };
            if (param) return this.review(root, R, param);
            const link = (b) => (b.longReview ? b.id : null);
            const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
            const favs = R.books.filter((b) => b.favourite);
            const years = [...new Set(R.books.map((b) => b.year))].sort((a, b) => b - a);
            const year = +(root.dataset.year || years[0]);
            const inYear = R.books.filter((b) => b.year === year);
            const ranked = inYear.slice().sort((a, b) => b.stars - a.stars || a.month - b.month);
            root.innerHTML = `
                <p class="lede">The books I keep coming back to, a favourite from each month, and every year ranked. <a href="${esc(R.goodreads || '#')}" rel="noopener">All of it on Goodreads ↗</a></p>
                <div class="shelf">${favs.map((b, i) => { const h = hash(b.id); const inner = `<span>${esc(b.title)}</span>`; const st = `style="--bg:${esc(b.spine || '#2f5d8c')};--w:${44 + (h % 22)}px;--h:${170 + (h % 50)}px" title="${esc(b.title)}, ${esc(b.author)}"`; return link(b) ? go('reading', b.id, inner, 'spine').replace('class="spine"', `class="spine${i === favs.length - 1 && favs.length > 3 ? ' lean' : ''}" ${st}`) : `<span class="spine" ${st}>${inner}</span>`; }).join('') || '<p class="whisper">Mark books with favourite: true to shelve them.</p>'}</div>
                ${rule()}
                <div class="years">${years.map((y) => `<button type="button" class="year${y === year ? ' on' : ''}" data-year="${y}">${y}</button>`).join('')}</div>
                <div class="months">${MONTHS.map((m, i) => { const b = inYear.find((x) => x.month === i + 1 && x.pick); if (!b) return `<div class="month empty-month"><span class="m">${m}</span></div>`; const inner = `<span class="m">${m}</span><b>${esc(b.title)}</b><small>${esc(b.author)}</small>${sample(b)}`; return link(b) ? go('reading', b.id, inner, 'month').replace('class="month"', `class="month" style="--bg:${esc(b.spine)}"`) : `<div class="month" style="--bg:${esc(b.spine)}">${inner}</div>`; }).join('')}</div>
                <h3 class="small-title">${year}, in order</h3>
                <ol class="ranked">${ranked.map((b) => `<li><span><b>${link(b) ? go('reading', b.id, esc(b.title)) : esc(b.title)}</b> <span class="by">${esc(b.author)}</span>${sample(b)}</span>${stars(b.stars)}<p>${esc(b.review || '')}</p></li>`).join('')}</ol>`;
            root.querySelectorAll('.year').forEach((y) => y.addEventListener('click', () => { root.dataset.year = y.dataset.year; this.render(root); }));
        },
        review(root, R, id) {
            const b = R.books.find((x) => x.id === id);
            if (!b) { root.innerHTML = `<p>${go('reading', '', '← The shelf', 'back')}</p><p class="lede">Not on the shelf.</p>`; return; }
            root.innerHTML = `<p>${go('reading', '', '← The shelf', 'back')}</p>
                <article class="review"><div class="cover" style="--bg:${esc(b.spine)}"><b>${esc(b.title)}</b><span>${esc(b.author)}</span></div>
                <div><h3>${esc(b.title)}${sample(b)}</h3><p class="by">${esc(b.author)}</p><div class="meta">${stars(b.stars)}<span>Finished ${MONTHS[b.month - 1]} ${b.year}</span></div>
                <div class="body">${String(b.longReview || b.review || '').split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join('')}</div></div></article>`;
        },
    };

    // ─── writing ───
    const writing = {
        render(root) {
            const W = window.WRITING || { posts: [] };
            root.innerHTML = `<p class="lede">Essays and notes. They live on Substack, where you can <a href="${esc(W.substack || '#')}" rel="noopener">subscribe to get the next one ↗</a>.</p>
                <div class="posts">${W.posts.slice().sort((a, b) => b.date.localeCompare(a.date)).map((p) => `<a class="post" href="${esc(p.url)}" rel="noopener"><time datetime="${esc(p.date)}">${date(p.date)}</time><span><b>${esc(p.title)}</b>${sample(p)}<small>${esc(p.blurb)}</small></span><span class="arrow" aria-hidden="true">↗</span></a>`).join('') || '<p class="whisper">Nothing yet.</p>'}</div>`;
        },
    };

    // ─── projects ───
    const face = (p, which) => which === 'sketch'
        ? `<div class="sketch">${p.sketch ? `<img src="${esc(p.sketch)}" alt="First sketch of ${esc(p.title)}">` : `<span class="pencil" aria-hidden="true">${esc(p.zi || '作')}</span><span class="note">sketch goes here</span>`}</div>`
        : `<div class="final">${p.final ? `<img src="${esc(p.final)}" alt="${esc(p.title)}">` : `<span class="ink" aria-hidden="true">${esc(p.zi || '作')}</span>`}</div>`;
    const projects = {
        render(root, param) {
            const P = window.PROJECTS || [];
            if (param) return this.one(root, P, param);
            root.innerHTML = `<p class="lede">Data tools, creative experiments and a game. Each one shows its first sketch; hover to see what it became.</p>
                <div class="cards">${P.map((p) => go('projects', p.id, `<div class="flip"><div class="flip-in">${face(p, 'sketch')}${face(p, 'final')}</div></div><span class="status ${esc(p.status)}">${esc(p.status)} · ${esc(p.year)}</span><b>${esc(p.title)}${sample(p)}</b><small>${esc(p.line)}</small>`, 'card')).join('')}</div>`;
        },
        one(root, P, id) {
            const p = P.find((x) => x.id === id);
            if (!p) { root.innerHTML = `<p>${go('projects', '', '← All projects', 'back')}</p><p class="lede">Not made yet.</p>`; return; }
            const link = p.link ? (/^https?:/.test(p.link) ? `<a href="${esc(p.link)}" rel="noopener">${esc(p.linkLabel || 'Open it')} ↗</a>` : go(p.link.split('/')[0], undefined, esc(p.linkLabel || 'Open it') + ' →')) : '';
            root.innerHTML = `<p>${go('projects', '', '← All projects', 'back')}</p>
                <span class="status ${esc(p.status)}">${esc(p.status)} · ${esc(p.kind)} · ${esc(p.year)}</span><h3>${esc(p.title)}${sample(p)}</h3><p class="lede">${esc(p.line)}</p>${link ? `<p>${link}</p>` : ''}
                <div class="pair"><figure>${face(p, 'sketch')}<figcaption>First sketch</figcaption></figure><figure>${face(p, 'final')}<figcaption>What it became</figcaption></figure></div>
                <div class="write-up">${(p.sections || []).map((s) => `<section><h4>${esc(s.heading)}</h4><p>${esc(s.text)}</p></section>`).join('')}</div>`;
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
            const L = window.LIFE || {};
            const M = L.music || {};
            root.innerHTML = `
                <h3 class="small-title">The handscroll</h3>
                <div class="handscroll" tabindex="0" aria-label="Timeline, scroll sideways"><span class="roller"></span><div class="silk-strip">${(L.timeline || []).map((m) => `<article class="moment"><span class="yr">${esc(m.year)}</span><h4>${esc(m.title)}${sample(m)}</h4>${m.place ? `<span class="place">${esc(m.place)}</span>` : ''}<p>${esc(m.text)}</p>${/chicken/i.test(m.text) ? go('play', undefined, 'Play the memory →') : ''}<span class="node" aria-hidden="true"></span></article>`).join('')}</div><span class="roller"></span></div>
                ${rule()}
                <h3 class="small-title">2026 in numbers <span class="whisper">${L.statsUpdated ? `updated ${date(L.statsUpdated)}` : ''}</span></h3>
                <div class="stats">${(L.stats2026 || []).map((s) => `<div class="stat"><b>${Number(s.value).toLocaleString('en-GB')}${s.unit ? `<small>${esc(s.unit)}</small>` : ''}</b><span>${esc(s.label)}${s.goal ? ` · goal ${s.goal}` : ''}${sample(s)}</span>${s.goal ? `<div class="bar" role="img" aria-label="${Math.round(s.value / s.goal * 100)}% of goal"><i style="--p:${Math.min(100, s.value / s.goal * 100)}%"></i></div>` : ''}</div>`).join('')}</div>
                ${rule()}
                <h3 class="small-title">Before the year ends</h3>
                <ul class="goals">${(L.goals || []).map((g, i) => `<li class="goal${g.done ? ' done' : ''}" style="--d:${0.3 + i * 0.15}s"><svg viewBox="0 0 24 24" aria-hidden="true"><rect class="box" x="3" y="5" width="16" height="16" rx="3"/><path class="tick" d="M6 13 L10.5 18 L21 3"/></svg><span>${esc(g.text)}${sample(g)}</span></li>`).join('')}</ul>
                ${rule()}
                <h3 class="small-title">Music</h3>
                <div class="music-desk" id="music-desk">
                    <div class="player">${TURNTABLE}<div class="notes" aria-hidden="true"><span>♪</span><span>♫</span><span>♪</span></div><button class="play" type="button" aria-pressed="false" aria-label="Play the record">${PLAY_ICON}</button></div>
                    <div class="stage">${DANCER}</div>
                    <div class="music-notes"><p><b>I play${sample(M)}</b> ${(M.instruments || []).map(esc).join(', ')}</p><p><b>I dance</b> ${(M.dance || []).map(esc).join(', ')}</p><p><a href="${esc(M.spotify || '#')}" rel="noopener">my Spotify ↗</a></p></div>
                </div>`;
            const desk = root.querySelector('#music-desk'), play = desk.querySelector('.play');
            const set = (on) => { desk.classList.toggle('playing', on); play.setAttribute('aria-pressed', String(on)); play.setAttribute('aria-label', on ? 'Stop the record' : 'Play the record'); };
            play.addEventListener('click', () => set(!desk.classList.contains('playing')));
        },
    };

    // ─── play ───
    const play = {
        render(root) {
            root.innerHTML = `
                <p class="lede">When I was little, in my village in China, I spent whole afternoons chasing the chickens round the courtyard. I never caught a single one. Your turn.</p>
                <div class="console">
                    <div class="label"><span>COURTYARD · 院子</span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></div>
                    <div class="screen">
                        <div class="hud" aria-live="polite"><span>CAUGHT <b id="score">0</b></span><span>TIME <b id="time">45</b></span></div>
                        <div id="stage" style="margin-top:8px"><canvas id="game" width="200" height="125" tabindex="0" aria-label="The courtyard. Use the arrow keys, or hold where you want to run."></canvas><div id="bubbles" aria-hidden="true"></div></div>
                        <div class="overlay" id="intro"><span class="zh" aria-hidden="true">抓鸡</span><h3>Catch the chickens</h3><p>45 seconds. They run faster than you, but they tire. Corner them by the well or the haystack.</p><button class="press" id="start" type="button">Start</button></div>
                        <div class="overlay" id="over" hidden><h3>Time's up</h3><span class="big" id="final">0</span><p>chickens caught. <span id="verdict"></span></p><p>Your best: <b id="best">0</b> · Six-year-old me: <b>0</b></p><button class="press" id="again" type="button">Again</button></div>
                    </div>
                </div>
                <p class="controls">Arrow keys or <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to run. On a phone, hold your finger where you want to go.</p>`;
            window.ChickenGame?.mount(root);
        },
        unmount() { window.ChickenGame?.unmount(); },
    };

    return { note, about, travel, reading, writing, projects, life, play };
})();
