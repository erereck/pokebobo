"""Importa a folha de pesca de Red, sem modificar outros assets. Requer Pillow."""
from pathlib import Path
from hashlib import sha256
from io import BytesIO
from urllib.request import urlopen
import argparse
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
REVISION = '037335f4c725d7c9aecdac87066f2002b4bd7e14'
RELATIVE = 'graphics/object_events/pics/people/red_fish.png'
URL = f'https://raw.githubusercontent.com/pret/pokefirered/{REVISION}/{RELATIVE}'

def main(source):
    raw = (source / RELATIVE).read_bytes() if source else urlopen(URL, timeout=30).read()
    original = Image.open(BytesIO(raw))
    assert original.mode == 'P' and original.size == (384, 32)
    # Índice zero é transparente; manter cores/poses sem interpolação.
    rgba = original.convert('RGBA')
    pixels = list(rgba.getdata())
    rgba.putdata([(*pixel[:3], 0 if index == 0 else 255)
                  for index, pixel in zip(original.getdata(), pixels)])
    target = ROOT / 'public/field/red_fish_sheet.png'
    rgba.save(target, optimize=True)
    manifest = {'revision': REVISION, 'source': URL,
                'sourceSha256': sha256(raw).hexdigest(),
                'sha256': sha256(target.read_bytes()).hexdigest(),
                'bytes': target.stat().st_size, 'size': list(rgba.size),
                'frames': 12, 'frame': [32, 32],
                'conversion': 'PNG RGBA, índice zero transparente; pixels/poses preservados'}
    (ROOT / 'public/field/fishing-manifest.json').write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print(manifest)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', type=Path)
    main(parser.parse_args().source)
