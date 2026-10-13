"""Arma las páginas del sitio a partir de src/.

Cada archivo de src/pages/ empieza con metadatos `clave: valor`, una línea `---`
y después el contenido. El contenido se inserta en src/layout.html.

Marcas disponibles en cualquier archivo:
  {{> carpeta/archivo}}   incluye src/carpeta/archivo.html
  {{clave}}               reemplaza por el metadato de la página
  {{cur:pagina}}          aria-current="page" si es la página actual

Uso:  python build.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / 'src'


def include(text, depth=0):
    if depth > 5:
        raise RuntimeError('Demasiados includes anidados')
    return re.sub(r'\{\{>\s*([\w/-]+)\s*\}\}',
                  lambda m: include((SRC / f'{m.group(1)}.html').read_text(encoding='utf-8').rstrip('\n'), depth + 1),
                  text)


def build_page(path, layout):
    raw = path.read_text(encoding='utf-8')
    head, _, body = raw.partition('\n---\n')
    meta = dict(line.split(':', 1) for line in head.strip().splitlines())
    meta = {k.strip(): v.strip() for k, v in meta.items()}
    meta['page'] = path.stem
    meta.setdefault('booking_href', 'reservar.html#disponibilidad')

    html = include(layout.replace('{{content}}', body.strip('\n')))
    html = re.sub(r'\{\{cur:([\w-]+)\}\}',
                  lambda m: ' aria-current="page"' if m.group(1) == path.stem else '', html)
    html = re.sub(r'\{\{(\w+)\}\}', lambda m: meta[m.group(1)], html)
    leftover = re.findall(r'\{\{.*?\}\}', html)
    if leftover:
        raise RuntimeError(f'{path.name}: marcas sin resolver {leftover}')
    (ROOT / path.name).write_text(html, encoding='utf-8', newline='\n')
    print(f'  {path.name}')


if __name__ == '__main__':
    layout = (SRC / 'layout.html').read_text(encoding='utf-8')
    print('Generando páginas:')
    for page in sorted((SRC / 'pages').glob('*.html')):
        build_page(page, layout)
