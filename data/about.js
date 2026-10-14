// The About page. Everything here is written as if into small files on a desk.
// Delete `sample: true` once an entry is real.
window.ABOUT = {
    // about.txt: a few short paragraphs. Use {edit} once, where `edit` below should appear:
    // it is drawn as a line crossed out in pen with the new words written above it.
    bio: [
        { text: 'I work with data at Koalitix, in the Netherlands, and I build small things on the side.' },
        { text: 'Before that I was {edit}.', sample: true },
        { text: 'I grew up between a village in China and Malaysia, which is why I say hello in five languages and count in 正.', sample: true },
    ],
    edit: { before: 'a product analyst', after: 'chasing chickens in a courtyard', sample: true },

    // languages.txt: `level` is 1 to 5, drawn as pen strokes
    languages: [
        { name: 'English', hello: 'Hello', level: 5 },
        { name: 'Cantonese', hello: '你好', level: 5, note: 'the one from home', sample: true },
        { name: 'Hakka', hello: '你好', level: 4, note: 'my grandparents', sample: true },
        { name: 'Mandarin', hello: '你好', level: 5, sample: true },
        { name: 'Malay', hello: 'Apa khabar', level: 4, sample: true },
        { name: 'Dutch', hello: 'Hoi', level: 1, note: 'a bit, working on it' },
    ],

    // now.txt: what I am up to at the moment. The homepage shows the first three.
    now: [
        { label: 'reading', text: 'a book I will name here', sample: true },
        { label: 'training', text: 'something at the gym', sample: true },
        { label: 'learning', text: 'Dutch' },
        { label: 'dancing', text: 'latin, badly and happily', sample: true },
        { label: 'listening', text: 'a song on repeat', sample: true },
    ],

    // likes.txt
    likes: ['Greek myths', 'horses', 'water', 'being a Pisces', 'languages', 'travelling', 'writing', 'making things', 'the gym', 'dancing', 'people'],

    // The line under the lens: only readable through the magnifying glass. Something you would
    // tell a friend, not the internet.
    secret: 'Write a secret here. Something small and true, the kind of thing you only say to a friend.',
    secretSample: true,

    // Three photo prints, clipped to the page. `image` is a path like 'images/about/village.jpg'; without one, a sketch stands in.
    prints: [
        { caption: 'the village', image: '', sample: true },
        { caption: 'somewhere by the sea', image: '', sample: true },
        { caption: 'after class', image: '', sample: true },
    ],
};
