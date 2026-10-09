"""Extrai tiles e treinadores de FRLG. Requer Python 3 e Pillow; não participa do build."""
from io import BytesIO
from pathlib import Path
from urllib.request import urlopen
import struct
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'field'
SOURCE = 'https://raw.githubusercontent.com/pret/pokefirered/037335f4c725d7c9aecdac87066f2002b4bd7e14/'

def fetch(path):
    return urlopen(SOURCE + path, timeout=30).read()

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tiles = Image.open(BytesIO(fetch('data/tilesets/primary/general/tiles.png')))
    palettes = []
    for i in range(16):
        lines = fetch(f'data/tilesets/primary/general/palettes/{i:02}.pal').decode().splitlines()[3:]
        palettes.append([tuple(map(int, line.split())) for line in lines if line.strip()])
    data = fetch('data/tilesets/primary/general/metatiles.bin')
    # Chão, matinho, trilha, água, flores e arbusto: metatiles originais.
    ids = [1, 10, 217, 639, 4, 5]
    final = Image.new('RGBA', (len(ids)*16, 16))
    columns = tiles.width//8
    for index, tile_id in enumerate(ids):
        meta = Image.new('RGBA', (16,16))
        for quadrant, entry in enumerate(struct.unpack_from('<8H', data, tile_id*16)):
            source_id = entry & 1023
            x, y = source_id % columns * 8, source_id // columns * 8
            tile = tiles.crop((x,y,x+8,y+8))
            palette = palettes[entry>>12]
            raw = tile.get_flattened_data() if hasattr(tile,'get_flattened_data') else tile.getdata()
            rgba = Image.new('RGBA',(8,8))
            rgba.putdata([(*palette[int(color)%16],0 if int(color)%16 == 0 else 255) for color in raw])
            if entry & 1024: rgba = rgba.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
            if entry & 2048: rgba = rgba.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
            meta.alpha_composite(rgba,((quadrant%4%2)*8,(quadrant%4//2)*8))
        final.alpha_composite(meta,(index*16,0))
    final.save(OUT/'terrain.png')
    for name, width in [('red_normal',16),('red_surf',32)]:
        image = Image.open(BytesIO(fetch(f'graphics/object_events/pics/people/{name}.png'))).convert('RGBA')
        background = image.getpixel((0,0))[:3]
        raw = image.get_flattened_data() if hasattr(image,'get_flattened_data') else image.getdata()
        image.putdata([(*pixel[:3],0 if pixel[:3] == background else pixel[3]) for pixel in raw])
        image.crop((0,0,width,32)).save(OUT/f'{name}.png')
    print('Assets FRLG locais: terrain.png, red_normal.png, red_surf.png')

if __name__ == '__main__':
    main()
