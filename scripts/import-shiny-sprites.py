"""Paletas FRLG reais + primeiro frame BW, sem filtros de cor. Python + Pillow."""
from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
from io import BytesIO
from pathlib import Path
from urllib.request import urlopen
import argparse, json, re, struct, zlib
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://raw.githubusercontent.com/pret/pokefirered/037335f4c725d7c9aecdac87066f2002b4bd7e14/'
parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path)
args = parser.parse_args()
def fetch(path):
    local = args.source / path if args.source else None
    return local.read_bytes() if local and local.exists() else urlopen(SOURCE + path, timeout=30).read()
catalog = json.loads((ROOT / 'src/game/catalog.json').read_text(encoding='utf-8'))
originals = json.loads((ROOT / 'src/features/encounters/frlg-species.json').read_text(encoding='utf-8'))
clean = lambda name: re.sub('[^a-z0-9]', '', name.lower().replace('♀', 'f').replace('♂', 'm'))
entries = dict(re.findall(r'gMonFrontPic_(\w+)\[\].*?"(graphics/pokemon/[^".]+/front)\.4bpp', fetch('src/data/graphics/pokemon.h').decode()))
entries = {clean(name): path for name, path in entries.items()}
out = ROOT / 'public/sprites/frlg-shiny'
out.mkdir(parents=True, exist_ok=True)
def frlg(name):
    num = catalog[name]['num']; path = entries[clean(name)]
    palette_path = path.replace('/front', '/shiny') + '.pal'
    palette = fetch(palette_path)
    colors = [tuple(map(int, line.split())) for line in palette.decode().splitlines()[3:] if line.strip()]
    normal = Image.open(ROOT / f'public/sprites/frlg/{num}.png').convert('RGBA')
    image = Image.open(BytesIO(fetch(path + '.png'))).crop((0, 0, 64, 64))
    assert image.mode == 'P'
    result = Image.new('RGBA', image.size)
    result.putdata([(*colors[p % 16], 0 if p % 16 == 0 else 255) for p in image.get_flattened_data()])
    assert normal.getchannel('A').tobytes() == result.getchannel('A').tobytes(), name
    result.save(out / f'{num}.png')
    return {'name': name, 'file': f'frlg-shiny/{num}.png', 'sourceUrl': SOURCE + palette_path, 'paletteSha256': sha256(palette).hexdigest(), 'sourceSprite': SOURCE + path + '.png'}
with ThreadPoolExecutor(max_workers=3) as pool: records = list(pool.map(frlg, originals))
manifest = json.loads((ROOT / 'public/battle-sprites/manifest.json').read_text(encoding='utf-8'))
static_out = ROOT / 'public/sprites/shiny'; static_out.mkdir(parents=True, exist_ok=True)
for id, record in manifest.items():
    source = record['shinyFront']['file']
    data = (ROOT / 'public/battle-sprites' / source).read_bytes()
    # Um PNG publicado contém CRC inválido no perfil ICC. Os pixels originais
    # são íntegros; ignore apenas chunks auxiliares inválidos ao gerar o frame.
    if data.startswith(b'\x89PNG'):
        offset = 8; clean_data = data[:8]
        while offset < len(data):
            length = struct.unpack('>I', data[offset:offset+4])[0]
            chunk = data[offset:offset+length+12]
            valid = zlib.crc32(chunk[4:-4]) == struct.unpack('>I', chunk[-4:])[0]
            if valid: clean_data += chunk
            elif not chunk[4] & 32: raise ValueError(f'PNG crítico inválido: {source}')
            offset += length + 12
        data = clean_data
    image = Image.open(BytesIO(data)).convert('RGBA')
    # Quadrado transparente preserva a proporção na captura e nos cartões.
    size = max(image.size); square = Image.new('RGBA', (size, size))
    square.alpha_composite(image, ((size-image.width)//2, (size-image.height)//2))
    square.save(static_out / f'{id}.png')
    records.append({'name': record['name'], 'file': f'shiny/{id}.png', 'sourceFile': f'battle-sprites/{source}', 'sourceSha256': record['shinyFront']['sha256']})
for record in records:
    data = (ROOT / 'public/sprites' / record['file']).read_bytes()
    record.update(bytes=len(data), sha256=sha256(data).hexdigest())
(ROOT / 'public/sprites/shiny-manifest.json').write_text(json.dumps(records, indent=2, ensure_ascii=False)+'\n', encoding='utf-8')
print(f'{len(originals)} paletas FRLG + {len(manifest)} imagens BW locais.')
