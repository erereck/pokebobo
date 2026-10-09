"""Assets FRLG congelados: Python + Pillow. --source aceita um checkout local."""
from io import BytesIO
from pathlib import Path
from urllib.request import urlopen
import argparse, json, re, struct
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://raw.githubusercontent.com/pret/pokefirered/037335f4c725d7c9aecdac87066f2002b4bd7e14/'
parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path)
args = parser.parse_args()
OUT = ROOT / 'public' / 'field'
OUT.mkdir(parents=True, exist_ok=True)

def fetch(path):
    local = args.source / path if args.source else None
    return local.read_bytes() if local and local.exists() else urlopen(SOURCE + path, timeout=30).read()

def palette(path):
    return [tuple(map(int, line.split())) for line in fetch(path).decode().splitlines()[3:] if line.strip()]

def rgba(path, pal=None, transparent=True):
    image = Image.open(BytesIO(fetch(path)))
    if image.mode != 'P': raise ValueError(path)
    colors = pal or [tuple(image.getpalette()[i:i+3]) for i in range(0, len(image.getpalette()), 3)]
    pixels = list(image.get_flattened_data())
    result = Image.new('RGBA', image.size)
    result.putdata([(*colors[p % len(colors)], 0 if transparent and p % 16 == 0 else 255) for p in pixels])
    return result

def tilemap(path, palpath, dest):
    image = Image.open(BytesIO(fetch(path + '.png')))
    colors = palette(palpath)
    entries = struct.unpack('<2048H', fetch(path + '.bin'))
    output = Image.new('RGBA', (256, 256), (255,255,255,255))
    columns = image.width // 8
    for i, entry in enumerate(entries[:1024]):
        tile_id = entry & 1023
        tile = image.crop((tile_id % columns * 8, tile_id // columns * 8, tile_id % columns * 8 + 8, tile_id // columns * 8 + 8))
        tile_rgba = Image.new('RGBA', (8, 8))
        offset = ((entry >> 12) - (2 if 'battle_terrain' in path else 0)) * 16
        # BG palettes in these files begin at hardware palette bank 2.
        offset %= len(colors)
        tile_rgba.putdata([(*colors[(p % 16 + offset) % len(colors)], 0 if p % 16 == 0 else 255) for p in tile.get_flattened_data()])
        if entry & 1024: tile_rgba = tile_rgba.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        if entry & 2048: tile_rgba = tile_rgba.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        output.alpha_composite(tile_rgba, (i % 32 * 8, i // 32 * 8))
    output.crop((0, 0, 240, 160)).save(OUT / dest)

for name in ['red_normal', 'red_surf']:
    rgba(f'graphics/object_events/pics/people/{name}.png').save(OUT / f'{name}_sheet.png')
rgba('graphics/trainers/back_pics/red_back_pic.png', palette('graphics/trainers/palettes/red_back_pic.pal')).save(OUT / 'red_back.png')
rgba('graphics/interface/ball/poke.png').save(OUT / 'poke_ball.png')
particle_colors = Image.open(BytesIO(fetch('graphics/battle_anims/sprites/circle_impact.png'))).getpalette()
rgba('graphics/battle_anims/sprites/particles.png', [tuple(particle_colors[i:i+3]) for i in range(0, len(particle_colors), 3)]).save(OUT / 'ball_particles.png')
rgba('graphics/field_effects/pics/tall_grass.png', palette('graphics/field_effects/palettes/general_1.pal')).save(OUT / 'tall_grass.png')
health = rgba('graphics/battle_interface/healthbox_singles_opponent.png', palette('graphics/battle_interface/healthbox.pal'))
healthbox = Image.new('RGBA', (128,32))
for i in range(64):
    tile = health.crop((i % 16 * 8, i // 16 * 8, i % 16 * 8 + 8, i // 16 * 8 + 8))
    healthbox.paste(tile, (i // 32 * 64 + i % 8 * 8, i % 32 // 8 * 8))
healthbox.save(OUT / 'healthbox.png')
elements = rgba('graphics/battle_interface/healthbox_elements.png', palette('graphics/battle_interface/healthbar.pal'))
hp = Image.new('RGBA', (64, 8))
hp.paste(elements.crop((8,0,24,8)), (0,0))
for i in range(6): hp.paste(elements.crop((88,0,96,8)), (16+i*8,0))
hp.save(OUT / 'healthbar.png')
for terrain in ['grass', 'water']:
    tilemap(f'graphics/battle_terrain/{terrain}/terrain', f'graphics/battle_terrain/{terrain}/terrain.pal', f'capture_{terrain}.png')
tilemap('graphics/battle_interface/textbox', 'graphics/battle_interface/textbox1.pal', 'textbox.png')

font = Image.open(BytesIO(fetch('graphics/fonts/latin_normal.png'))).crop((0, 0, 256, 256))
for name, colors in [('font_dark', [(0,0,0,0),(56,56,56,255),(168,168,168,255),(0,0,0,0)]), ('font_light', [(0,0,0,0),(255,255,255,255),(56,56,80,255),(0,0,0,0)])]:
    result = Image.new('RGBA', font.size)
    result.putdata([colors[p] for p in font.get_flattened_data()])
    result.save(OUT / f'{name}.png')
text_source = fetch('src/text.c').decode()
widths = re.search(r'sFontNormalLatinGlyphWidths\[\]\s*=\s*\{(.*?)\};', text_source, re.S).group(1)
widths = re.sub(r'//[^\n]*|/\*.*?\*/', '', widths, flags=re.S)
metrics = {'widths': [int(n) for n in re.findall(r'\d+', widths)], 'chars': {}}
for char, code in re.findall(r"^'(.)'\s*=\s*([A-F0-9]{2})\s*$", fetch('charmap.txt').decode(), re.M):
    metrics['chars'][char] = int(code, 16)
(ROOT / 'src/features/encounters/font-metrics.json').write_text(json.dumps(metrics, ensure_ascii=False), encoding='utf-8')

catalog = json.loads((ROOT / 'src/game/catalog.json').read_text(encoding='utf-8'))
clean = lambda name: re.sub('[^a-z0-9]', '', name.lower().replace('♀', 'f').replace('♂', 'm'))
entries = dict(re.findall(r'gMonFrontPic_(\w+)\[\].*?"(graphics/pokemon/[^".]+/front)\.4bpp', fetch('src/data/graphics/pokemon.h').decode()))
entries = {clean(name): path for name, path in entries.items()}
dest = ROOT / 'public' / 'sprites' / 'frlg'
dest.mkdir(parents=True, exist_ok=True)
count = 0
species = {}
coords = {clean(name): int(offset) for name, offset in re.findall(r'\[SPECIES_(\w+)\].*?\.y_offset\s*=\s*(\d+)', fetch('src/data/pokemon_graphics/front_pic_coordinates.h').decode(), re.S)}
for name, mon in catalog.items():
    path = entries.get(clean(name))
    if path and mon['num'] <= 386:
        rgba(path + '.png', palette(path.replace('/front', '/normal') + '.pal')).crop((0,0,64,64)).save(dest / f"{mon['num']}.png")
        count += 1
        species[name] = {'offset': coords.get(clean(name), 0)}
(ROOT / 'src/features/encounters/frlg-species.json').write_text(json.dumps(species), encoding='utf-8')
print(f'FRLG: sprites, campo, fundos, fonte; {count} Pokémon locais em 64×64.')
