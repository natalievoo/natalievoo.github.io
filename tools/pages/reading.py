page('reading/index.html', 'Reading', 'Favourite books, a pick from every month, and every year ranked.', 'reading', '''
        /* The shelf: favourite books as spines; hover pulls one out */
        .shelf { position: relative; display: flex; align-items: flex-end; gap: 6px; min-height: 260px; padding: 1.5rem 1.5rem 0; overflow-x: auto; }
        .shelf::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 14px; background: #8a5a2b; border-radius: 3px; box-shadow: 0 8px 14px rgb(60 35 15 / 0.25), inset 0 2px 0 #a8743f; }
        .spine {
            position: relative; z-index: 1; flex: none; display: flex; align-items: center; justify-content: center;
            width: var(--w); height: var(--h); margin-bottom: 14px; padding: 0.75rem 0.25rem; border-radius: 3px 3px 1px 1px;
            background: var(--bg); color: #fbf6ec; text-decoration: none;
            box-shadow: inset -4px 0 0 rgb(0 0 0 / 0.14), inset 3px 0 0 rgb(255 255 255 / 0.12);
            transition: transform 0.35s var(--ease-back);
        }
        .spine:hover, .spine:focus-visible { transform: translateY(-14px); color: #fff; }
        .spine span { writing-mode: vertical-rl; font: 600 1rem/1.1 var(--serif-display); letter-spacing: 0.02em; max-height: 100%; overflow: hidden; }
        .spine::before { content: ''; position: absolute; left: 0; right: 0; top: 14px; height: 2px; background: rgb(255 255 255 / 0.35); }
        .lean { transform: rotate(-8deg); transform-origin: bottom left; margin-left: 10px; }
        .lean:hover { transform: rotate(-8deg) translateY(-14px); }
        /* A book a month */
        .months { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; }
        .month { display: grid; gap: 0.35rem; align-content: start; min-height: 150px; padding: 0.9rem; border-radius: 12px; background: var(--card); border: 1px solid var(--line); color: inherit; text-decoration: none; }
        .month.empty-month { background: transparent; border-style: dashed; color: var(--muted); }
        .month:nth-child(odd) { transform: rotate(-1.3deg); } .month:nth-child(3n) { transform: rotate(1.6deg); }
        a.month { box-shadow: 0 10px 20px -10px rgb(31 42 48 / 0.25); transition: transform 0.25s var(--ease-back); }
        a.month:hover { transform: rotate(0) translateY(-3px); }
        .month .m { font: 0.7rem var(--mono); letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
        .month .cover { height: 6px; border-radius: 3px; background: var(--bg, var(--line)); }
        .month b { font: 600 1.15rem/1.15 var(--serif-display); }
        .month small { color: var(--muted); }
        a.month:hover { border-color: var(--ink); }
        /* Ranked */
        .ranked { display: grid; gap: 0; counter-reset: rank; }
        .rank:last-child { border-bottom: 0; }
        .rank { display: grid; grid-template-columns: 3rem 1fr auto; gap: 1rem; align-items: baseline; padding-block: 0.9rem; border-bottom: 1px solid var(--line); }
        .rank::before { counter-increment: rank; content: counter(rank); font: 600 1.8rem/1 var(--serif-display); color: var(--seal); }
        .rank b { font: 600 1.25rem var(--serif-display); }
        .rank .by { color: var(--muted); }
        .rank p { grid-column: 2 / -1; color: var(--ink-soft); font-size: 0.95rem; }
''', '''
    <main class="page">
        <div class="page-head">
            <span class="watermark" aria-hidden="true">读</span>
            <p class="eyebrow">Reading</p>
            <h1>On the shelf</h1>
            <p>The books I keep coming back to, my favourite from each month, and every year ranked. Everything I read is also on Goodreads.</p>
            <p><a class="button" id="goodreads" href="#" rel="noopener">Goodreads ↗</a></p>
            ''' + note('the really good ones get a long review', '6rem') + '''
        </div>
        <section class="section">
            <div class="section-head"><h2>Favourites</h2><p>Pull one out to read why.</p></div>
            <div class="window" data-title="favourites"><div class="shelf" id="shelf"></div></div>
        </section>
        <section class="section">
            <div class="section-head"><h2>A book a month</h2><div class="chips" id="years" role="group" aria-label="Year"></div></div>
            <div class="months" id="months"></div>
        </section>
        <section class="section">
            <div class="section-head"><h2 id="ranked-title">Ranked</h2></div>
            <div class="window blue tilt-r" data-title="in order" style="max-width:48rem"><ol class="ranked" id="ranked" style="list-style:none;padding:0 0.5rem"></ol></div>
        </section>
    </main>
''', '''    <script src="../data/reading.js"></script>
    <script>
        const { esc, stars, sample, MONTHS } = SITE;
        const R = window.READING || { books: [] };
        document.getElementById('goodreads').href = R.goodreads || '#';
        const link = (b) => (b.longReview ? `review.html?b=${encodeURIComponent(b.id)}` : null);
        // Spines: width and height vary a little per book, so the shelf looks real
        const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
        const favs = R.books.filter((b) => b.favourite);
        document.getElementById('shelf').innerHTML = favs.map((b, i) => {
            const h = hash(b.id), tag = link(b) ? 'a' : 'span';
            return `<${tag} class="spine${i === favs.length - 1 && favs.length > 3 ? ' lean' : ''}" ${link(b) ? `href="${link(b)}"` : 'tabindex="0"'} title="${esc(b.title)}, ${esc(b.author)}"
                style="--bg:${esc(b.spine || '#2f5d8c')};--w:${44 + (h % 22)}px;--h:${190 + (h % 50)}px"><span>${esc(b.title)}</span></${tag}>`;
        }).join('') || '<p class="empty">Mark books with favourite: true to shelve them here.</p>';

        const years = [...new Set(R.books.map((b) => b.year))].sort((a, b) => b - a);
        let year = years[0];
        const chips = document.getElementById('years');
        chips.innerHTML = years.map((y) => `<button class="chip" type="button" aria-pressed="${y === year}">${y}</button>`).join('');
        chips.addEventListener('click', (e) => {
            const b = e.target.closest('.chip'); if (!b) return;
            year = +b.textContent;
            chips.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
            draw();
        });
        function draw() {
            const inYear = R.books.filter((b) => b.year === year);
            document.getElementById('months').innerHTML = MONTHS.map((m, i) => {
                const b = inYear.find((x) => x.month === i + 1 && x.pick);
                if (!b) return `<div class="month empty-month"><span class="m">${m}</span><small>No pick</small></div>`;
                const tag = link(b) ? 'a' : 'div';
                return `<${tag} class="month" ${link(b) ? `href="${link(b)}"` : ''} style="--bg:${esc(b.spine)}"><span class="m">${m}</span><span class="cover"></span><b>${esc(b.title)}</b><small>${esc(b.author)}</small>${sample(b)}</${tag}>`;
            }).join('');
            document.getElementById('ranked-title').textContent = `${year}, ranked`;
            const ranked = inYear.slice().sort((a, b) => b.stars - a.stars || a.month - b.month);
            document.getElementById('ranked').innerHTML = ranked.map((b) => `
                <li class="rank"><span><b>${link(b) ? `<a href="${link(b)}">${esc(b.title)}</a>` : esc(b.title)}</b> <span class="by">${esc(b.author)}</span>${sample(b)}</span>${stars(b.stars)}<p>${esc(b.review || '')}</p></li>`).join('');
        }
        if (years.length) draw();
    </script>
''')

page('reading/review.html', 'Review', 'A book review.', 'reading', '''
        .review { display: grid; grid-template-columns: minmax(180px, 260px) 1fr; gap: clamp(1.5rem, 5vw, 4rem); align-items: start; padding-top: 2rem; }
        .cover {
            position: sticky; top: 2rem; aspect-ratio: 2 / 3; display: grid; align-content: space-between; padding: 1.5rem 1.25rem;
            border-radius: 4px 10px 10px 4px; background: var(--bg); color: #fbf6ec;
            box-shadow: inset 6px 0 0 rgb(0 0 0 / 0.15), 0 20px 40px rgb(31 42 48 / 0.25);
        }
        .cover b { font: 600 1.7rem/1.1 var(--serif-display); }
        .cover span { font-size: 0.95rem; opacity: 0.85; }
        .review h1 { font-size: clamp(2.2rem, 5vw, 3.4rem); }
        .review .by { color: var(--muted); font-size: 1.15rem; margin-top: 0.25rem; }
        .review .meta { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; margin-block: 1rem 2rem; color: var(--muted); }
        .review .body { display: grid; gap: 1.1rem; max-width: 38rem; font-size: 1.12rem; }
        .review .body p:first-child::first-letter { float: left; font: 600 3.6rem/0.85 var(--serif-display); padding: 0.3rem 0.5rem 0 0; color: var(--seal); }
        @media (max-width: 640px) { .review { grid-template-columns: 1fr; } .cover { position: static; max-width: 220px; } }
''', '''
    <main class="page" id="review">
        <a class="back" href="index.html">← The shelf</a>
    </main>
''', '''    <script src="../data/reading.js"></script>
    <script>
        const { esc, stars, sample, param, MONTHS } = SITE;
        const b = ((window.READING || {}).books || []).find((x) => x.id === param('b'));
        const main = document.getElementById('review');
        if (!b) {
            main.insertAdjacentHTML('beforeend', '<div class="page-head"><h1>Not on the shelf</h1><p>There is no book with that name in data/reading.js.</p></div>');
        } else {
            document.title = `${b.title} · Natalie Voo`;
            main.insertAdjacentHTML('beforeend', `
                <article class="review">
                    <div class="cover" style="--bg:${esc(b.spine)}"><b>${esc(b.title)}</b><span>${esc(b.author)}</span></div>
                    <div>
                        <h1>${esc(b.title)}${sample(b)}</h1>
                        <p class="by">${esc(b.author)}</p>
                        <div class="meta">${stars(b.stars)}<span>Finished ${MONTHS[b.month - 1]} ${b.year}</span></div>
                        <div class="body">${String(b.longReview || b.review || '').split(/\\n\\s*\\n/).map((p) => `<p>${esc(p)}</p>`).join('')}</div>
                    </div>
                </article>`);
        }
    </script>
''')
