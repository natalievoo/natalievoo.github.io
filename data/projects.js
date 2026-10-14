// Projects. Each one gets a page at projects/project.html?p=<id>.
// `kind` is 'data' or 'creative' (the page can filter by it).
// `status` is 'idea', 'building' or 'live'.
// `sketch` and `final` are image paths (e.g. 'images/projects/ikebana-sketch.jpg'), both optional:
// without them the page draws a placeholder. `sections` are the write-up, as heading + text.
// `link` is where the project lives, if anywhere. Delete `sample: true` once an entry is real.
window.PROJECTS = [
    {
        id: 'chicken-chase', title: 'Chasing Chickens', zi: '鸡', kind: 'creative', status: 'live', year: 2026,
        line: 'A pixel game from a childhood memory: me, a village courtyard, and chickens that would not be caught.',
        link: 'play/index.html', linkLabel: 'Play it',
        sections: [
            { heading: 'Why', text: 'Write why you made it.' },
            { heading: 'How it works', text: 'The chickens flee when you get close; the closer you get, the faster they flap.' },
        ],
    },
    {
        id: 'commodity-tracker', title: 'Commodity Tracker', zi: '数', kind: 'data', status: 'live', year: 2026, sample: true,
        line: 'Weekly prices, fundamentals and headlines for hard-commodity producers, in one snapshot.',
        sections: [
            { heading: 'What it does', text: 'Describe it here.' },
            { heading: 'How it is built', text: 'A weekly pipeline pulls prices, filings and news and stores a dated snapshot.' },
        ],
    },
    {
        id: 'meal-planner', title: 'Meal Planner', zi: '食', kind: 'data', status: 'building', year: 2026, sample: true,
        line: 'Plans meals for micronutrients and prices them at Dutch supermarkets.',
        sections: [
            { heading: 'What it does', text: 'Describe it here.' },
            { heading: 'The bonus', text: 'Live prices from Dutch supermarkets, refreshed every week.' },
        ],
    },
    {
        id: 'ikebana', title: 'Ikebana', zi: '花', kind: 'creative', status: 'idea', year: 2026, sample: true,
        line: 'An idea in progress. One line about it.',
        sections: [{ heading: 'The idea', text: 'Describe it here.' }],
    },
    {
        id: 'this-site', title: 'This Website', zi: '墨', kind: 'creative', status: 'live', year: 2026,
        line: 'Ink on rice paper, a name brushed stroke by stroke, koi, stickers, and a horse in the tab.',
        sections: [{ heading: 'How it is made', text: 'Write about it here.' }],
    },
];
