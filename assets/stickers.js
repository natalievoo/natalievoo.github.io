// The sticker tin. Each sticker is a small drawing on a 64 × 64 grid;
// the white die-cut edge and the shadow are added by the page, not drawn here.
// To add one: give it an id, a name (shown to screen readers) and its drawing.
(() => {
    const RED = '#c8352b', DEEP = '#8f1f1a', GOLD = '#f2c14e', CREAM = '#fbefdc', INK = '#2b2522', GREEN = '#3d8b7d', LEAF = '#5e9c4a', PINK = '#f2a19b';

    // Pixel art helper: one letter per pixel
    const px = (rows, pal, size = 64) => {
        const n = rows.length, s = size / n;
        let out = '';
        rows.forEach((r, y) => [...r].forEach((c, x) => { if (pal[c]) out += `<rect x="${x * s}" y="${y * s}" width="${s + 0.05}" height="${s + 0.05}" fill="${pal[c]}"/>`; }));
        return `<g shape-rendering="crispEdges">${out}</g>`;
    };

    window.STICKERS = [
        { id: 'fu', name: '福, upside down: luck has arrived', svg: `
            <rect x="15" y="15" width="34" height="34" rx="3" transform="rotate(45 32 32)" fill="${RED}"/>
            <rect x="19" y="19" width="26" height="26" rx="2" transform="rotate(45 32 32)" fill="none" stroke="${GOLD}" stroke-width="1.2"/>
            <text x="32" y="33" transform="rotate(180 32 32)" text-anchor="middle" dominant-baseline="central" font-family="Ma Shan Zheng, KaiTi, serif" font-size="25" fill="${GOLD}">福</text>` },
        { id: 'hongbao', name: 'Red envelope', svg: `
            <rect x="15" y="7" width="34" height="50" rx="4" fill="${RED}"/>
            <path d="M15 20 Q32 33 49 20 V11 Q49 7 45 7 H19 Q15 7 15 11 Z" fill="${DEEP}"/>
            <circle cx="32" cy="27" r="6.5" fill="${GOLD}"/>
            <text x="32" y="45" text-anchor="middle" dominant-baseline="central" font-family="Ma Shan Zheng, KaiTi, serif" font-size="11" fill="${GOLD}">大吉</text>` },
        { id: 'boba', name: 'Bubble tea', svg: `
            <rect x="35" y="2" width="5" height="22" rx="2" transform="rotate(14 37 13)" fill="${GREEN}"/>
            <path d="M17 18 H47 L43 58 Q42 61 39 61 H25 Q22 61 21 58 Z" fill="#ead2b0"/>
            <path d="M18.5 30 H45.5 L43 58 Q42 61 39 61 H25 Q22 61 21 58 Z" fill="#c99a6b"/>
            <ellipse cx="32" cy="18" rx="16" ry="4" fill="#f6e8d4" stroke="#d9bb93" stroke-width="1"/>
            <g fill="${INK}"><circle cx="27" cy="53" r="2.6"/><circle cx="33" cy="55" r="2.6"/><circle cx="38.5" cy="52" r="2.6"/><circle cx="30" cy="48" r="2.6"/><circle cx="36" cy="47.5" r="2.6"/></g>
            <circle cx="28" cy="38" r="1.3" fill="${INK}"/><circle cx="36" cy="38" r="1.3" fill="${INK}"/>
            <path d="M30 41 Q32 43 34 41" stroke="${INK}" stroke-width="1.2" fill="none" stroke-linecap="round"/>` },
        { id: 'dumpling', name: 'Dumpling', svg: `
            <path d="M6 42 Q8 18 32 14 Q56 18 58 42 Q32 54 6 42 Z" fill="#f7ecd8" stroke="#dcc6a0" stroke-width="1.5"/>
            <path d="M18 22 Q20 28 23 22 Q25 28 28 20 Q30 27 33 19 Q35 27 38 20 Q40 27 43 22 Q45 28 47 22" fill="none" stroke="#dcc6a0" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="25" cy="36" r="1.8" fill="${INK}"/><circle cx="39" cy="36" r="1.8" fill="${INK}"/>
            <path d="M29.5 39.5 Q32 42 34.5 39.5" stroke="${INK}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
            <ellipse cx="20" cy="40" rx="3" ry="1.8" fill="${PINK}"/><ellipse cx="44" cy="40" rx="3" ry="1.8" fill="${PINK}"/>` },
        { id: 'lantern', name: 'Red lantern', svg: `
            <line x1="32" y1="2" x2="32" y2="10" stroke="${INK}" stroke-width="1.5"/>
            <rect x="24" y="9" width="16" height="5" rx="1.5" fill="${GOLD}"/>
            <ellipse cx="32" cy="31" rx="20" ry="18" fill="${RED}"/>
            <path d="M32 13 Q22 31 32 49 M32 13 Q42 31 32 49 M32 13 Q14 31 32 49 M32 13 Q50 31 32 49" fill="none" stroke="${DEEP}" stroke-width="1"/>
            <rect x="24" y="47" width="16" height="5" rx="1.5" fill="${GOLD}"/>
            <g stroke="${GOLD}" stroke-width="1.4"><line x1="29" y1="52" x2="28" y2="62"/><line x1="32" y1="52" x2="32" y2="63"/><line x1="35" y1="52" x2="36" y2="62"/></g>` },
        { id: 'koi', name: 'Koi', svg: `
            <path d="M46 40 Q58 30 61 22 Q56 36 60 48 Q53 42 46 44 Z" fill="#f4a261" opacity="0.85"/>
            <path d="M8 34 Q14 20 30 22 Q44 24 48 38 Q40 48 26 46 Q12 44 8 34 Z" fill="${CREAM}" stroke="#d8b893" stroke-width="1"/>
            <ellipse cx="24" cy="30" rx="7" ry="5" fill="#e8673c"/><ellipse cx="38" cy="38" rx="5" ry="3.5" fill="#e8673c"/>
            <path d="M24 44 Q20 52 14 54 Q22 52 28 46 Z" fill="#f4a261" opacity="0.8"/>
            <circle cx="14" cy="31" r="1.7" fill="${INK}"/><circle cx="13.5" cy="30.4" r="0.6" fill="#fff"/>` },
        { id: 'horse', name: 'Pixel horse, the year of my zodiac', svg: px([
            '................', '...........RRR..', '..........MRRRRR', '.........MRRRRRR', '........MRRR..R.', '.......MRRR.....',
            '..MM..MRRR......', '.M..RRRRRRRRR...', 'M..RRRRRRRRRR...', '...RRRRRRRRRRR..', '..RR.......RR...', '.RD..........RD.',
            '................', '................', '................', '................'], { R: '#b5794a', M: '#b0281f', D: '#2e1d14' }) },
        { id: 'chicken', name: 'Chicken from the village', svg: px([
            '................', '......RR........', '.....WWWR.......', '....WWWWW.......', '....WWKWWO......', '....WWWWWOO.....',
            '.....WWWW.......', '..W..WWWWW......', '.WWWWWWWWWW.....', '.WWWWWWWWWWW....', '..WWWWWWWWWW....', '...WWWWWWWW.....',
            '.....W...W......', '.....O...O......', '....OO..OO......', '................'], { W: '#fbf6ec', R: RED, K: INK, O: '#e8a33a' }) },
        { id: 'pisces', name: 'Pisces, two fish tied together', svg: `
            <path d="M22 44 C22 58 42 58 42 20" fill="none" stroke="#c79a5b" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M22 8 C30 16 30 32 22 40 C14 32 14 16 22 8 Z M22 40 L17 48 L27 48 Z" fill="#2f5d8c"/>
            <path d="M42 56 C34 48 34 32 42 24 C50 32 50 48 42 56 Z M42 24 L37 16 L47 16 Z" fill="${GREEN}"/>` },
        { id: 'laurel', name: 'Laurel wreath, for the Greek myths', svg: `
            <g fill="${LEAF}">
              ${Array.from({ length: 7 }, (_, i) => { const a = 200 + i * 20; const r = 20, cx = 32 + Math.cos(a * Math.PI / 180) * r, cy = 32 - Math.sin(a * Math.PI / 180) * r; return `<ellipse cx="${cx}" cy="${cy}" rx="5" ry="2.4" transform="rotate(${-a + 60} ${cx} ${cy})"/>`; }).join('')}
              ${Array.from({ length: 7 }, (_, i) => { const a = -20 - i * 20; const r = 20, cx = 32 + Math.cos(a * Math.PI / 180) * r, cy = 32 - Math.sin(a * Math.PI / 180) * r; return `<ellipse cx="${cx}" cy="${cy}" rx="5" ry="2.4" transform="rotate(${-a - 60} ${cx} ${cy})"/>`; }).join('')}
            </g>
            <path d="M14 46 Q32 64 50 46" fill="none" stroke="#6d5a2e" stroke-width="1.5"/>
            <text x="32" y="33" text-anchor="middle" dominant-baseline="central" font-family="Cormorant Garamond, serif" font-size="16" font-weight="600" fill="${INK}">ΝΙΚΗ</text>` },
        { id: 'tulip', name: 'Dutch tulip', svg: `
            <path d="M32 60 V30" stroke="${LEAF}" stroke-width="3" stroke-linecap="round"/>
            <path d="M32 52 Q18 46 16 32 Q28 38 32 50 Z" fill="${LEAF}"/><path d="M32 56 Q46 50 48 38 Q36 42 32 54 Z" fill="${LEAF}"/>
            <path d="M20 12 Q22 30 32 32 Q42 30 44 12 L38 18 L32 8 L26 18 Z" fill="#e2483a"/>
            <path d="M32 8 L26 18 Q28 28 32 32 Q36 28 38 18 Z" fill="#c8352b"/>` },
        { id: 'hibiscus', name: 'Hibiscus, the bunga raya of Malaysia', svg: `
            <g fill="#d6303f">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="32" cy="17" rx="10" ry="14" transform="rotate(${a} 32 32)"/>`).join('')}</g>
            <g fill="#a81f2e">${[36, 108, 180, 252, 324].map((a) => `<path d="M32 32 L32 14" stroke="#a81f2e" stroke-width="1" transform="rotate(${a} 32 32)"/>`).join('')}</g>
            <circle cx="32" cy="32" r="4.5" fill="#7a1220"/>
            <path d="M32 32 Q42 22 48 14" stroke="${GOLD}" stroke-width="2" fill="none"/><circle cx="48" cy="14" r="2.6" fill="${GOLD}"/>` },
        { id: 'mahjong', name: 'Mahjong tile, red dragon', svg: `
            <rect x="15" y="9" width="36" height="48" rx="5" fill="${GREEN}"/>
            <rect x="13" y="6" width="36" height="48" rx="5" fill="#fbf6ec" stroke="#d9cfbd" stroke-width="1"/>
            <text x="31" y="31" text-anchor="middle" dominant-baseline="central" font-family="Noto Serif SC, SimSun, serif" font-size="28" font-weight="700" fill="${RED}">中</text>` },
        { id: 'dumbbell', name: 'Dumbbell, for the gym', svg: `
            <rect x="18" y="29" width="28" height="6" rx="2" fill="#8a9196"/>
            <rect x="9" y="18" width="9" height="28" rx="3" fill="${INK}"/><rect x="46" y="18" width="9" height="28" rx="3" fill="${INK}"/>
            <rect x="4" y="23" width="6" height="18" rx="2" fill="#3e4a52"/><rect x="54" y="23" width="6" height="18" rx="2" fill="#3e4a52"/>` },
        { id: 'dance', name: 'Dancing shoes', svg: `
            <path d="M10 44 Q8 30 20 28 Q30 28 34 36 L48 40 Q56 42 56 48 Q56 54 46 54 H18 Q10 54 10 44 Z" fill="${PINK}"/>
            <path d="M18 54 H46 Q56 54 56 48" fill="none" stroke="#c96b66" stroke-width="2"/>
            <path d="M22 30 Q30 18 40 22 M24 30 Q34 12 46 18" fill="none" stroke="#c96b66" stroke-width="1.6" stroke-linecap="round"/>
            <circle cx="22" cy="40" r="2" fill="#fff" opacity="0.8"/>` },
        { id: 'notes', name: 'Music', svg: `
            <path d="M24 46 V14 L50 8 V40" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
            <ellipse cx="18" cy="47" rx="7.5" ry="5.5" transform="rotate(-20 18 47)" fill="${INK}"/>
            <ellipse cx="44" cy="41" rx="7.5" ry="5.5" transform="rotate(-20 44 41)" fill="${INK}"/>
            <path d="M24 20 L50 14" stroke="${INK}" stroke-width="3.5"/>` },
        { id: 'chart', name: 'Bar chart, for the data', svg: `
            <rect x="6" y="8" width="52" height="48" rx="7" fill="#fbf6ec" stroke="#d9cfbd"/>
            <rect x="14" y="34" width="7" height="14" rx="1.5" fill="#7fb3a3"/><rect x="25" y="24" width="7" height="24" rx="1.5" fill="${GREEN}"/>
            <rect x="36" y="29" width="7" height="19" rx="1.5" fill="#2f5d8c"/><rect x="47" y="16" width="5" height="32" rx="1.5" fill="${RED}"/>
            <path d="M12 48 H54" stroke="${INK}" stroke-width="1.4"/>` },
    ];
})();
