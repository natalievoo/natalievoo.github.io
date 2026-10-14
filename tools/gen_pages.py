"""Writes the section pages of natalievoo.github.io from one shared head, so every page matches.
Run: python gen_pages.py <site root>"""
import sys, os
ROOT = sys.argv[1]

HEAD = '''<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{title} · Natalie Voo</title>
    <meta name="description" content="{desc}">
    <link rel="icon" href="../favicon.svg" type="image/svg+xml">
    <link rel="icon" href="../favicon-32.png" sizes="32x32" type="image/png">
    <link rel="apple-touch-icon" href="../apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Silkscreen&family=Caveat:wght@500&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC:wght@700&text=鄔&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/base.css">
    <style>
{style}
    </style>
</head>
<body>
    <header data-site-head="{section}"></header>
{body}
    <footer class="site-foot"><span>© <span data-year></span> Natalie Voo</span><span class="made" data-made></span><a href="../index.html">Home</a></footer>

    <script src="../data/site.js"></script>
    <script src="../assets/stickers.js"></script>
    <script src="../assets/site.js"></script>
    <script src="../assets/screensaver.js"></script>
{scripts}
    <script>document.querySelectorAll('[data-year]').forEach((el) => {{ el.textContent = new Date().getFullYear(); }});</script>
</body>
</html>
'''

ARROW = '<svg viewBox="0 0 46 40" aria-hidden="true"><path d="M44 4 C30 2 14 10 8 30"/><path d="M3 22 L8 31 L16 25"/></svg>'
def note(text, top='5.5rem', left='calc(100% - 4rem)'):
    """A line scribbled in the margin of the page head, with a doodled arrow pointing back at the text."""
    return f'<p class="margin-note" style="top:{top};left:{left}">{ARROW}<span>{text}</span></p>'

def page(path, title, desc, section, style, body, scripts):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    html = HEAD.format(title=title, desc=desc, section=section, style=style.strip('\n'), body=body.rstrip(), scripts=scripts.rstrip())
    open(full, 'w', encoding='utf-8', newline='\n').write(html)
    print('wrote', path)

for name in sorted(os.listdir(os.path.join(os.path.dirname(__file__), 'pages'))):
    if not name.endswith('.py') or name.startswith('_'):
        continue  # files starting with _ hold shared parts, not pages
    ns = {'page': page, 'note': note, 'PAGES': os.path.join(os.path.dirname(__file__), 'pages')}
    exec(open(os.path.join(os.path.dirname(__file__), 'pages', name), encoding='utf-8').read(), ns)
