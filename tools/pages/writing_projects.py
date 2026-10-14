page('writing/index.html', 'Writing', 'Essays and notes, published on Substack.', 'writing', '''
        /* 稿纸: Chinese manuscript paper, one square per character */
        .manuscript {
            position: relative; padding: 2.5rem clamp(1rem, 4vw, 2.5rem);
            background: var(--paper); border: 1px solid rgb(179 54 43 / 0.35);
        }
        .manuscript-grid {
            position: absolute; inset: 0; pointer-events: none; opacity: 0.5;
            background:
                repeating-linear-gradient(90deg, rgb(179 54 43 / 0.18) 0 1px, transparent 1px 34px),
                repeating-linear-gradient(180deg, rgb(179 54 43 / 0.18) 0 1px, transparent 1px 34px, rgb(179 54 43 / 0.18) 34px 35px, transparent 35px 44px);
        }
        .posts { position: relative; display: grid; }
        .post { display: grid; grid-template-columns: 9rem 1fr auto; gap: 1.25rem; align-items: baseline; padding-block: 1.4rem; border-bottom: 1px solid var(--line); color: inherit; text-decoration: none; background: var(--paper); }
        .post time { font: 0.78rem var(--mono); color: var(--muted); letter-spacing: 0.05em; }
        .post h2 { font-size: clamp(1.4rem, 3vw, 1.9rem); background: linear-gradient(currentColor 0 0) left bottom / 0 1.5px no-repeat; transition: background-size 0.45s var(--ease-out); display: inline; }
        .post:hover h2 { background-size: 100% 1.5px; }
        .post p { color: var(--ink-soft); margin-top: 0.3rem; }
        .post .arrow { font-size: 1.3rem; color: var(--muted); transition: transform 0.35s var(--ease-back); }
        .post:hover .arrow { transform: translate(3px, -3px); color: var(--seal); }
        @media (max-width: 640px) { .post { grid-template-columns: 1fr auto; } .post time { grid-column: 1 / -1; } }
''', '''
    <main class="page">
        <div class="page-head">
            <span class="watermark" aria-hidden="true">写</span>
            <p class="eyebrow">Writing</p>
            <h1>Things I wrote down</h1>
            <p>Essays and notes. They live on Substack, where you can subscribe to get the next one.</p>
            <p><a class="button" id="substack" href="#" rel="noopener">Subscribe on Substack ↗</a></p>
            ''' + note('next one is brewing') + '''
        </div>
        <div class="window" data-title="on substack">
        <section class="manuscript">
            <div class="manuscript-grid" aria-hidden="true"></div>
            <div class="posts" id="posts"></div>
        </section>
        </div>
    </main>
''', '''    <script src="../data/writing.js"></script>
    <script>
        const { esc, date, sample } = SITE;
        const Wr = window.WRITING || { posts: [] };
        document.getElementById('substack').href = Wr.substack || '#';
        document.getElementById('posts').innerHTML = Wr.posts.slice().sort((a, b) => b.date.localeCompare(a.date)).map((p) => `
            <a class="post" href="${esc(p.url)}" rel="noopener">
                <time datetime="${esc(p.date)}">${date(p.date)}</time>
                <div><h2>${esc(p.title)}</h2>${sample(p)}<p>${esc(p.blurb)}</p></div>
                <span class="arrow" aria-hidden="true">↗</span>
            </a>`).join('') || '<p class="empty">Nothing yet. Add posts in data/writing.js.</p>';
    </script>
''')

PROJECT_CSS = '''
        .status { display: inline-flex; align-items: center; gap: 0.35rem; font: 0.72rem var(--mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
        .status::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--dot); }
        .status.idea { --dot: var(--ochre); } .status.building { --dot: var(--azurite); } .status.live { --dot: var(--malachite); }
        /* The sketch side: pencil on graph paper */
        .sketch {
            display: grid; place-items: center; position: relative;
            background:
                linear-gradient(rgb(47 93 140 / 0.12) 1px, transparent 1px) 0 0 / 16px 16px,
                linear-gradient(90deg, rgb(47 93 140 / 0.12) 1px, transparent 1px) 0 0 / 16px 16px, #fdfcf8;
        }
        .sketch .pencil { font-family: var(--brush); font-size: 5rem; color: transparent; -webkit-text-stroke: 1.2px #6b6b6b; filter: url(#pencil); transform: rotate(-4deg); }
        .sketch .note { position: absolute; left: 0.8rem; bottom: 0.6rem; font: italic 0.85rem var(--serif); color: #6b6b6b; transform: rotate(-2deg); }
        /* The final side: ink */
        .final { display: grid; place-items: center; background: var(--ink); color: var(--paper); }
        .final .ink { font-family: var(--brush); font-size: 5rem; }
        .final img, .sketch img { width: 100%; height: 100%; object-fit: cover; }
'''
PENCIL = '''    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
        <filter id="pencil"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.5"/></filter>
    </svg>
'''
FACES_JS = '''
        const face = (p, which) => which === 'sketch'
            ? `<div class="sketch">${p.sketch ? `<img src="../${esc(p.sketch)}" alt="First sketch of ${esc(p.title)}">` : `<span class="pencil" aria-hidden="true">${esc(p.zi || '作')}</span><span class="note">sketch goes here</span>`}</div>`
            : `<div class="final">${p.final ? `<img src="../${esc(p.final)}" alt="${esc(p.title)}">` : `<span class="ink" aria-hidden="true">${esc(p.zi || '作')}</span>`}</div>`;
'''

page('projects/index.html', 'Projects', 'Things I have made, from the first sketch to the finished thing.', 'projects', PROJECT_CSS + '''
        .toolbar { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; align-items: center; }
        .switch { display: inline-flex; padding: 3px; border-radius: 999px; background: rgb(31 42 48 / 0.07); }
        .switch button { border: 0; background: none; padding: 0.35rem 0.9rem; border-radius: 999px; cursor: pointer; font-size: 0.9rem; }
        .switch button[aria-pressed="true"] { background: var(--card); box-shadow: var(--shadow); }
        .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
        .card { display: grid; gap: 0.75rem; color: inherit; text-decoration: none; }
        .flip { position: relative; aspect-ratio: 4 / 3; perspective: 1000px; }
        .flip-in { position: absolute; inset: 0; transform-style: preserve-3d; transition: transform 0.7s var(--ease-in-out); }
        .flip-in > div { position: absolute; inset: 0; border-radius: 14px; overflow: hidden; backface-visibility: hidden; box-shadow: var(--shadow); }
        .flip-in > .final { transform: rotateY(180deg); }
        .show-final .flip-in { transform: rotateY(180deg); }
        .card:hover .flip-in { transform: rotateY(12deg); }
        .show-final .card:hover .flip-in { transform: rotateY(168deg); }
        .card:nth-child(odd) .flip { transform: rotate(-1.6deg); } .card:nth-child(3n) .flip { transform: rotate(1.4deg); }
        .card .flip { transition: transform 0.35s var(--ease-back); }
        .card:hover .flip { transform: rotate(0) translateY(-4px); }
        .flip-in > div { box-shadow: 0 14px 26px -12px rgb(31 42 48 / 0.3) !important; }
        .card h2 { font-size: 1.6rem; font-style: italic; font-weight: 500; }
        .card p { color: var(--ink-soft); font-size: 0.97rem; }
        .card .top { display: flex; justify-content: space-between; gap: 0.5rem; align-items: center; }
        @media (prefers-reduced-motion: reduce) { .flip-in { transition: none; } .card:hover .flip-in { transform: none; } .show-final .card:hover .flip-in { transform: rotateY(180deg); } }
''', PENCIL + '''
    <main class="page">
        <div class="page-head">
            <span class="watermark" aria-hidden="true">作</span>
            <p class="eyebrow">Projects</p>
            <h1>Things I've made</h1>
            <p>Data tools, creative experiments and a game. Flip between the first sketch and what each one became.</p>
            ''' + note('flip them! sketch → real thing') + '''
        </div>
        <div class="toolbar">
            <div class="chips" id="kinds" role="group" aria-label="Filter">
                <button class="chip" type="button" aria-pressed="true" data-kind="all">All</button>
                <button class="chip" type="button" aria-pressed="false" data-kind="data">Data</button>
                <button class="chip" type="button" aria-pressed="false" data-kind="creative">Creative</button>
            </div>
            <div class="switch" role="group" aria-label="Show">
                <button type="button" aria-pressed="true" data-side="sketch">Sketch</button>
                <button type="button" aria-pressed="false" data-side="final">Final</button>
            </div>
        </div>
        <section class="section"><div class="cards" id="cards"></div></section>
    </main>
''', '''    <script src="../data/projects.js"></script>
    <script>
        const { esc, sample } = SITE;
''' + FACES_JS + '''
        let kind = 'all';
        function draw() {
            document.getElementById('cards').innerHTML = (window.PROJECTS || []).filter((p) => kind === 'all' || p.kind === kind).map((p) => `
                <a class="card" href="project.html?p=${encodeURIComponent(p.id)}">
                    <div class="flip"><div class="flip-in">${face(p, 'sketch')}${face(p, 'final')}</div></div>
                    <div class="top"><span class="status ${esc(p.status)}">${esc(p.status)} · ${esc(p.year)}</span>${sample(p)}</div>
                    <h2>${esc(p.title)}</h2>
                    <p>${esc(p.line)}</p>
                </a>`).join('');
        }
        document.getElementById('kinds').addEventListener('click', (e) => {
            const b = e.target.closest('.chip'); if (!b) return;
            kind = b.dataset.kind;
            document.querySelectorAll('#kinds .chip').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
            draw();
        });
        document.querySelector('.switch').addEventListener('click', (e) => {
            const b = e.target.closest('button'); if (!b) return;
            document.querySelectorAll('.switch button').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
            document.querySelector('main').classList.toggle('show-final', b.dataset.side === 'final');
        });
        draw();
    </script>
''')

page('projects/project.html', 'Project', 'A project, from sketch to finished.', 'projects', PROJECT_CSS + '''
        .proj-head { display: grid; gap: 0.75rem; padding-block: 2rem; max-width: 44rem; }
        .proj-head h1 { font-size: clamp(2.6rem, 6vw, 4rem); }
        .proj-head p { font-size: 1.2rem; color: var(--ink-soft); }
        .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .pair figure { display: grid; gap: 0.5rem; }
        .pair figure > div { aspect-ratio: 4 / 3; border-radius: 14px; overflow: hidden; box-shadow: var(--shadow); }
        .pair figcaption { font: 0.75rem var(--mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
        .write-up { display: grid; gap: 2rem; max-width: 40rem; padding-top: 2.5rem; }
        .write-up h2 { font-size: 1.7rem; margin-bottom: 0.4rem; }
        @media (max-width: 640px) { .pair { grid-template-columns: 1fr; } }
''', PENCIL + '''
    <main class="page" id="project">
        <a class="back" href="index.html">← All projects</a>
    </main>
''', '''    <script src="../data/projects.js"></script>
    <script>
        const { esc, sample, param, root } = SITE;
''' + FACES_JS + '''
        const p = (window.PROJECTS || []).find((x) => x.id === param('p'));
        const main = document.getElementById('project');
        if (!p) {
            main.insertAdjacentHTML('beforeend', '<div class="page-head"><h1>Not made yet</h1><p>There is no project with that name in data/projects.js.</p></div>');
        } else {
            document.title = `${p.title} · Natalie Voo`;
            main.insertAdjacentHTML('beforeend', `
                <div class="proj-head">
                    <span class="status ${esc(p.status)}">${esc(p.status)} · ${esc(p.kind)} · ${esc(p.year)}</span>
                    <h1>${esc(p.title)}${sample(p)}</h1>
                    <p>${esc(p.line)}</p>
                    ${p.link ? `<p><a class="button" href="${/^https?:/.test(p.link) ? esc(p.link) : root + esc(p.link)}">${esc(p.linkLabel || 'Open it')} ↗</a></p>` : ''}
                </div>
                <div class="pair">
                    <figure>${face(p, 'sketch')}<figcaption>First sketch</figcaption></figure>
                    <figure>${face(p, 'final')}<figcaption>What it became</figcaption></figure>
                </div>
                <div class="write-up">${(p.sections || []).map((s) => `<section><h2>${esc(s.heading)}</h2><p>${esc(s.text)}</p></section>`).join('')}</div>`);
        }
    </script>
''')
