# Pieces for the Life page's music corner, kept apart so life.py stays readable.
# Not a page itself: life.py reads these names.
INK = '#2a2423'

TURNTABLE = f'''<svg class="turntable" viewBox="0 0 330 230" aria-hidden="true">
    <g fill="none" stroke="{INK}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
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
    <g fill="none" stroke="{INK}" stroke-width="1.4" stroke-linecap="round">
        <circle cx="282" cy="172" r="9"/><path d="M282 166 V172"/>
        <path d="M244 168 H262" stroke-width="5" stroke="#b3362b"/>
    </g>
    <text x="236" y="190" font-family="Caveat, cursive" font-size="14" fill="{INK}">33⅓</text>
    <g class="tonearm" fill="none" stroke="{INK}" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="276" cy="62" r="13" stroke-width="1.4" fill="#fbf8f2"/><circle cx="276" cy="62" r="3.5" fill="{INK}" stroke="none"/>
        <path d="M276 62 L270 144 L248 166" stroke-width="2.6"/>
        <path d="M241 160 L253 172" stroke-width="6" stroke="#b3362b"/>
    </g>
</svg>'''

SKIN = '#f1d4bc'
DRESS = '#b3362b'
DRESS_DARK = '#8f1f1a'
HAIR = '#1f1a1c'
# A fashion sketch: long pen lines, no face, one colour
DANCER = f'''<svg class="dancer" viewBox="0 0 160 250" aria-hidden="true">
  <g class="d-turn"><g class="d-bounce">
    <g class="d-hips">
      <g class="d-leg-l" fill="none" stroke="{INK}" stroke-width="1.3" stroke-linecap="round"><path d="M74 150 L69 200 L65 232"/><path d="M60 233 L67 231 L66 238"/></g>
      <g class="d-leg-r" fill="none" stroke="{INK}" stroke-width="1.3" stroke-linecap="round"><path d="M86 150 L93 198 L102 228"/><path d="M99 230 L106 226 L108 233"/></g>
      <g class="d-skirt">
        <path d="M68 126 Q80 122 92 126 Q112 160 132 196 Q118 192 106 200 Q96 190 84 198 Q72 188 60 194 Q48 186 36 190 Q54 160 68 126 Z" fill="{DRESS}" opacity=".9"/>
        <path d="M70 130 Q60 160 46 186 M80 128 Q78 160 76 194 M90 130 Q104 160 120 192" fill="none" stroke="{DRESS_DARK}" stroke-width="0.9" opacity=".7"/>
        <path d="M36 190 Q48 186 60 194 Q72 188 84 198 Q96 190 106 200 Q118 192 132 196" fill="none" stroke="{INK}" stroke-width="1.1"/>
      </g>
    </g>
    <g class="d-torso">
      <g class="d-arm-r" fill="none" stroke="{INK}" stroke-width="1.3" stroke-linecap="round"><path d="M93 86 Q112 96 128 86 Q136 80 142 70"/></g>
      <path d="M70 84 Q80 80 90 84 L92 126 Q80 130 68 126 Z" fill="{DRESS}" stroke="{INK}" stroke-width="1.1"/>
      <path d="M78 70 V80 M82 70 V80" stroke="{INK}" stroke-width="1.1"/>
      <g class="d-arm-l" fill="none" stroke="{INK}" stroke-width="1.3" stroke-linecap="round"><path d="M70 86 Q54 72 54 50 Q54 34 62 24"/></g>
      <g class="d-head">
        <g class="d-tail"><path d="M88 46 Q104 44 108 58 Q110 72 102 84 Q104 68 96 58 Q92 52 86 52 Z" fill="{HAIR}"/></g>
        <ellipse cx="80" cy="58" rx="10" ry="12" fill="{SKIN}" stroke="{INK}" stroke-width="1.1"/>
        <path d="M70 58 Q68 44 80 44 Q92 44 90 56 Q86 48 80 49 Q73 50 70 58 Z" fill="{HAIR}"/>
        <circle cx="90" cy="47" r="3.2" fill="{DRESS}"/>
      </g>
    </g>
  </g></g>
</svg>'''

MUSIC_CSS = '''
        /* The music corner: a record player and a dancer, loose on the page */
        .music-desk { position: relative; display: grid; grid-template-columns: minmax(260px, 380px) auto minmax(200px, 1fr); gap: 1.5rem 2.5rem; align-items: end; padding-block: 1rem 2rem; }
        .player { position: relative; transform: rotate(-1deg); filter: drop-shadow(0 14px 20px rgb(31 42 48 / 0.1)); }
        .turntable { width: 100%; height: auto; display: block; overflow: visible; }
        .turntable .vinyl { transform-box: view-box; transform-origin: 124px 116px; animation: spin 1.8s linear infinite; animation-play-state: paused; }
        .turntable .tonearm { transform-box: view-box; transform-origin: 268px 58px; transition: transform 0.9s cubic-bezier(.34, 1.4, .64, 1); }
        .playing .turntable .tonearm { transform: rotate(32deg); }
        .playing .turntable .vinyl { animation-play-state: running; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .play .i-pause, .playing .play .i-play { display: none; }
        .playing .play .i-pause { display: inline; }
        .play {
            position: absolute; right: 4%; bottom: -6%; display: grid; place-items: center; width: 52px; height: 52px;
            border-radius: 50%; border: 1.4px solid #2a2423; background: #fbf8f2; cursor: pointer;
            box-shadow: 0 6px 14px rgb(31 42 48 / 0.12); transition: transform 0.25s var(--ease-back);
        }
        .play:hover { transform: rotate(-8deg) scale(1.05); }
        .play:active { transform: scale(0.95); }
        .play svg { width: 18px; height: 18px; }
        .notes { position: absolute; inset: 0; pointer-events: none; }
        .notes span { position: absolute; left: 36%; top: 40%; font: 1.6rem/1 serif; color: var(--pen); opacity: 0; }
        .playing .notes span { animation: float 2.4s ease-out infinite; }
        .notes span:nth-child(2) { animation-delay: 0.8s !important; left: 46%; color: #d23c2f; }
        .notes span:nth-child(3) { animation-delay: 1.6s !important; left: 28%; color: #3d8b7d; }
        @keyframes float { 0% { opacity: 0; transform: translate(0, 0) rotate(-10deg); } 15% { opacity: 1; } 100% { opacity: 0; transform: translate(-40px, -150px) rotate(20deg); } }

        /* The dancer: a cha-cha. Hips lead, the body counters, the skirt and ponytail follow a beat behind */
        .stage { position: relative; display: grid; justify-items: center; }
        .stage::before { content: ''; position: absolute; bottom: 8px; width: 120px; height: 1px; background: #2a2423; opacity: .35; }
        .dancer { position: relative; width: 170px; height: auto; overflow: visible; }
        .dancer g { transform-box: view-box; animation-duration: 0.9s; animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-direction: alternate; animation-play-state: paused; }
        .playing .dancer g { animation-play-state: running; }
        .d-bounce { transform-origin: 80px 238px; animation-name: d-bounce; animation-duration: 0.45s !important; }
        .d-hips { transform-origin: 80px 140px; animation-name: d-hips; }
        .d-torso { transform-origin: 80px 128px; animation-name: d-torso; }
        .d-skirt { transform-origin: 80px 126px; animation-name: d-skirt; animation-delay: 0.12s; }
        .d-leg-l { transform-origin: 72px 150px; animation-name: d-leg-l; }
        .d-leg-r { transform-origin: 88px 150px; animation-name: d-leg-r; }
        .d-arm-l { transform-origin: 66px 84px; animation-name: d-arm-l; }
        .d-arm-r { transform-origin: 94px 84px; animation-name: d-arm-r; }
        .d-head { transform-origin: 80px 70px; animation-name: d-head; animation-delay: 0.08s; }
        .d-tail { transform-origin: 94px 40px; animation-name: d-tail; animation-delay: 0.18s; }
        .d-turn { transform-origin: 80px 140px; animation: d-turn 7.2s ease-in-out infinite !important; animation-direction: normal !important; }
        @keyframes d-bounce { from { transform: translateY(0); } to { transform: translateY(-4px); } }
        @keyframes d-hips { from { transform: translateX(-4px) rotate(-7deg); } to { transform: translateX(4px) rotate(7deg); } }
        @keyframes d-torso { from { transform: rotate(4deg); } to { transform: rotate(-4deg); } }
        @keyframes d-skirt { from { transform: rotate(9deg) skewX(-6deg); } to { transform: rotate(-9deg) skewX(6deg); } }
        @keyframes d-leg-l { from { transform: rotate(-6deg); } to { transform: rotate(4deg); } }
        @keyframes d-leg-r { from { transform: rotate(-4deg); } to { transform: rotate(7deg); } }
        @keyframes d-arm-l { from { transform: rotate(-12deg); } to { transform: rotate(10deg); } }
        @keyframes d-arm-r { from { transform: rotate(18deg); } to { transform: rotate(-16deg); } }
        @keyframes d-head { from { transform: rotate(-6deg); } to { transform: rotate(6deg); } }
        @keyframes d-tail { from { transform: rotate(16deg); } to { transform: rotate(-14deg); } }
        /* Every eight steps she turns */
        @keyframes d-turn { 0%, 84% { transform: scaleX(1); } 90% { transform: scaleX(-1); } 96%, 100% { transform: scaleX(1); } }

        .music-notes { display: grid; gap: 0.75rem; align-self: center; justify-items: start; }
        .music-notes .postit { min-width: 13rem; }
        .music-notes .postit h3 { font: 500 1.6rem/1 var(--hand); color: var(--pen); margin-bottom: 0.4rem; }
        .music-notes .postit ul { margin: 0; padding-left: 1.1rem; font-size: 1rem; }
        @media (max-width: 860px) { .music-desk { grid-template-columns: 1fr; justify-items: center; } .player { max-width: 360px; width: 100%; } }
        @media (prefers-reduced-motion: reduce) {
            .playing .dancer g, .playing .turntable .vinyl, .playing .notes span { animation-play-state: paused; animation: none; }
            .turntable .tonearm { transition: none; }
        }
'''

PLAY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="i-play" d="M7 4 L20 12 L7 20 Z" fill="#2a2423"/><g class="i-pause" fill="#2a2423"><rect x="5" y="4" width="5" height="16" rx="1.5"/><rect x="14" y="4" width="5" height="16" rx="1.5"/></g></svg>'
