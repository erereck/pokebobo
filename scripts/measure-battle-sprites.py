"""Geometria de todos os quadros: Python + Pillow; não altera os sprites.

--source-dir aponta para o cache 3D descrito no manifesto de fontes.
Os sprites BW e PNGs de fallback são lidos do próprio repositório.
"""
from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
from io import BytesIO
from pathlib import Path
import argparse, json, struct, zlib
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--source-dir',type=Path)
parser.add_argument('--plan',type=Path)
parser.add_argument('--bw-only',action='store_true')
args=parser.parse_args()
manifest=json.loads((ROOT/'public/battle-sprites/manifest.json').read_text())
jobs=[]
for mon in manifest.values():
 for side in ['front','back','shinyFront','shinyBack']:
  entry=mon[side]
  jobs.append({'key':'battle-sprites/'+entry['file'],'path':ROOT/'public/battle-sprites'/entry['file'],'source':entry['sourceUrl'],'sha256':entry['sha256']})
for path in (ROOT/'public/sprites').glob('*.png'):
 jobs.append({'key':'sprites/'+path.name,'path':path})
for path in (ROOT/'public/sprites/shiny').glob('*.png'):
 jobs.append({'key':'sprites/shiny/'+path.name,'path':path})
if not args.bw_only:
 plan=json.loads(args.plan.read_text()) if args.plan else json.loads((ROOT/'docs/balance/sprite-geometry-sources.json').read_text())
 for entry in plan:
  if entry.get('missing'):continue
  jobs.append({'key':'sprites/'+entry['file'],'path':args.source_dir/entry['file'],'source':entry['url'],'sha256':entry['sha256']})

def measure(job):
 data=job['path'].read_bytes();digest=sha256(data).hexdigest()
 assert job.get('sha256',digest)==digest,job['key']
 # O perfil ICC auxiliar inválido já documentado não altera os pixels.
 if data.startswith(b'\x89PNG'):
  offset=8;clean=data[:8]
  while offset<len(data):
   size=struct.unpack('>I',data[offset:offset+4])[0];chunk=data[offset:offset+size+12]
   if zlib.crc32(chunk[4:-4])==struct.unpack('>I',chunk[-4:])[0]:clean+=chunk
   elif not chunk[4]&32:raise ValueError(job['key'])
   offset+=size+12
  data=clean
 image=Image.open(BytesIO(data));union=None;first=None;last=None
 for i in range(image.n_frames):
  image.seek(i);box=image.convert('RGBA').getchannel('A').getbbox()
  if not box:continue
  first=first or box;last=box
  union=box if union is None else (min(union[0],box[0]),min(union[1],box[1]),max(union[2],box[2]),max(union[3],box[3]))
 assert union,job['key']
 return job['key'],{'size':list(image.size),'bounds':list(union),'frames':image.n_frames}, {'file':job['key'],'sha256':digest,'bytes':len(data),'sourceUrl':job.get('source'),'first':list(first),'last':list(last)}

geometry={};sources=[]
with ThreadPoolExecutor(max_workers=4) as pool:
 for i,(key,record,source) in enumerate(pool.map(measure,jobs)):
  geometry[key]=record;sources.append(source)
  if (i+1)%400==0:print(f'{i+1}/{len(jobs)}',flush=True)
out=ROOT/'src/components/pokemon/spriteGeometry.json'
if args.bw_only:out=ROOT.parent/'bw-geometry.json'
out.write_text(json.dumps(dict(sorted(geometry.items())),separators=(',',':'))+'\n')
report={'files':len(geometry),'frames':sum(r['frames'] for r in geometry.values()),'sourceSha256':sha256(out.read_bytes()).hexdigest(),'sources':sources}
(ROOT/'docs/balance'/('bw-geometry-report.json' if args.bw_only else 'sprite-geometry-0.16.0.json')).write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='sources'}))
