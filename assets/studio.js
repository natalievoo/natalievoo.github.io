// The studio: seals along the bottom, and a hanging scroll (挂轴) for each one.
// One scroll hangs on the wall at a time. Press a seal and the open scroll rolls up and the
// new one unrolls in its place. Roll it up with the little button, or press Escape.
// The address bar follows: #travel, #reading/book-one.
(() => {
    const { esc, reduce } = SITE;
    const APPS = [
        ['about', '我', 'About'], ['travel', '旅', 'Travel'], ['reading', '读', 'Reading'], ['writing', '写', 'Writing'],
        ['projects', '作', 'Projects'], ['life', '生', 'Life'], ['play', '玩', 'Play'], ['stickers', '贴', 'Stickers'],
    ];
    const wall = document.getElementById('wall');
    const dock = document.querySelector('.dock');
    const phone = () => innerWidth < 700;

    // ─── The dock ───
    dock.innerHTML = APPS.map(([id, zi, label]) => `
        <button class="seal-btn${id === 'stickers' ? ' tin-btn' : ''}" type="button" data-app="${id}" aria-label="${label}" aria-expanded="false">
            <svg class="seal-face" viewBox="0 0 100 100" aria-hidden="true"><g filter="url(#worn)"><rect x="4" y="4" width="92" height="92" rx="5" class="seal-stone"/><text x="50" y="54" text-anchor="middle" dominant-baseline="central" class="seal-char">${zi}</text></g></svg>
            <span class="seal-label">${label}</span>
        </button>`).join('');
    dock.addEventListener('click', (e) => {
        const b = e.target.closest('[data-app]');
        if (!b || b.dataset.app === 'stickers') return; // the tin is handled by site.js
        const id = b.dataset.app;
        if (current?.id === id) closeApp(id); else openApp(id);
    });
    const mark = (id, on) => dock.querySelector(`[data-app="${id}"]`)?.setAttribute('aria-expanded', String(on));

    // ─── Scrolls ───
    let current = null; // { id, el, paper, param }
    let opening = false;
    const title = (id) => APPS.find((a) => a[0] === id) || ['note', '记', 'Note'];

    async function openApp(id, param) {
        if (!APPS_RENDER[id] || opening) return;
        if (current?.id === id) {
            if (param !== undefined || current.param !== undefined) { APPS_RENDER[id].render(current.paper, param); current.param = param; current.paper.scrollTop = 0; }
            setHash(id, param); return;
        }
        opening = true;
        // The scroll that's up comes down first
        if (current) await closeApp(current.id, true);
        const [, zi, label] = title(id);
        const el = document.createElement('section');
        el.className = 'scroll'; el.dataset.app = id;
        el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', label);
        el.innerHTML = `
            <div class="rod rod-top"><span class="knob"></span><h2 class="scroll-title"><span class="zi" aria-hidden="true">${zi}</span>${label}</h2><button class="roll" type="button" aria-label="Roll up">roll up</button><span class="knob"></span></div>
            <div class="silk"><div class="paper"></div></div>
            <div class="rod rod-bottom"><span class="knob"></span><span class="knob"></span></div>`;
        wall.append(el);
        const paper = el.querySelector('.paper');
        APPS_RENDER[id].render(paper, param);
        // Where it hangs: in the middle of the wall, the same place every time
        if (!phone()) {
            const w = id === 'note' ? 440 : Math.min(760, innerWidth - 40);
            el.style.width = `${w}px`;
            el.style.left = `${(innerWidth - w) / 2}px`;
            el.style.top = '64px';
        }
        current = { id, el, paper, param };
        document.body.classList.add('has-scroll');
        unroll(el);
        mark(id, true);
        if (id !== 'note') setHash(id, param);
        opening = false;
        el.querySelector('.roll').addEventListener('click', () => closeApp(id));
        // Links inside a scroll that open another scroll (or another view of this one)
        paper.addEventListener('click', (e) => {
            const a = e.target.closest('a[data-open]');
            if (!a) return;
            e.preventDefault();
            openApp(a.dataset.open, a.dataset.param || undefined);
        });
    }
    async function closeApp(id, forNext) {
        if (current?.id !== id) return;
        const s = current; current = null;
        mark(id, false);
        APPS_RENDER[id].unmount?.();
        if (!forNext) document.body.classList.remove('has-scroll');
        if (location.hash.slice(1).split('/')[0] === id) history.replaceState(null, '', location.pathname);
        await rollUp(s.el);
        s.el.remove();
    }
    // The paper comes down from the top rod, like a scroll being let out
    function unroll(el) {
        const silk = el.querySelector('.silk'), paper = el.querySelector('.paper');
        // Never longer than the wall above the seals
        const room = innerHeight - 64 - 200;
        const target = phone() ? null : Math.max(160, Math.min(room, paper.scrollHeight + 2));
        if (target) silk.style.height = `${target}px`;
        if (reduce) return;
        el.animate([{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
        silk.animate([{ height: '0px' }, { height: `${target || silk.clientHeight}px` }], { duration: 560, easing: 'cubic-bezier(.22,.61,.36,1)' });
    }
    function rollUp(el) {
        const silk = el.querySelector('.silk');
        if (reduce) return Promise.resolve();
        const a = silk.animate([{ height: `${silk.clientHeight}px` }, { height: '0px' }], { duration: 300, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
        el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, delay: 160, fill: 'forwards' });
        return a.finished.catch(() => {});
    }
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (current) closeApp(current.id);
    });

    // ─── The address bar follows ───
    function setHash(id, param) {
        const h = `#${id}${param ? '/' + encodeURIComponent(param) : ''}`;
        if (location.hash !== h) history.replaceState(null, '', h);
    }
    function fromHash() {
        const [id, param] = location.hash.slice(1).split('/');
        if (id && APPS_RENDER[id] && id !== 'note') openApp(id, param ? decodeURIComponent(param) : undefined);
    }
    addEventListener('hashchange', fromHash);

    // ─── The clock in the corner ───
    const clock = document.querySelector('[data-clock]');
    const tick = () => { clock.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam' }); };
    tick(); setInterval(tick, 20000);

    // ─── Once the name is written, the seals appear; a small note unrolls the first time ───
    const ready = () => {
        if (location.hash.length > 1) { fromHash(); return; }
        let seen = false;
        try { seen = sessionStorage.getItem('note-seen'); sessionStorage.setItem('note-seen', '1'); } catch { /* fine */ }
        if (!seen) setTimeout(() => openApp('note'), 900);
    };
    if (document.body.classList.contains('named')) ready();
    else new MutationObserver((_, mo) => { if (document.body.classList.contains('named')) { mo.disconnect(); ready(); } }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

    window.STUDIO = { openApp, closeApp };
})();
