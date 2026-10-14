# natalievoo.github.io

My personal website, live at https://natalievoo.github.io.

- `index.html`: the content (text, sections, links)
- `style.css`: the look and the animations (colours at the top, taken from *A Thousand Li of Rivers and Mountains*)
- `script.js`: the interactive bits (the ink painting, the name written stroke by stroke, the rotating greeting, sections soaking in)

To preview locally, open `index.html` in a browser. To publish, commit and push to `main`; GitHub Pages updates in a minute or so.

The section pages (`travel/`, `reading/`, `writing/`, `projects/`, `life/`, `about/`) are generated from one shared template so they all match: edit `tools/pages/*.py`, then run `python tools/gen_pages.py .` from the repo root. The content itself lives in `data/*.js`, which you edit directly.
