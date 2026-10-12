// 1. Split the name into letters so each can animate in on its own
const name = document.querySelector('[data-split]');
if (name) {
    const text = name.textContent;
    name.setAttribute('aria-label', text);
    name.textContent = '';
    name.classList.add('is-split');
    [...text].forEach((c, i) => {
        const span = document.createElement('span');
        span.className = 'ch';
        span.style.setProperty('--i', i);
        span.setAttribute('aria-hidden', 'true');
        span.textContent = c === ' ' ? ' ' : c;
        name.appendChild(span);
    });
    // Tell each letter how wide the name is and where the letter starts,
    // so the gradient lines up across them (again when the window resizes)
    const measure = () => {
        const letters = [...name.querySelectorAll('.ch')];
        const start = letters[0].offsetLeft;
        const last = letters[letters.length - 1];
        name.style.setProperty('--w', `${last.offsetLeft + last.offsetWidth - start}px`);
        letters.forEach((l) => l.style.setProperty('--left', `${l.offsetLeft - start}px`));
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
}

// 2. Fade things up as they scroll into view
const seen = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) {
            e.target.classList.add('in');
            seen.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 120}ms`;
    seen.observe(el);
});

// 3. The glow follows the mouse
const glow = document.querySelector('.glow');
window.addEventListener('pointermove', (e) => {
    glow.style.setProperty('--x', `${e.clientX}px`);
    glow.style.setProperty('--y', `${e.clientY}px`);
});

// 4. Cards tilt towards the mouse
document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--ry', `${x * 12}deg`);
        card.style.setProperty('--rx', `${-y * 12}deg`);
    });
    card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
    });
});

// 5. This year in the footer
document.querySelector('[data-year]').textContent = new Date().getFullYear();
