// What each panel holds. Every app has render(panel, param); a few have unmount().
// Content comes from data/*.js. Entries marked sample: true show a small tag until replaced.
// Each section is a different object lifted off the shelf: a bookshelf, a passport, manuscript
// paper, a drafting board, a handscroll, a letter. The sheet() helper gives them the same frame.
window.APPS_RENDER = (() => {
    const { esc, stars, sample, date, tally, MONTHS, reduce } = SITE;
    const ZI = { about: '我', travel: '旅', reading: '读', writing: '写', projects: '作', life: '生', play: '玩' };
    const go = (app, param, label, cls = '', attrs = '') => `<a href="#${app}${param ? '/' + encodeURIComponent(param) : ''}" data-go="${app}" data-param="${esc(param || '')}" class="${cls}" ${attrs}>${label}</a>`;
    const tile = (name, body, cls = '', tag = 'div', attrs = '') => `<${tag} class="tile ${cls}" ${attrs}><div class="tile-bar"><span class="tile-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="tile-name">${esc(name)}</span><span></span></div><div class="tile-body">${body}</div></${tag}>`;
    // The sheet every section sits on: a seal mark, a title, one line of small facts, and a way out
    const sheet = (app, title, sub, body, cls = '') => `<div class="col sheet ${cls}">
        <header class="sheet-head"><span class="mark" aria-hidden="true">${ZI[app]}</span><div><h2>${title}</h2>${sub ? `<p class="sheet-sub">${sub}</p>` : ''}</div>${go('welcome', '', '×', 'sheet-x', 'aria-label="Back to the pond"')}</header>
        ${body}</div>`;
    const hash = (s) => [...String(s)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
    const shortDate = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase();

    // ─── about: a letter, with notes in the margin ───
    const about = {
        render(root) {
            const A = window.ABOUT || {};
            const edit = A.edit ? `<span class="edit"><s>${esc(A.edit.before)}</s><ins>${esc(A.edit.after)}</ins></span>` : '';
            const stampDate = (i) => { const d = new Date(SITE_INFO?.updated || Date.now()); d.setMonth(d.getMonth() - i * 3); return `${String(d.getDate()).padStart(2, '0')} ${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getFullYear()).slice(2)}`; };
            const prints = (A.prints || []).slice(0, 3).map((p, i) => `<figure class="dprint" style="--tilt:${[3, -2.5, 2][i % 3]}deg"><div class="img">${p.image ? `<img src="${esc(p.image)}" alt="">` : 'photo'}<span class="stamp-date" aria-hidden="true">${stampDate(i)}</span></div><figcaption class="cap">${esc(p.caption)}${sample(p)}</figcaption></figure>`).join('');
            root.innerHTML = sheet('about', 'About me', `natalie voo · 邬欣汝 · ${esc(window.SITE_INFO?.place || '')}`, `<div class="letter">
                <div class="letter-main">
                    <div class="bio">${(A.bio || []).map((p) => `<p>${esc(p.text).replace('{edit}', edit)}${sample(p)}</p>`).join('')}</div>
                    <p class="likes"><span class="k">likes</span>${(A.likes || []).map(esc).join(' · ')}</p>
                    <div class="secret" id="secret" tabindex="0" role="button" aria-label="A secret. Hold to read it.">
                        <span class="k">a secret <small>hold to read</small></span>
                        <p class="ink"><span class="cipher" aria-hidden="true"></span><span class="plain">${esc(A.secret || '')}${A.secretSample ? ' <span class="sample">sample</span>' : ''}</span></p>
                    </div>
                </div>
                <aside class="margin">
                    <div class="prints-row">${prints}</div>
                    <section><h4 class="k">languages</h4><ul class="langs">${(A.languages || []).map((l) => `<li><span class="hello">${esc(l.hello)}</span><b>${esc(l.name)}</b><span class="strokes" role="img" aria-label="${l.level} out of 5">${[1, 2, 3, 4, 5].map((k) => `<i class="${k <= l.level ? '' : 'off'}"></i>`).join('')}</span>${l.note || l.sample ? `<span class="note">${esc(l.note || '')}${sample(l)}</span>` : ''}</li>`).join('')}</ul></section>
                    <section><h4 class="k">now</h4><ul class="now-list">${(A.now || []).map((n) => `<li><b>${esc(n.label)}</b> ${esc(n.text)}${sample(n)}</li>`).join('')}</ul><p class="dated">${window.SITE_INFO ? date(SITE_INFO.updated) : ''}</p></section>
                </aside></div>`);
            // The secret is written in ink that only shows while you hold the paper down
            const box = root.querySelector('#secret'), cipher = box.querySelector('.cipher');
            const secret = A.secret || '', POOL = 'αβγδεζηθικλμνξοπρστυφχψω马水鱼山风月花书雨光';
            const scramble = () => { cipher.textContent = [...secret].map((ch) => (/\s/.test(ch) ? ch : POOL[(Math.random() * POOL.length) | 0])).join(''); };
            scramble();
            if (!reduce) { const t = setInterval(() => { if (!document.contains(box)) return clearInterval(t); if (!box.classList.contains('wet')) scramble(); }, 170); }
            let dry;
            const hold = () => { clearTimeout(dry); box.classList.add('wet'); };
            const release = () => { clearTimeout(dry); dry = setTimeout(() => box.classList.remove('wet'), 1800); };
            box.addEventListener('pointerdown', (e) => { e.preventDefault(); hold(); });
            for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) box.addEventListener(ev, release);
            box.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); hold(); } });
            box.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') release(); });
        },
    };

    // ─── travel: an open passport ───
    const SHAPES = ['10px', '50%', '4px', '30px 6px'];
    const loadScript = (u) => new Promise((res, rej) => { if (document.querySelector(`script[src="${u}"]`)) return res(); const s = document.createElement('script'); s.src = u; s.onload = res; s.onerror = rej; document.head.append(s); });
    const stampInner = (c) => `<span class="native">${esc(c.native)}</span><span class="name">${esc(c.name)}</span><span class="meta">first ${esc(c.firstVisit)} · ${c.visits}×</span>${tally(c.visits)}${sample(c)}`;
    const travel = {
        render(root, param) {
            const all = (window.TRAVEL || []).slice().sort((a, b) => a.name.localeCompare(b.name));
            if (param) return this.country(root, all, param);
            const visits = all.reduce((n, c) => n + (c.visits || 0), 0);
            const regions = new Set(all.map((c) => c.region)).size;
            const stamps = all.slice().sort((a, b) => b.visits - a.visits).map((c, i) => go('travel', c.id, stampInner(c), 'stamp', `style="--shape:${SHAPES[i % SHAPES.length]};--tilt:${((hash(c.id) % 9) - 4)}deg"`)).join('');
            root.innerHTML = sheet('travel', 'Stamps', `${all.length} countries · ${visits} visits · ${regions} continents · counted the way my family counts, 正, one stroke a visit`, `<div class="passport">
                <div class="page page-l"><p class="page-head"><span>where I've been</span><span>去过的地方</span></p><div class="map"><p class="quiet">sketching the map…</p></div></div>
                <div class="page page-r"><p class="page-head"><span>visas</span><span>签证</span></p><div class="stamps">${stamps}</div></div>
            </div>`, 'col-wide');
            this.map(root.querySelector('.map'), all);
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
            } catch { box.innerHTML = '<p class="quiet">the map needs an internet connection to draw the world.</p>'; }
        },
        country(root, all, id) {
            const i = all.findIndex((c) => c.id === id);
            if (i < 0) { root.innerHTML = sheet('travel', 'Not stamped yet.', '', go('travel', '', '← all countries', 'back')); return; }
            const c = all[i], prev = all[(i - 1 + all.length) % all.length], next = all[(i + 1) % all.length];
            root.innerHTML = sheet('travel', `${esc(c.name)}${sample(c)}`, esc(c.line), `<div class="passport">
                <div class="page page-l">
                    ${go('travel', '', '← all countries', 'back')}
                    <div class="stamp big" style="--shape:${SHAPES[i % SHAPES.length]};--tilt:-2deg">${stampInner(c)}</div>
                    <p class="page-head"><span>highlights</span><span>${esc(c.native)}</span></p>
                    <div class="prints">${(c.highlights || []).map((h, k) => `<article class="print" style="--tilt:${k % 2 ? 1.2 : -1.2}deg"><div class="photo">${h.image ? `<img src="${esc(h.image)}" alt="">` : 'photo goes here'}</div><h4>${esc(h.title)}</h4><p>${esc(h.text)}</p></article>`).join('') || '<p class="quiet">No highlights yet.</p>'}</div>
                </div>
                <div class="page page-r">
                    <p class="page-head"><span>where to eat</span><span>吃什么</span></p>
                    <ul class="index">${(c.restaurants || []).map((r) => `<li class="dish"><span><span class="t">${esc(r.name)}</span> <span class="m">${esc(r.city)}</span><br><span class="d">${esc(r.note)}</span></span>${stars(r.stars || 0)}<span class="where">order: ${esc(r.dish)}</span></li>`).join('') || '<li class="quiet">No restaurants yet.</li>'}</ul>
                    <nav class="row-links">${go('travel', prev.id, `← ${esc(prev.name)}`, 'back')}${go('travel', next.id, `${esc(next.name)} →`, 'back')}</nav>
                </div>
            </div>`, 'col-wide');
        },
    };

    // ─── reading: a bookshelf, one shelf a year ───
    const reading = {
        render(root, param) {
            const R = window.READING || { books: [] };
            if (param) return this.spread(root, R, param);
            const books = R.books.slice();
            const favs = books.filter((b) => b.favourite);
            const years = [...new Set(books.map((b) => b.year))].sort((a, b) => b - a);
            const avg = (arr) => (arr.length ? (arr.reduce((n, b) => n + (b.stars || 0), 0) / arr.length).toFixed(1) : '–');
            // A spine's height and width come from the book, so no two shelves look alike
            const spine = (b) => {
                const h = Math.round(148 + (b.stars || 3) * 9 + (hash(b.title) % 24));
                const w = Math.round(Math.max(34, Math.min(54, 24 + b.title.length * 1.1)));
                const lean = hash(b.author + b.title) % 6 === 0 ? -6 : 0;
                const inner = `<span class="sp-title">${esc(b.title)}</span><span class="sp-author">${esc(b.author)}</span><span class="sp-tag${b.pick ? ' pick' : ''}">${MONTHS[(b.month || 1) - 1].slice(0, 3).toLowerCase()}</span>`;
                const attrs = `style="--h:${h}px;--w:${w}px;--c:${esc(b.spine || '#4a4a4a')};--lean:${lean}deg" data-book="${esc(b.id)}"`;
                return b.longReview ? go('reading', b.id, inner, 'spine', attrs) : `<div class="spine" ${attrs} tabindex="0">${inner}</div>`;
            };
            const shelf = (list, label, note) => `<div class="shelf"><div class="books">${list.map(spine).join('') || '<p class="quiet empty">nothing here yet</p>'}</div><span class="plate">${label}</span><span class="plate r">${note}</span></div>`;
            root.innerHTML = sheet('reading', 'On the shelf', `${books.length} books · ${years.length} ${years.length === 1 ? 'year' : 'years'} · <a href="${esc(R.goodreads || '#')}" rel="noopener">all of it on goodreads ↗</a>`, `
                ${shelf(favs, 'the ones I keep', `${favs.length} favourites`)}
                ${years.map((y) => { const inY = books.filter((b) => b.year === y).sort((a, b) => a.month - b.month); return shelf(inY, String(y), `${inY.length} ${inY.length === 1 ? 'book' : 'books'} · ★ ${avg(inY)}`); }).join('')}
                <div class="bookcard" hidden></div>`);
            // A library card follows the pointer over a spine
            const col = root.querySelector('.col'), card = col.querySelector('.bookcard');
            const byId = Object.fromEntries(books.map((b) => [b.id, b]));
            const place = (x, y) => { const w = 250, h = card.offsetHeight; card.style.left = `${Math.max(8, Math.min(innerWidth - w - 8, x + 16))}px`; card.style.top = `${y + 18 + h > innerHeight ? y - h - 12 : y + 18}px`; };
            const fill = (id, x, y) => { const b = byId[id]; if (!b) return; card.dataset.for = id; card.innerHTML = `<b>${esc(b.title)}</b><span class="m">${esc(b.author)} · ${MONTHS[(b.month || 1) - 1].toLowerCase()} ${b.year}</span>${stars(b.stars || 0)}<p>${esc(b.review || '')}</p>${b.longReview ? '<span class="m">click to open it</span>' : ''}${sample(b)}`; card.hidden = false; place(x, y); };
            col.addEventListener('pointermove', (e) => { const s = e.target.closest('.spine'); if (!s) { card.hidden = true; return; } if (card.hidden || card.dataset.for !== s.dataset.book) fill(s.dataset.book, e.clientX, e.clientY); else place(e.clientX, e.clientY); });
            col.addEventListener('pointerleave', () => { card.hidden = true; });
            col.querySelectorAll('.spine').forEach((s) => { s.addEventListener('focus', () => { const r = s.getBoundingClientRect(); fill(s.dataset.book, r.left, r.bottom); }); s.addEventListener('blur', () => { card.hidden = true; }); });
        },
        spread(root, R, id) {
            const b = R.books.find((x) => x.id === id);
            if (!b) { root.innerHTML = sheet('reading', 'Not on the shelf.', '', go('reading', '', '← the shelf', 'back')); return; }
            root.innerHTML = sheet('reading', `${esc(b.title)}${sample(b)}`, `${esc(b.author)} · finished ${MONTHS[(b.month || 1) - 1].toLowerCase()} ${b.year}`, `${go('reading', '', '← the shelf', 'back')}
                <div class="spread">
                    <div class="pg pg-l"><div class="cover-big" style="--c:${esc(b.spine || '#4a4a4a')}"><b>${esc(b.title)}</b><small>${esc(b.author)}</small></div><p class="meta">${stars(b.stars || 0)}</p></div>
                    <div class="pg pg-r"><div class="body">${String(b.longReview || b.review || '').split(/\n\s*\n/).map((p) => `<p>${esc(p)}</p>`).join('')}</div></div>
                </div>`);
        },
    };

    // ─── writing: manuscript paper, 稿纸 ───
    const writing = {
        render(root) {
            const W = window.WRITING || { posts: [] };
            const posts = W.posts.slice().sort((a, b) => b.date.localeCompare(a.date));
            root.innerHTML = sheet('writing', 'Things I wrote down', `${posts.length} ${posts.length === 1 ? 'piece' : 'pieces'} · essays and notes · they live on <a href="${esc(W.substack || '#')}" rel="noopener">substack ↗</a>`, `<div class="gaozhi">
                <ol class="posts">${posts.map((p) => `<li><span class="pdate">${esc(shortDate(p.date))}</span><div><a class="ptitle" href="${esc(p.url)}" rel="noopener">${esc(p.title)}<span class="arrow">↗</span></a>${sample(p)}<p class="pblurb">${esc(p.blurb)}</p></div></li>`).join('') || '<li class="quiet">nothing yet.</li>'}</ol>
                <p class="gz-foot"><span>20 × 20 = 400</span><span>邬欣汝 · 稿纸</span></p>
            </div>`);
        },
    };

    // ─── projects: a drafting board, the first sketch on tracing paper over what it became ───
    const STATUS = { live: ['成', 'shipped'], building: ['工', 'building'], idea: ['念', 'an idea'] };
    const seal = (p) => { const [zi, word] = STATUS[p.status] || ['作', p.status]; return `<span class="st st-${esc(p.status)}" title="${esc(word)}" aria-label="${esc(word)}">${zi}</span>`; };
    const faceFinal = (p) => (p.final ? `<img src="${esc(p.final)}" alt="${esc(p.title)}">` : `<span class="inkmark" aria-hidden="true">${esc(p.zi || '作')}</span>`);
    const faceSketch = (p) => (p.sketch ? `<img src="${esc(p.sketch)}" alt="First sketch of ${esc(p.title)}">` : `<span class="pencil" aria-hidden="true">${esc(p.zi || '作')}</span>`);
    const projLink = (p) => (p.link ? (/^https?:/.test(p.link) ? `<a href="${esc(p.link)}" rel="noopener">${esc(p.linkLabel || 'open it')} ↗</a>` : go(p.link.split('/')[0], undefined, `${esc(p.linkLabel || 'open it')} →`)) : '');
    const projects = {
        render(root, param) {
            const P = window.PROJECTS || [];
            const sel = P.find((p) => p.id === param) || P[0];
            const board = (p) => (!p ? '' : `<div class="board-face" tabindex="0" aria-label="${esc(p.title)}: the first sketch on tracing paper over what it became. Hover or press to lift the paper.">
                    <div class="final">${faceFinal(p)}</div>
                    <div class="trace">${faceSketch(p)}<span class="trace-note">first sketch</span></div>
                    <i class="tape tl"></i><i class="tape tr"></i>
                    <span class="lift-hint">lift the tracing paper</span></div>
                <div class="board-meta"><p class="k">${seal(p)} ${esc((STATUS[p.status] || [])[1] || p.status)} · ${esc(p.year)}</p><h3>${esc(p.title)}${sample(p)}</h3><p class="line">${esc(p.line)}</p>${projLink(p) ? `<p>${projLink(p)}</p>` : ''}
                    <div class="write-up">${(p.sections || []).map((s) => `<section><h4>${esc(s.heading)}</h4><p>${esc(s.text)}</p></section>`).join('')}</div></div>`);
            root.innerHTML = sheet('projects', 'Things I\'ve made', `${P.length} things · data tools, small experiments and a game`, `<div class="bench">
                <ol class="plist">${P.map((p, i) => `<li>${go('projects', p.id, `<span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(p.title)}</span>${seal(p)}<span class="y">${esc(p.year)}</span>`, p === sel ? 'on' : '', `data-id="${esc(p.id)}"`)}</li>`).join('')}</ol>
                <div class="board" id="board">${board(sel)}</div>
            </div>`, 'col-wide');
            // Passing over a row shows it on the board; clicking keeps it there
            const col = root.querySelector('.col'), list = col.querySelector('.plist'), bd = col.querySelector('#board');
            let t;
            const show = (id) => { const p = P.find((x) => x.id === id); if (p && bd.dataset.showing !== id) { bd.dataset.showing = id; bd.innerHTML = board(p); } };
            list.addEventListener('pointerover', (e) => { const a = e.target.closest('a[data-id]'); if (!a || matchMedia('(hover: none)').matches) return; clearTimeout(t); t = setTimeout(() => show(a.dataset.id), 70); });
            list.addEventListener('pointerleave', () => { clearTimeout(t); if (sel) show(sel.id); });
            bd.addEventListener('click', (e) => { const f = e.target.closest('.board-face'); if (f) f.classList.toggle('lifted'); });
            bd.addEventListener('keydown', (e) => { const f = e.target.closest('.board-face'); if (f && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); f.classList.toggle('lifted'); } });
        },
    };

    // ─── life: a handscroll, the year in brush strokes, a to-do list, a record ───
    const RECORD = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="#26201f"/><g fill="none" stroke="#f4efe4" stroke-width=".6" opacity=".22"><circle cx="50" cy="50" r="43"/><circle cx="50" cy="50" r="38"/><circle cx="50" cy="50" r="33"/><circle cx="50" cy="50" r="28"/><circle cx="50" cy="50" r="23"/></g><path d="M18 36 A35 35 0 0 1 36 18" stroke="#f4efe4" stroke-width="1.6" opacity=".3" fill="none" stroke-linecap="round"/><circle cx="50" cy="50" r="15" fill="#b3362b"/><text x="50" y="51" text-anchor="middle" dominant-baseline="central" font-family="Ma Shan Zheng, KaiTi, serif" font-size="13" fill="#f4efe4">乐</text><circle cx="50" cy="50" r="1.6" fill="#f4efe4"/></svg>`;
    const life = {
        render(root) {
            const L = window.LIFE || {}, M = L.music || {};
            const tl = (L.timeline || []).slice().sort((a, b) => a.year - b.year);
            // Progress is a brush stroke: as long as the share of the goal done
            const brush = (s) => { if (!s.goal) return ''; const p = Math.max(0, Math.min(100, (s.value / s.goal) * 100)); return `<svg class="brush" viewBox="0 0 200 16" preserveAspectRatio="none" role="img" aria-label="${Math.round(p)}% of ${s.goal}"><path class="bt" d="M4 8 H196"/>${p > 0 ? `<path class="bi" d="M4 8 H196" pathLength="100" style="stroke-dasharray:${p.toFixed(1)} 100"/>` : ''}</svg>`; };
            root.innerHTML = sheet('life', 'Life, so far', `${tl.length} moments · ${new Date().getFullYear()} in numbers · to do · music`, `
                <div class="handscroll" tabindex="0" aria-label="Timeline, scrolls sideways"><div class="track">${tl.map((m, i) => `<div class="ev ${i % 2 ? 'below' : 'above'}"><div class="ev-mid"><i></i><span>${esc(m.year)}</span></div><div class="ev-body"><b>${esc(m.title)}</b>${m.place ? `<span class="pl">${esc(m.place)}</span>` : ''}${sample(m)}<p>${esc(m.text)}${/chicken/i.test(m.text) ? ` ${go('play', undefined, 'play it →')}` : ''}</p></div></div>`).join('')}</div></div>
                <h3>2026 in numbers <span class="dated">${L.statsUpdated ? date(L.statsUpdated) : ''}</span></h3>
                <div class="numbers">${(L.stats2026 || []).map((s) => `<div class="num"><span class="lbl">${esc(s.label)}${s.goal ? ` · of ${s.goal}` : ''}${sample(s)}</span><b>${Number(s.value).toLocaleString('en-GB')}${s.unit ? `<small>${esc(s.unit)}</small>` : ''}</b>${brush(s)}</div>`).join('')}</div>
                <div class="life-two">
                    <section><h3>to do</h3><ul class="todo">${(L.goals || []).map((g) => `<li class="${g.done ? 'done' : ''}"><span>${esc(g.text)}</span>${sample(g)}</li>`).join('')}</ul></section>
                    <section><h3>music</h3><div class="music"><div class="record">${RECORD}</div><div class="music-notes"><p><span class="k">I play</span>${(M.instruments || []).map(esc).join(', ')}${sample(M)}</p><p><span class="k">I dance</span>${(M.dance || []).map(esc).join(', ')}</p><p><a href="${esc(M.spotify || '#')}" rel="noopener">my spotify ↗</a></p></div></div></section>
                </div>`);
        },
    };

    // ─── play ───
    const play = {
        render(root) {
            root.innerHTML = sheet('play', 'Chasing chickens', 'a courtyard in the village · 45 seconds · arrow keys or <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to run, or hold your finger where you want to go', `<div class="play-wrap">
                <p class="story">When I was little, in my village in China, I spent whole afternoons chasing the chickens round the courtyard. I never caught a single one. Your turn.</p>
                ${tile('courtyard.game', `<div class="hud" aria-live="polite"><span>caught <b id="score">0</b></span><span>time <b id="time">45</b></span></div>
                    <div id="stage"><canvas id="game" width="200" height="125" tabindex="0" aria-label="The courtyard. Use the arrow keys, or hold where you want to run."></canvas><div id="bubbles" aria-hidden="true"></div></div>
                    <div class="overlay" id="intro"><span class="zh" aria-hidden="true">抓鸡</span><h3>catch the chickens</h3><p>45 seconds. They run faster than you, but they tire. Corner them by the well or the haystack.</p><button class="press" id="start" type="button">start</button></div>
                    <div class="overlay" id="over" hidden><h3>time's up</h3><span class="big" id="final">0</span><p>chickens caught. <span id="verdict"></span></p><p>your best: <b id="best">0</b> · six-year-old me: <b>0</b></p><button class="press" id="again" type="button">again</button></div>`, 'game-tile')}
            </div>`, 'play-col');
            window.ChickenGame?.mount(root.querySelector('.game-tile .tile-body'));
        },
        unmount() { window.ChickenGame?.unmount(); },
    };

    return { about, travel, reading, writing, projects, life, play };
})();
