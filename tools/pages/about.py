page('about/index.html', 'About', 'Who I am, in a few small files.', 'about', '''
        /* Everything on this page is a small file or a print, left on the desk */
        .about-grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 2.5rem 3rem; align-items: start; }
        .file { font-size: 1.05rem; line-height: 1.7; }
        .file .win-body { padding: 1.4rem 1.6rem; }
        .file p + p { margin-top: 0.9rem; }
        .file h2 { font: 400 0.72rem/1 var(--pixel); letter-spacing: 0.08em; color: var(--muted); margin-bottom: 1rem; }
        /* The honest edit: crossed out in pen, the new words written in above */
        .edit { position: relative; white-space: nowrap; }
        .edit s { text-decoration: none; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10' preserveAspectRatio='none'%3E%3Cpath d='M0 6 C25 3 50 8 100 4' fill='none' stroke='%233d52b5' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E") center / 100% 10px no-repeat; color: var(--muted); }
        .edit ins { position: absolute; left: 0; top: -1.15em; text-decoration: none; font: 500 1.2rem/1 var(--hand); color: var(--pen); white-space: nowrap; transform: rotate(-2deg); }
        .edit .caret { color: var(--pen); font-family: var(--hand); font-size: 1.1rem; }
        /* languages.txt: pen strokes for how well */
        .langs { list-style: none; padding: 0; display: grid; gap: 0.55rem; }
        .langs li { display: grid; gap: 0.1rem; }
        .langs .l-row { display: flex; align-items: baseline; gap: 0.9rem; }
        .langs .l-row b { min-width: 6rem; }
        .langs .l-row .strokes { margin-left: auto; }
        .langs .hello { font-family: var(--brush), var(--serif-display); font-size: 1.2rem; }
        .langs .l-note { color: var(--muted); font-size: 0.9rem; font-style: italic; display: flex; gap: 0.5rem; align-items: baseline; }
        .strokes { display: inline-flex; gap: 3px; }
        .strokes i { display: block; width: 9px; height: 16px; border-radius: 2px; background: var(--pen); transform: skewX(-8deg) rotate(2deg); opacity: 0.85; }
        .strokes i.off { background: none; border: 1px solid rgb(61 82 181 / 0.35); opacity: 0.6; }
        /* now.txt and likes.txt */
        .now { list-style: none; padding: 0; display: grid; gap: 0.35rem; font-family: var(--mono); font-size: 0.92rem; }
        .now b { font-weight: 500; color: var(--pen); }
        .likes { display: flex; flex-wrap: wrap; gap: 0.3rem 0.9rem; font: 500 1.3rem/1.3 var(--hand); color: var(--ink-soft); }
        .likes span:nth-child(3n) { color: var(--pen); transform: rotate(-3deg); display: inline-block; }
        /* Prints clipped to the page */
        .prints-row { display: flex; gap: 1.25rem; flex-wrap: wrap; align-items: flex-end; padding-block: 0.5rem 1.5rem; }
        .dprint { position: relative; width: 170px; padding: 8px 8px 30px; background: #fff; box-shadow: 0 1px 2px rgb(31 42 48 / 0.08), 0 14px 24px -12px rgb(31 42 48 / 0.3); transform: rotate(var(--tilt)); }
        .dprint .img { aspect-ratio: 4 / 3; background: repeating-linear-gradient(135deg, #ece6d8 0 6px, #f6f2e9 6px 12px); display: grid; place-items: center; color: var(--muted); font: 0.7rem var(--mono); overflow: hidden; }
        .dprint .img img { width: 100%; height: 100%; object-fit: cover; }
        .dprint .cap { position: absolute; left: 10px; right: 10px; bottom: 6px; font: 500 1.1rem/1.1 var(--hand); color: var(--pen); }
        .dprint::before { content: ''; position: absolute; top: -12px; left: 18px; width: 12px; height: 30px; border: 1.5px solid var(--ink); border-radius: 6px; border-bottom-color: transparent; }
        /* The line under the lens */
        .secret { position: relative; padding: 1.5rem 1.6rem 2rem; user-select: none; }
        .secret h2 { font: 400 0.72rem/1 var(--pixel); letter-spacing: 0.08em; color: var(--muted); margin-bottom: 0.9rem; }
        .secret .text { position: relative; font-size: 1.2rem; line-height: 1.8; max-width: 36rem; }
        .secret .cipher { color: var(--ink-soft); letter-spacing: 0.02em; }
        .secret .plain { position: absolute; inset: 0; color: var(--ink); clip-path: circle(var(--lr, 56px) at var(--lx, 70px) var(--ly, 24px)); }
        .lens { position: absolute; left: 0; top: 0; width: 120px; height: 120px; margin: -60px 0 0 -60px; cursor: grab; touch-action: none; transform: translate(var(--lx, 70px), var(--ly, 24px)); filter: drop-shadow(0 8px 10px rgb(31 42 48 / 0.18)); }
        .lens:active { cursor: grabbing; }
        .lens svg { width: 100%; height: 100%; overflow: visible; }
        .secret .hint { margin-top: 0.75rem; font: 500 1.15rem/1.2 var(--hand); color: var(--pen); }
        .secret .read-plain { margin-left: 1rem; font: 0.8rem var(--mono); color: var(--muted); background: none; border: 0; text-decoration: underline; cursor: pointer; }
        .secret.open .plain { clip-path: none; }
        @media (max-width: 760px) { .about-grid { grid-template-columns: 1fr; } }
''', '''
    <main class="page">
        <div class="page-head">
            <span class="watermark" aria-hidden="true">我</span>
            <p class="eyebrow">About</p>
            <h1>Hello, I'm Natalie</h1>
            <p>Or 欣汝, at home. A few small files about me, left out on the desk.</p>
            ''' + note('nothing here is polished on purpose', '5rem') + '''
        </div>

        <div class="prints-row" id="prints"></div>

        <div class="about-grid">
            <div class="window file" data-title="about.txt"><h2>about.txt</h2><div id="bio"></div></div>
            <div style="display:grid;gap:2.5rem">
                <div class="window file tilt-r" data-title="languages.txt"><h2>languages.txt</h2><ul class="langs" id="langs"></ul></div>
                <div class="window file tilt-l" data-title="now.txt"><h2>now.txt <span id="now-date" style="letter-spacing:0;text-transform:none"></span></h2><ul class="now" id="now"></ul></div>
            </div>
            <div class="window file" data-title="likes.txt"><h2>likes.txt</h2><div class="likes" id="likes"></div></div>
            <div class="window secret blue" data-title="the line under the lens" id="secret">
                <h2>secret.txt</h2>
                <div class="text">
                    <p class="cipher" aria-hidden="true"></p>
                    <p class="plain" id="plain"></p>
                    <div class="lens" id="lens" role="img" aria-label="A magnifying glass. Drag it over the text to read it.">
                        <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="rgb(255 255 255 / 0.06)" stroke="#1f2a30" stroke-width="3"/><circle cx="60" cy="60" r="48" fill="none" stroke="rgb(255 255 255 / 0.7)" stroke-width="1.5"/><path d="M34 44 a30 30 0 0 1 14 -14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/><path d="M98 98 L132 132" stroke="#1f2a30" stroke-width="12" stroke-linecap="round"/><path d="M100 100 L128 128" stroke="#c79a5b" stroke-width="6" stroke-linecap="round"/></svg>
                    </div>
                </div>
                <p class="hint">drag the glass over it <button class="read-plain" type="button" id="read-plain">or just read it</button></p>
            </div>
        </div>
    </main>
''', '''    <script src="../data/about.js"></script>
    <script>
        const { esc, sample, date } = SITE;
        const AB = window.ABOUT || {};
        // about.txt, with the edit crossed out in pen
        const edit = AB.edit ? `<span class="edit"><s>${esc(AB.edit.before)}</s><ins>${esc(AB.edit.after)}</ins><span class="caret" aria-hidden="true">^</span></span>` : '';
        document.getElementById('bio').innerHTML = (AB.bio || []).map((p) => `<p>${esc(p.text).replace('{edit}', edit)}${sample(p)}</p>`).join('');
        document.getElementById('langs').innerHTML = (AB.languages || []).map((l) => `
            <li><div class="l-row"><b>${esc(l.name)}</b><span class="hello">${esc(l.hello)}</span>
                <span class="strokes" role="img" aria-label="${l.level} out of 5">${[1, 2, 3, 4, 5].map((k) => `<i class="${k <= l.level ? '' : 'off'}"></i>`).join('')}</span></div>
                ${l.note || l.sample ? `<div class="l-note">${esc(l.note || '')}${sample(l)}</div>` : ''}</li>`).join('');
        document.getElementById('now-date').textContent = window.SITE_INFO ? `· ${date(SITE_INFO.updated)}` : '';
        document.getElementById('now').innerHTML = (AB.now || []).map((n) => `<li><b>${esc(n.label)}:</b> ${esc(n.text)}${sample(n)}</li>`).join('');
        document.getElementById('likes').innerHTML = (AB.likes || []).map((x) => `<span>${esc(x)}</span>`).join('');
        document.getElementById('prints').innerHTML = (AB.prints || []).map((p, i) => `
            <figure class="dprint" style="--tilt:${[-4, 2, -1][i % 3]}deg"><div class="img">${p.image ? `<img src="../${esc(p.image)}" alt="">` : 'photo'}</div><figcaption class="cap">${esc(p.caption)}${sample(p)}</figcaption></figure>`).join('');

        // The secret line: shown as Greek letters and characters, readable only through the glass
        const secret = AB.secret || '';
        const plain = document.getElementById('plain'), cipher = document.querySelector('.cipher'), box = document.getElementById('secret'), lens = document.getElementById('lens');
        plain.textContent = secret;
        if (AB.secretSample) box.querySelector('.hint').insertAdjacentHTML('afterbegin', '<span class="sample">sample</span> ');
        const POOL = 'αβγδεζηθικλμνξοπρστυφχψω马水鱼山风月花书雨光';
        const scramble = () => { cipher.textContent = [...secret].map((ch) => (/\\s/.test(ch) ? ch : POOL[(Math.random() * POOL.length) | 0])).join(''); };
        scramble();
        if (!SITE.reduce) setInterval(() => { if (!box.classList.contains('open')) scramble(); }, 160);
        // Drag the glass; the readable text is clipped to a circle under it
        const text = box.querySelector('.text');
        const move = (e) => {
            const r = text.getBoundingClientRect();
            const x = Math.max(0, Math.min(r.width, e.clientX - r.left)), y = Math.max(0, Math.min(r.height, e.clientY - r.top));
            text.style.setProperty('--lx', `${x}px`); text.style.setProperty('--ly', `${y}px`);
        };
        lens.addEventListener('pointerdown', (e) => {
            e.preventDefault(); lens.setPointerCapture(e.pointerId);
            const up = () => { lens.removeEventListener('pointermove', move); };
            lens.addEventListener('pointermove', move);
            lens.addEventListener('pointerup', up, { once: true }); lens.addEventListener('pointercancel', up, { once: true });
        });
        document.getElementById('read-plain').addEventListener('click', (e) => { box.classList.toggle('open'); e.target.textContent = box.classList.contains('open') ? 'hide it again' : 'or just read it'; });
    </script>
''')
