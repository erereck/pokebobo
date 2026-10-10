"""Tabela visual por espécie, estilo e lado. Não usa altura em metros como escala."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
geometry=json.loads((ROOT/'src/components/pokemon/spriteGeometry.json').read_text())
sprites=json.loads((ROOT/'src/game/data/battleSprites.json').read_text())
# Front/back são calibrados separadamente. Medidas são razões do tamanho de
# referência da cena, não percentuais da caixa de cada imagem.
adjustments={
 'pidgey':(.33,.35), 'pidgeotto':(.53,.56), 'pidgeot':(.74,.78),
 'rattata':(.30,.34), 'rattata-alola':(.30,.34), 'caterpie':(.29,.32),
 'weedle':(.26,.29), 'pikachu':(.43,.47), 'pichu':(.28,.30),
 'eevee':(.38,.43), 'bulbasaur':(.43,.47), 'charmander':(.43,.47),
 'squirtle':(.42,.46), 'togepi':(.29,.32), 'joltik':(.23,.26),
 'diglett':(.29,.33), 'diglett-alola':(.29,.33), 'tynamo':(.27,.30),
 'charizard':(.92,.96), 'onix':(.96,.99), 'steelix':(.99,1.02),
 'wailord':(.65,.68), 'snorlax':(.90,.96), 'gyarados':(.94,.98),
 'dragonite':(.92,.96), 'exeggutor-alola':(.99,1.02),
}
floating={'zubat','golbat','crobat','gastly','haunter','koffing','weezing','weezing-galar','magnemite','magneton','magnezone','butterfree','beedrill','drifloon','drifblim','rotom','chandelure'}
profiles={}
for id,sprite in sprites.items():
 profile={}
 for style in ['2d','3d']:
  sides={}
  for side in ['front','back']:
   file='battle-sprites/'+sprite[side] if style=='2d' else 'sprites/'+('ani-back/' if side=='back' else 'ani/')+id+'.gif'
   box=geometry[file]['bounds'];native_height=box[3]-box[1]
   reference='battle-sprites/'+sprites['charizard'][side] if style=='2d' else 'sprites/'+('ani-back/' if side=='back' else 'ani/')+'charizard.gif'
   ref=geometry[reference]['bounds'];ratio=.92*native_height/(ref[3]-ref[1])
   sides[side]=round(max(.25,min(1.02,ratio)),3)
  if id in adjustments:sides.update(zip(['front','back'],adjustments[id]))
  if id in floating:sides['lift']=.08
  profile[style]=sides
 profiles[id]=profile
(ROOT/'src/components/pokemon/battleSpeciesScale.json').write_text(json.dumps(profiles,indent=2)+'\n')
print(f'{len(profiles)} espécies/formas com calibração por estilo/lado.')
