// Books. One block per book.
// `year` and `month` are when I finished it (month 1-12). `stars` is 1-5.
// `favourite: true` puts it on the top shelf. `pick: true` makes it that month's favourite.
// `review` is a sentence or two for the card; `longReview` (optional) gets its own page at
// reading/review.html?b=<id>. Paragraphs in `longReview` are separated by a blank line.
// `spine` is the book's colour on the shelf. Delete `sample: true` once an entry is real.
window.READING = {
    goodreads: 'https://www.goodreads.com/',
    books: [
        { id: 'book-one', title: 'A Favourite Book', author: 'Author Name', year: 2026, month: 1, stars: 5, favourite: true, pick: true, spine: '#2f5d8c', sample: true,
          review: 'Why I loved it, in a sentence.', longReview: 'A longer review goes here.\n\nA second paragraph.' },
        { id: 'book-two', title: 'Another Good One', author: 'Author Name', year: 2026, month: 2, stars: 4, pick: true, spine: '#b3362b', sample: true,
          review: 'One line about it.' },
        { id: 'book-three', title: 'The Myth Retelling', author: 'Author Name', year: 2026, month: 3, stars: 5, favourite: true, pick: true, spine: '#3d8b7d', sample: true,
          review: 'One line about it.', longReview: 'A longer review goes here.' },
        { id: 'book-four', title: 'A Data Book', author: 'Author Name', year: 2026, month: 3, stars: 3, spine: '#c79a5b', sample: true,
          review: 'One line about it.' },
        { id: 'book-five', title: 'Last Year\'s Best', author: 'Author Name', year: 2025, month: 11, stars: 5, favourite: true, pick: true, spine: '#1f2a30', sample: true,
          review: 'One line about it.' },
        { id: 'book-six', title: 'A Quick Read', author: 'Author Name', year: 2025, month: 8, stars: 4, spine: '#7fb3a3', sample: true,
          review: 'One line about it.' },
    ],
};
