"""Sprites FRLG para partículas de batalha. Python/Pillow; fora do build web."""
from pathlib import Path
from hashlib import sha256
from io import BytesIO
from urllib.request import urlopen
import argparse
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
REVISION = '037335f4c725d7c9aecdac87066f2002b4bd7e14'
SOURCE = f'https://raw.githubusercontent.com/pret/pokefirered/{REVISION}/'
FOLDER = 'graphics/battle_anims/sprites/'
# Tamanho de cada quadro; folhas inteiras preservadas. Rocks escolhe o
# desenho grande, não anima como se os seis tamanhos fossem poses.
SHEETS = {
    'fire': (32,32,list(range(8))), 'bubble': (16,16,[0,1,2]),
    'electricity': (32,32,[0,1,2,3]), 'ice_crystals_0': (16,16,[0]),
    'razor_leaf': (16,16,[0,1]), 'shadow_ball': (32,32,[0]),
    'rocks': (32,32,[0]), 'poison_bubble': (16,16,[0,1,2]),
    'air_wave': (32,16,[0]), 'ring': (16,16,[0,1,2]),
    'needle': (16,16,[0]), 'punch_impact': (32,32,[0]),
    'blue_flames': (32,32,[0,1]), 'claw_slash': (32,32,[0,1,2,3,4]),
    'cross_impact': (32,32,[0]), 'blue_star': (32,32,list(range(7))),
    'circle_impact': (8,8,[0]), 'impact': (32,32,[0]),
}
TYPES = {'Normal':'circle_impact','Fire':'fire','Water':'bubble','Grass':'razor_leaf',
    'Electric':'electricity','Ice':'ice_crystals_0','Fighting':'punch_impact',
    'Poison':'poison_bubble','Ground':'rocks','Flying':'air_wave','Psychic':'ring',
    'Bug':'needle','Rock':'rocks','Ghost':'shadow_ball','Dragon':'blue_flames',
    'Dark':'claw_slash','Steel':'cross_impact','Fairy':'blue_star'}

def main(local):
    out = ROOT / 'public' / 'battle-effects'; out.mkdir(parents=True,exist_ok=True)
    previous = json.loads((out/'manifest.json').read_text(encoding='utf-8')) if (out/'manifest.json').exists() else {}
    manifest = {'revision':REVISION,'source':SOURCE,'transformation':'Paleta embutida preservada; índice zero transparente; sem suavização. Tempos/trajetórias adaptados pelo Pokébobo.','files':{}}
    index = {'types':TYPES,'sheets':{}}
    for name,(w,h,sequence) in SHEETS.items():
        relative = FOLDER+name+'.png'
        raw = (local/relative).read_bytes() if local else urlopen(SOURCE+relative,timeout=30).read()
        frozen = previous.get('files',{}).get(name+'.png',{}).get('sourceSha256')
        if frozen and sha256(raw).hexdigest()!=frozen:
            raise ValueError(f'Fonte alterada: {relative}; use a revisão congelada registrada no manifesto.')
        source = Image.open(BytesIO(raw)); source.load()
        assert source.mode == 'P' and source.width%w==0 and source.height%h==0
        indices = list(source.get_flattened_data() if hasattr(source,'get_flattened_data') else source.getdata())
        rgba = source.convert('RGBA'); pixels = list(rgba.get_flattened_data() if hasattr(rgba,'get_flattened_data') else rgba.getdata())
        rgba.putdata([(*pixel[:3],0 if color==0 else 255) for color,pixel in zip(indices,pixels)])
        target = out/(name+'.png'); rgba.save(target,optimize=True)
        cols = source.width//w; frames = cols*(source.height//h)
        assert all(0<=frame<frames for frame in sequence), f'{name}: {frames} quadros, sequência {sequence}'
        entry = {'file':target.name,'frame':[w,h],'columns':cols,'frames':frames,'sequence':sequence}
        index['sheets'][name] = entry
        manifest['files'][target.name] = {**entry,'source':SOURCE+relative,'sourceSha256':sha256(raw).hexdigest(),'sha256':sha256(target.read_bytes()).hexdigest(),'size':[rgba.width,rgba.height],'bytes':target.stat().st_size}
    (out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (ROOT/'src/features/battle/visuals/effectAtlas.json').write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'{len(SHEETS)} folhas, {len(TYPES)} tipos, {sum(v["bytes"] for v in manifest["files"].values())} bytes PNG; paletas/quadros preservados.')

if __name__ == '__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--source',type=Path)
    main(parser.parse_args().source)
