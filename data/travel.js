// Every country I've been to.
// To add one, copy a block and change it. `id` becomes the page address:
// travel/country.html?c=<id>. Delete `sample: true` once an entry is real.
// `visits` is how many times I've been; the page counts them in 正 (five strokes = five visits).
window.TRAVEL = [
    {
        id: 'china', name: 'China', native: '中国', region: 'Asia', visits: 7, firstVisit: 2001, sample: true,
        line: 'Where the village is, and the chickens.',
        highlights: [
            { title: 'The village', text: 'Chasing chickens round the courtyard as a child. Write the memory here.' },
            { title: 'A highlight', text: 'Another moment from this country.' },
        ],
        restaurants: [
            { name: 'Restaurant name', city: 'City', dish: 'What to order', note: 'Why it is good', stars: 5 },
        ],
    },
    {
        id: 'malaysia', name: 'Malaysia', native: 'Malaysia', region: 'Asia', visits: 12, firstVisit: 1999, sample: true,
        line: 'One line about Malaysia.',
        highlights: [{ title: 'A highlight', text: 'A moment from Malaysia.' }],
        restaurants: [{ name: 'Restaurant name', city: 'Kuala Lumpur', dish: 'Nasi lemak', note: 'Why it is good', stars: 5 }],
    },
    {
        id: 'netherlands', name: 'The Netherlands', native: 'Nederland', region: 'Europe', visits: 1, firstVisit: 2024, sample: true,
        line: 'Home now. One line about it.',
        highlights: [{ title: 'A highlight', text: 'A moment from the Netherlands.' }],
        restaurants: [{ name: 'Restaurant name', city: 'Amsterdam', dish: 'What to order', note: 'Why it is good', stars: 4 }],
    },
    {
        id: 'greece', name: 'Greece', native: 'Ελλάδα', region: 'Europe', visits: 1, firstVisit: 2023, sample: true,
        line: 'Where the myths happened.',
        highlights: [{ title: 'A highlight', text: 'A moment from Greece.' }],
        restaurants: [{ name: 'Restaurant name', city: 'Athens', dish: 'What to order', note: 'Why it is good', stars: 4 }],
    },
    {
        id: 'japan', name: 'Japan', native: '日本', region: 'Asia', visits: 2, firstVisit: 2019, sample: true,
        line: 'One line about Japan.',
        highlights: [{ title: 'A highlight', text: 'A moment from Japan.' }],
        restaurants: [{ name: 'Restaurant name', city: 'Tokyo', dish: 'What to order', note: 'Why it is good', stars: 5 }],
    },
];
