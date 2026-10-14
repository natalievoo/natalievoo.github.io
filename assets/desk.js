// The desk on the homepage: the things on it are the way into the site.
// Each object is a small ink drawing on a 160 × 160 grid. Pick one up to go to its page.
(() => {
    const desk = document.querySelector('[data-desk]');
    if (!desk) return;
    const I = '#1f2a30', P = '#fbf8f1', R = '#b3362b', G = '#c79a5b', A = '#2f5d8c', M = '#3d8b7d', K = '#f2c14e';
    const ink = `fill="none" stroke="${I}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"`;
    const squiggle = (x, y, n) => `M${x} ${y} ` + Array.from({ length: n }, (_, i) => `q${i % 2 ? '5 2' : '5 -2'} 10 0`).join(' ');
    const px = (rows, pal, x0, y0, s) => rows.map((r, y) => [...r].map((c, x) => (pal[c] ? `<rect x="${x0 + x * s}" y="${y0 + y * s}" width="${s + 0.1}" height="${s + 0.1}" fill="${pal[c]}"/>` : '')).join('')).join('');

    const OBJECTS = [
        { id: 'about', zi: '我', label: 'About me', href: 'about/index.html', left: 2, top: 4, rot: -3, svg: `
            <g transform="rotate(-4 80 80)">
                <rect x="20" y="50" width="120" height="64" rx="3" fill="#fffdf8" ${ink}/>
                <text x="32" y="78" font-family="'Ma Shan Zheng', KaiTi, serif" font-size="19" fill="${I}">邬欣汝</text>
                <text x="32" y="98" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="13.5" fill="${I}">Natalie Voo</text>
                <g transform="rotate(-7 116 78)">
                    <rect x="103" y="65" width="26" height="26" rx="2" fill="${R}"/>
                    <text x="116" y="79" text-anchor="middle" dominant-baseline="central" font-family="'LXGW WenKai TC', KaiTi, serif" font-weight="700" font-size="18" fill="#f4efe4">鄔</text>
                </g>
            </g>` },
        { id: 'reading', zi: '读', label: 'Reading', href: 'reading/index.html', left: 22, top: 2, rot: 0, svg: `
            <g class="books">
                <rect x="30" y="106" width="104" height="22" rx="2" fill="${A}" ${ink}/>
                <path d="M44 117 h62" stroke="#f4efe4" stroke-width="1.6" opacity=".8"/>
                <rect x="38" y="84" width="92" height="22" rx="2" fill="${G}" ${ink}/>
                <path d="M50 95 h44" stroke="#fffdf8" stroke-width="1.6" opacity=".9"/>
                <rect x="28" y="62" width="100" height="22" rx="2" fill="${M}" ${ink}/>
                <path d="M42 73 h56" stroke="#f4efe4" stroke-width="1.6" opacity=".8"/>
                <path d="M118 62 v-16 l4 4 l4 -4 v16" fill="${R}" stroke="${I}" stroke-width="1.2" stroke-linejoin="round"/>
            </g>` },
        { id: 'tea', zi: '茶', label: 'Tea, always', decor: true, left: 44, top: 6, rot: 0, small: true, svg: `
            <g class="steam" fill="none" stroke="${I}" stroke-width="1.3" stroke-linecap="round" opacity=".55">
                <path d="M68 70 c-7 -8 7 -13 0 -22"/><path d="M80 66 c-7 -8 7 -13 0 -22"/><path d="M92 70 c-7 -8 7 -13 0 -22"/>
            </g>
            <ellipse cx="80" cy="130" rx="36" ry="6" ${ink}/>
            <path d="M50 86 H110 L104 122 Q80 129 56 122 Z" fill="${P}" ${ink}/>
            <ellipse cx="80" cy="86" rx="30" ry="7" fill="#e3d2b2" ${ink}/>
            <path d="M110 94 c15 -3 17 19 0 22" ${ink}/>` },
        { id: 'projects', zi: '作', label: 'Projects', href: 'projects/index.html', left: 60, top: 3, rot: -5, svg: `
            <g transform="rotate(-5 80 80)">
                <rect x="34" y="38" width="92" height="102" rx="3" fill="#fffdf8" ${ink}/>
                ${[46, 58, 70, 82, 94, 106, 118].map((x) => `<circle cx="${x}" cy="38" r="3.4" ${ink}/><path d="M${x} 34.6 v-5" ${ink}/>`).join('')}
                <path d="M46 110 L60 88 L72 102 L90 76 L108 98 L118 88" fill="none" stroke="#8a8f94" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="100" cy="62" r="6" fill="none" stroke="#8a8f94" stroke-width="1.2"/>
                <g transform="rotate(-22 100 126)">
                    <rect x="62" y="121" width="64" height="9" rx="1" fill="${K}" ${ink}/>
                    <rect x="56" y="121" width="8" height="9" fill="#f2a19b" ${ink}/>
                    <path d="M126 121 l11 4.5 l-11 4.5 z" fill="${P}" ${ink}/>
                    <path d="M134 124 l3 1.5 l-3 1.5 z" fill="${I}"/>
                </g>
            </g>` },
        { id: 'play', zi: '玩', label: 'Chase the chickens', href: 'play/index.html', left: 81, top: 2, rot: 6, svg: `
            <g transform="rotate(6 80 80)">
                <rect x="44" y="28" width="72" height="106" rx="9" fill="${R}" ${ink}/>
                <rect x="52" y="38" width="56" height="44" rx="3" fill="#2a2423" ${ink}/>
                ${px(['..RR....', '.WWWR...', '.WKWOO..', '.WWW....', 'WWWWW...', 'WWWWWW..', '.WWWW...', '..O.O...'], { W: '#fbf6ec', R: R, K: '#2a2423', O: K }, 66, 44, 4)}
                <rect x="57" y="94" width="8" height="24" rx="1.5" fill="${I}"/><rect x="49" y="102" width="24" height="8" rx="1.5" fill="${I}"/>
                <circle cx="96" cy="108" r="5.5" fill="${K}" ${ink}/><circle cx="107" cy="100" r="5.5" fill="${K}" ${ink}/>
                <path d="M86 124 h4 M94 124 h4 M102 124 h4" stroke="${I}" stroke-width="1.4" stroke-linecap="round"/>
            </g>` },
        { id: 'stickers', zi: '贴', label: 'Sticker tin', tin: true, left: 2, top: 52, rot: 4, svg: `
            <g transform="rotate(4 80 80)">
                <circle cx="62" cy="72" r="10" fill="${K}" ${ink}/><circle cx="86" cy="70" r="10" fill="#7fb3a3" ${ink}/>
                <rect x="98" y="62" width="18" height="16" rx="2" fill="#fbefdc" ${ink} transform="rotate(14 107 70)"/>
                <rect x="30" y="74" width="100" height="54" rx="6" fill="${R}" ${ink}/>
                <text x="80" y="106" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="13" fill="#f4efe4">stickers</text>
                <g transform="rotate(-9 80 62)"><rect x="26" y="52" width="108" height="20" rx="5" fill="#8f1f1a" ${ink}/></g>
            </g>` },
        { id: 'travel', zi: '旅', label: 'Travel', href: 'travel/index.html', left: 22, top: 50, rot: -8, svg: `
            <g transform="rotate(-8 80 80)">
                <g transform="rotate(14 106 30)"><rect x="72" y="16" width="68" height="28" rx="2" fill="#fffdf8" ${ink}/><path d="M80 26 h30 M80 33 h18" stroke="#9aa0b8" stroke-width="1.4" stroke-linecap="round"/><path d="M118 22 v16" stroke="${I}" stroke-width="1" stroke-dasharray="2 2"/></g>
                <rect x="42" y="30" width="78" height="110" rx="5" fill="${R}" ${ink}/>
                <rect x="48" y="36" width="66" height="98" rx="3" fill="none" stroke="${G}" stroke-width=".9"/>
                <circle cx="81" cy="80" r="16" fill="none" stroke="${G}" stroke-width="1.3"/>
                <text x="81" y="81" text-anchor="middle" dominant-baseline="central" font-family="'Ma Shan Zheng', KaiTi, serif" font-size="17" fill="${G}">旅</text>
                <text x="81" y="119" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-size="9" letter-spacing="2.5" fill="${G}">PASSPORT</text>
            </g>` },
        { id: 'life', zi: '生', label: 'Life', href: 'life/index.html', left: 42, top: 52, rot: 0, svg: `
            <g transform="rotate(6 100 86)">
                <rect x="70" y="44" width="64" height="78" fill="#fff" ${ink}/>
                <rect x="75" y="49" width="54" height="56" fill="#dfe6e1"/>
                <circle cx="104" cy="68" r="8" fill="none" stroke="${G}" stroke-width="1.3"/>
                <path d="M78 92 q8 -4 16 0 t16 0 t16 0" fill="none" stroke="${A}" stroke-width="1.3" stroke-linecap="round"/>
            </g>
            <g transform="rotate(-8 60 80)">
                <rect x="28" y="34" width="64" height="78" fill="#fff" ${ink}/>
                <rect x="33" y="39" width="54" height="56" fill="#e9dcc3"/>
                <path d="M36 86 L50 66 L60 78 L72 58 L84 80" fill="none" stroke="${A}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M44 32 v-12 a5 5 0 0 1 10 0 v22 a7 7 0 0 1 -14 0 v-16" ${ink} stroke-width="1.4"/>
            </g>` },
        { id: 'writing', zi: '写', label: 'Writing', href: 'writing/index.html', left: 62, top: 50, rot: 3, svg: `
            <g transform="rotate(4 80 80)">
                <rect x="38" y="24" width="84" height="112" fill="#fffdf8" ${ink}/>
                <g fill="none" stroke="#9aa0b8" stroke-width="1.2" stroke-linecap="round">
                    <path d="${squiggle(48, 44, 6)}"/><path d="${squiggle(48, 56, 5)}"/><path d="${squiggle(48, 68, 6)}"/><path d="${squiggle(48, 80, 4)}"/><path d="${squiggle(48, 92, 6)}"/><path d="${squiggle(48, 104, 3)}"/>
                </g>
                <g transform="rotate(36 80 96)">
                    <rect x="30" y="92" width="92" height="8" rx="4" fill="${I}"/>
                    <rect x="94" y="91" width="9" height="10" rx="1" fill="${G}"/>
                    <path d="M122 92 l15 4 l-15 4 z" fill="${G}" stroke="${I}" stroke-width=".8" stroke-linejoin="round"/>
                    <path d="M128 96 h7" stroke="${I}" stroke-width=".6"/>
                </g>
            </g>` },
        { id: 'horse', zi: '马', label: 'A Tang horse', decor: true, left: 82, top: 54, rot: 0, svg: `
            <g class="figurine">
                <rect x="30" y="124" width="100" height="9" rx="2" fill="${G}" ${ink}/>
                <path d="M52 86 q-14 8 -10 30" ${ink} stroke-width="2.2"/>
                <g fill="${G}" ${ink}>
                    <path d="M62 98 v26 M74 100 v24 M96 100 v24 M108 98 v26" stroke-width="5"/>
                    <ellipse cx="82" cy="88" rx="31" ry="14"/>
                    <path d="M102 80 L112 50 L126 52 L118 90 Z"/>
                    <ellipse cx="127" cy="50" rx="12" ry="6" transform="rotate(28 127 50)"/>
                    <path d="M116 46 l1 -8 l6 6 z"/>
                </g>
                <path d="M112 50 Q106 62 104 78" fill="none" stroke="${I}" stroke-width="2.6" stroke-linecap="round"/>
                <circle cx="126" cy="48" r="1.3" fill="${I}"/>
            </g>` },
    ];

    desk.innerHTML = OBJECTS.map((o) => {
        const tag = o.href ? 'a' : o.tin ? 'button' : 'div';
        const attrs = o.href ? `href="${o.href}"` : o.tin ? 'type="button" aria-label="Open the sticker tin"' : 'aria-hidden="true"';
        return `<${tag} class="obj obj-${o.id}${o.small ? ' small' : ''}${o.decor ? ' decor' : ''}" ${attrs} style="--l:${o.left}%;--t:${o.top}%;--r:${o.rot}deg">
            <svg viewBox="0 0 160 160" aria-hidden="true">${o.svg}</svg>
            <span class="obj-label"><span class="zi" aria-hidden="true">${o.zi}</span>${o.label}</span>
        </${tag}>`;
    }).join('');
    desk.querySelector('.obj-stickers')?.addEventListener('click', () => document.querySelector('.tin-btn')?.click());
})();
