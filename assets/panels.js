// The desk: one panel on screen at a time, picked from the dock. The address bar follows
// (#travel, #reading/book-one). Nothing stacks; a panel fades in over the last one.
(() => {
    const { esc, reduce } = SITE;
    const I = '#1e1a15';
    const ln = `fill="none" stroke="${I}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"`;
    // Dock items: a small drawing on a pastel tile, and a lowercase label
    const APPS = [
        { id: 'about', label: 'about', tile: '#ffd9d3', icon: `<rect x="6" y="6" width="20" height="20" rx="3" fill="#b3362b"/><text x="16" y="17.5" text-anchor="middle" dominant-baseline="central" font-family="'LXGW WenKai TC',KaiTi,serif" font-weight="700" font-size="15" fill="#fff">鄔</text>` },
        { id: 'travel', label: 'travel', tile: '#c8d9f0', icon: `<rect x="8" y="4" width="16" height="24" rx="2" fill="#b3362b" ${ln} stroke="#8f1f1a"/><circle cx="16" cy="15" r="4.5" fill="none" stroke="#f2c14e" stroke-width="1"/><path d="M12 23 h8" stroke="#f2c14e" stroke-width="1"/>` },
        { id: 'reading', label: 'reading', tile: '#f1e9d6', icon: `<rect x="6" y="5" width="7" height="22" rx="1" fill="#fff" ${ln}/><rect x="13" y="8" width="7" height="19" rx="1" fill="#fff" ${ln}/><rect x="20" y="4" width="6" height="23" rx="1" fill="#fff" ${ln}/><path d="M8.5 9 v12 M15.5 12 v11" stroke="${I}" stroke-width="1" opacity=".4"/>` },
        { id: 'writing', label: 'writing', tile: '#d9ebdd', icon: `<rect x="7" y="4" width="18" height="24" fill="#fff" ${ln}/><path d="M11 10 h10 M11 14 h10 M11 18 h7" stroke="${I}" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>` },
        { id: 'projects', label: 'projects', tile: '#e2e2e0', icon: `<rect x="4" y="6" width="24" height="20" rx="2" fill="#fff" ${ln}/><path d="M4 11 h24" stroke="${I}" stroke-width="1.2"/><circle cx="8" cy="8.5" r="1" fill="${I}"/><circle cx="11" cy="8.5" r="1" fill="${I}"/><path d="M9 21 l4 -5 l3 3 l4 -6 l3 5" fill="none" stroke="${I}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>` },
        { id: 'life', label: 'life', tile: '#ffe3ed', icon: `<rect x="6" y="4" width="20" height="24" fill="#fff" ${ln} transform="rotate(-6 16 16)"/><rect x="8.5" y="6.5" width="15" height="13" fill="#e9e5dc" transform="rotate(-6 16 16)"/><circle cx="19" cy="11" r="2" fill="#f2c14e" transform="rotate(-6 16 16)"/>` },
        { id: 'play', label: 'play', tile: '#f6e7b8', icon: `<g shape-rendering="crispEdges">${['....RR..', '...WWWR.', '...WKWO.', '...WWW..', '.W.WWWW.', '.WWWWWW.', '..WWWW..', '...O.O..'].map((r, y) => [...r].map((c, x) => ({ W: '#fff', R: '#b3362b', K: '#1e1a15', O: '#e8a33a' }[c] ? `<rect x="${4 + x * 3}" y="${4 + y * 3}" width="3.1" height="3.1" fill="${{ W: '#fff', R: '#b3362b', K: '#1e1a15', O: '#e8a33a' }[c]}"/>` : '')).join('')).join('')}</g>` },
        { id: 'feed', label: 'feed', tile: '#eef3e6', icon: `<path d="M9 9 h14 l2 18 a2 2 0 0 1 -2 2 h-14 a2 2 0 0 1 -2 -2 z" fill="#e9d6b0" ${ln}/><path d="M9 9 l-2 -4 h18 l-2 4" fill="#d9c39a" ${ln}/><path d="M9 13 h14" stroke="${I}" stroke-width="1" opacity=".4"/><path d="M13 18 c0 -2 6 -2 6 0 c0 2 -6 2 -6 0 z" fill="#b3362b"/><path d="M19 18 l3 -1.5 v3 z" fill="#b3362b"/><circle cx="15" cy="18" r=".8" fill="#fff"/><circle cx="25" cy="6" r="1.1" fill="#c79a5b"/><circle cx="28" cy="9" r="1" fill="#c79a5b"/>` },
        { id: 'stickers', label: 'stickers', tile: '#fff', icon: `<path d="M8 6 h16 a2 2 0 0 1 2 2 v10 l-6 6 h-12 a2 2 0 0 1 -2 -2 v-14 a2 2 0 0 1 2 -2 z" fill="#f6d55c" ${ln}/><path d="M20 24 v-5 a1 1 0 0 1 1 -1 h5" fill="#fff" ${ln}/>` },
    ];
    const dock = document.querySelector('.dock-inner');
    dock.innerHTML = APPS.map((a) => `
        <button class="dock-item${a.id === 'stickers' ? ' tin-btn' : ''}" type="button" data-app="${a.id}" aria-label="${a.id === 'feed' ? 'Feed the koi: then click on the water' : a.label}" aria-current="false"${a.id === 'feed' ? ' aria-pressed="false"' : ''}>
            <span class="dock-icon" style="--tile:${a.tile}"><svg viewBox="0 0 32 32" aria-hidden="true">${a.icon}</svg></span>
            <span class="dock-label">${a.label}</span>
        </button>`).join('');
    dock.addEventListener('click', (e) => {
        const b = e.target.closest('[data-app]');
        if (!b || b.dataset.app === 'stickers') return; // the tin is handled in site.js
        if (b.dataset.app === 'feed') {
            const on = b.getAttribute('aria-pressed') !== 'true';
            b.setAttribute('aria-pressed', String(on));
            window.POND?.setFeeding(on);
            if (on && current !== 'welcome') show('welcome');
            return;
        }
        show(current === b.dataset.app ? 'welcome' : b.dataset.app);
    });

    // ─── Panels ───
    let current = 'welcome';
    const rendered = new Map(); // app -> last param rendered
    function show(id, param, push = true) {
        const panel = document.getElementById(`panel-${id}`);
        if (!panel) return;
        if (current !== id) {
            if (current !== 'welcome') APPS_RENDER[current]?.unmount?.();
            document.querySelectorAll('.panel.active').forEach((p) => p.classList.remove('active'));
            panel.classList.add('active');
            current = id;
        }
        if (id !== 'welcome' && APPS_RENDER[id] && (!rendered.has(id) || param !== undefined || rendered.get(id) !== undefined)) {
            APPS_RENDER[id].render(panel, param);
            rendered.set(id, param);
        }
        panel.scrollTop = 0;
        dock.querySelectorAll('[data-app]').forEach((b) => b.setAttribute('aria-current', String(b.dataset.app === id)));
        if (push) {
            const h = id === 'welcome' ? '' : `#${id}${param ? '/' + encodeURIComponent(param) : ''}`;
            if (location.hash !== h) history.replaceState(null, '', h || location.pathname);
        }
    }
    function fromHash() {
        const [id, param] = location.hash.slice(1).split('/');
        show(id && document.getElementById(`panel-${id}`) ? id : 'welcome', param ? decodeURIComponent(param) : undefined, false);
    }
    addEventListener('hashchange', fromHash);
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[data-go]');
        if (!a) return;
        e.preventDefault();
        show(a.dataset.go, a.dataset.param || undefined);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && current !== 'welcome') show('welcome'); });

    // ─── Small truths in the corners ───
    const info = window.SITE_INFO;
    if (info) document.querySelector('[data-colophon]').innerHTML = `built with Claude &amp; fuelled by ${esc(info.fuel)}<br>last updated ${new Date(info.updated + 'T12:00:00').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toLowerCase()} ୨୧`;
    const sub = window.WRITING?.substack; if (sub) document.querySelector('[data-substack]').href = sub;
    // "hello" in each language, slowly, in the corner of the hero
    const hellos = (window.ABOUT?.languages || []).map((l) => l.hello).filter(Boolean);
    const hello = document.querySelector('[data-hello]');
    if (hello && hellos.length > 1 && !reduce) {
        let i = 0;
        setInterval(() => { hello.classList.add('out'); setTimeout(() => { i = (i + 1) % hellos.length; hello.textContent = `${hellos[i]},`; hello.classList.remove('out'); }, 300); }, 3600);
    }
    // The dock arrives once the name is written; the first time, one item bounces to say "press me"
    const ready = () => {
        fromHash();
        try { if (!sessionStorage.getItem('bounced')) { sessionStorage.setItem('bounced', '1'); setTimeout(() => { const b = dock.querySelector('[data-app="about"]'); b.classList.add('bouncing'); b.addEventListener('animationend', () => b.classList.remove('bouncing'), { once: true }); }, 3000); } } catch { /* fine */ }
    };
    if (document.body.classList.contains('named')) ready();
    else new MutationObserver((_, mo) => { if (document.body.classList.contains('named')) { mo.disconnect(); ready(); } }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

    window.DESK = { show };
})();
