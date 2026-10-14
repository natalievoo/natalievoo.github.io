exec(open(PAGES + '/_music.py', encoding='utf-8').read())

page('life/index.html', 'Life', 'A scroll of years, 2026 in numbers, goals and music.', 'life', '''
        /* The timeline is a handscroll: read it by scrolling sideways, a river running through */
        .scroll-wrap { position: relative; margin-inline: calc(50% - 50vw); padding-inline: max(1rem, calc(50vw - 36rem)); }
        .handscroll {
            position: relative; display: flex; gap: 0; overflow-x: auto; scroll-snap-type: x proximity;
            padding: 0.5rem 0 0.5rem; scrollbar-width: thin;
        }
        .roller { flex: none; width: 18px; border-radius: 9px; background: linear-gradient(90deg, #6a412a, #a8743f 40%, #6a412a); box-shadow: 0 6px 12px rgb(60 35 15 / 0.25); }
        .silk { position: relative; display: flex; flex: none; background: #f8f3e8; border-block: 10px solid #c79a5b; box-shadow: var(--shadow); }
        .silk::before { content: ''; position: absolute; left: 0; right: 0; bottom: 18px; height: 22px; background: linear-gradient(90deg, rgb(61 139 125 / 0.25), rgb(47 93 140 / 0.25), rgb(61 139 125 / 0.25)); border-radius: 50%; filter: blur(2px); }
        .moment { position: relative; flex: none; width: 260px; padding: 1.75rem 1.5rem 4rem; scroll-snap-align: start; display: grid; align-content: start; gap: 0.35rem; }
        .moment + .moment { border-left: 1px dashed rgb(31 42 48 / 0.12); }
        .moment .yr { font: 600 2.6rem/1 var(--serif-display); color: var(--seal); }
        .moment h3 { font-size: 1.35rem; }
        .moment p { color: var(--ink-soft); font-size: 0.95rem; }
        .moment .place { font: 0.7rem var(--mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
        .moment .node { position: absolute; left: 1.5rem; bottom: 22px; width: 14px; height: 14px; border-radius: 50%; background: var(--seal); box-shadow: 0 0 0 4px #f8f3e8; }
        .moment a { font-size: 0.9rem; }
        .hint { color: var(--muted); font-size: 0.85rem; }
        /* 2026 in numbers */
        .stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .stat { display: grid; gap: 0.3rem; }
        .stat b { font: 600 2.8rem/1 var(--serif-display); font-variant-numeric: tabular-nums; }
        .stat b small { font-size: 1rem; color: var(--muted); margin-left: 0.2rem; }
        .stat > span { color: var(--muted); font-size: 0.9rem; }
        .bar { height: 6px; border-radius: 3px; background: rgb(31 42 48 / 0.08); overflow: hidden; }
        .bar i { display: block; height: 100%; width: var(--p); background: var(--malachite); border-radius: 3px; }
        /* Goals: ticked with a pen */
        .goals { display: grid; gap: 0.4rem; list-style: none; padding: 0; max-width: 40rem; }
        .goal { display: grid; grid-template-columns: 2rem 1fr; gap: 0.75rem; align-items: center; padding-block: 0.6rem; border-bottom: 1px solid var(--line); font-size: 1.1rem; }
        .goal svg { width: 1.6rem; height: 1.6rem; }
        .goal .box { fill: none; stroke: var(--ink); stroke-width: 1.6; }
        .goal .tick { fill: none; stroke: var(--seal); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 40; stroke-dashoffset: 40; }
        .goal.done .tick { animation: draw 0.6s var(--ease-out) forwards; animation-delay: var(--d); }
        .goal.done span { text-decoration: line-through; text-decoration-color: var(--seal); color: var(--muted); }
        @keyframes draw { to { stroke-dashoffset: 0; } }
''' + MUSIC_CSS, '''
    <main class="page">
        <div class="page-head">
            <span class="watermark" aria-hidden="true">生</span>
            <p class="eyebrow">Life</p>
            <h1>A scroll of years</h1>
            <p>The handscroll of my life so far, this year in numbers, what I want to do before it ends, and what I'm listening to.</p>
            ''' + note('still being written', '5rem') + '''
        </div>
        <section class="section">
            <div class="section-head"><h2>Timeline</h2><p class="hint">Scroll sideways, like unrolling a scroll →</p></div>
            <div class="window blue" data-title="the handscroll"><div class="handscroll" id="timeline" tabindex="0" aria-label="Timeline, scroll sideways"></div></div>
        </section>
        <section class="section">
            <div class="section-head"><h2>2026 in numbers</h2><p id="updated"></p></div>
            <div class="stats" id="stats"></div>
        </section>
        <section class="section">
            <div class="section-head"><h2>Before the year ends</h2></div>
            <div class="window tilt-l" data-title="to do" style="max-width:40rem"><ul class="goals" id="goals"></ul></div>
        </section>
        <section class="section">
            <div class="section-head"><h2>Music</h2><p>press play ↓</p></div>
            <div class="music-desk" id="music-desk">
                <div class="player">
                    ''' + TURNTABLE + '''
                    <div class="notes" aria-hidden="true"><span>♪</span><span>♫</span><span>♪</span></div>
                    <button class="play" type="button" aria-pressed="false" aria-label="Play the record">''' + PLAY_ICON + '''</button>
                </div>
                <div class="stage">''' + DANCER + '''</div>
                <div class="music-notes" id="music"></div>
            </div>
        </section>
    </main>
''', '''    <script src="../data/life.js"></script>
    <script>
        const { esc, sample, date } = SITE;
        const L = window.LIFE || {};
        document.getElementById('timeline').innerHTML = `<span class="roller" aria-hidden="true"></span><div class="silk">${(L.timeline || []).map((m) => `
            <article class="moment">
                <span class="yr">${esc(m.year)}</span>
                <h3>${esc(m.title)}${sample(m)}</h3>
                ${m.place ? `<span class="place">${esc(m.place)}</span>` : ''}
                <p>${esc(m.text)}</p>
                ${/chicken/i.test(m.text) ? '<a href="../play/index.html">Play the memory →</a>' : ''}
                <span class="node" aria-hidden="true"></span>
            </article>`).join('')}</div><span class="roller" aria-hidden="true"></span>`;
        document.getElementById('updated').textContent = L.statsUpdated ? `Updated ${date(L.statsUpdated)}` : '';
        document.getElementById('stats').innerHTML = (L.stats2026 || []).map((s) => `
            <div class="stat postit">
                <b>${Number(s.value).toLocaleString('en-GB')}${s.unit ? `<small>${esc(s.unit)}</small>` : ''}</b>
                <span>${esc(s.label)}${s.goal ? ` · goal ${s.goal}` : ''}${sample(s)}</span>
                ${s.goal ? `<div class="bar" role="img" aria-label="${Math.round(s.value / s.goal * 100)}% of goal"><i style="--p:${Math.min(100, s.value / s.goal * 100)}%"></i></div>` : ''}
            </div>`).join('');
        document.getElementById('goals').innerHTML = (L.goals || []).map((g, i) => `
            <li class="goal${g.done ? ' done' : ''}" style="--d:${0.3 + i * 0.15}s">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect class="box" x="3" y="5" width="16" height="16" rx="3"/><path class="tick" d="M6 13 L10.5 18 L21 3"/></svg>
                <span>${esc(g.text)}${sample(g)}</span>
                <span class="sr" style="position:absolute;left:-9999px">${g.done ? 'done' : 'not done yet'}</span>
            </li>`).join('');
        const M = L.music || {};
        document.getElementById('music').innerHTML = `
            <div class="postit"><h3>I play${sample(M)}</h3><ul>${(M.instruments || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
            <div class="postit"><h3>I dance</h3><ul>${(M.dance || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
            <a class="button" href="${esc(M.spotify || '#')}" rel="noopener">my Spotify ↗</a>`;
        // Press play: the arm swings over, the record spins, and she dances
        const desk = document.getElementById('music-desk'), play = desk.querySelector('.play');
        const setPlaying = (on) => {
            desk.classList.toggle('playing', on);
            play.setAttribute('aria-pressed', String(on));
            play.setAttribute('aria-label', on ? 'Stop the record' : 'Play the record');
        };
        play.addEventListener('click', () => setPlaying(!desk.classList.contains('playing')));
        // It starts by itself the first time you scroll to it
        if (!SITE.reduce) {
            const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setPlaying(true), 400); io.disconnect(); } }, { threshold: 0.5 });
            io.observe(desk);
        }
    </script>
''')
