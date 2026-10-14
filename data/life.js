// Life: the timeline, 2026 in numbers, goals and music.
// Delete `sample: true` once an entry is real.
window.LIFE = {
    // Oldest first. `place` is optional.
    timeline: [
        { year: 2000, title: 'Born', text: 'Where and when.', place: '', sample: true },
        { year: 2005, title: 'The village', text: 'Chasing chickens in the courtyard.', place: 'China', sample: true },
        { year: 2018, title: 'A milestone', text: 'What happened.', place: '', sample: true },
        { year: 2024, title: 'Moved to the Netherlands', text: 'What happened.', place: 'Netherlands', sample: true },
        { year: 2026, title: 'Now', text: 'Working with data at Koalitix.', place: 'Netherlands', sample: true },
    ],
    // `value` so far this year; `goal` (optional) draws a progress bar
    stats2026: [
        { label: 'Gym sessions', value: 0, goal: 150, unit: '', sample: true },
        { label: 'Dance classes', value: 0, goal: 40, unit: '', sample: true },
        { label: 'Books finished', value: 0, goal: 24, unit: '', sample: true },
        { label: 'Countries visited', value: 0, unit: '', sample: true },
        { label: 'Pieces written', value: 0, goal: 12, unit: '', sample: true },
        { label: 'Kilometres travelled', value: 0, unit: 'km', sample: true },
    ],
    statsUpdated: '2026-10-14',
    goals: [
        { text: 'A goal for the rest of the year', done: false, sample: true },
        { text: 'Another goal', done: false, sample: true },
        { text: 'One already done', done: true, sample: true },
    ],
    music: {
        spotify: 'https://open.spotify.com/',
        instruments: ['Instrument one', 'Instrument two'],
        dance: ['A dance style'],
        sample: true,
    },
};
