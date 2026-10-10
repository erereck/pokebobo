"""Reproduz capas locais a partir do manifesto conferido. Requer Python/Pillow."""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlparse
from io import BytesIO
from hashlib import sha256
import argparse
import json
import time
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'src/game/data/cityCovers.json'
OUT = ROOT / 'public/covers'
USER_AGENT = 'Pokebobo-Cover-Importer/0.13 (+https://github.com/erereck/pokebobo)'


def source_bytes(cover, directory):
    if directory:
        for path in directory.glob(cover['id'] + '*-original.png'):
            raw = path.read_bytes()
            if sha256(raw).hexdigest() == cover['sourceSha256']:
                return raw
        raise ValueError(f"Original conferido não encontrado: {cover['id']}")
    url = cover['originalUrl']
    parsed = urlparse(url)
    if parsed.scheme != 'https' or parsed.netloc != 'archives.bulbagarden.net':
        raise ValueError('Fonte fora do domínio registrado')
    with urlopen(Request(url, headers={'User-Agent': USER_AGENT}), timeout=30) as response:
        raw = response.read()
    time.sleep(.5)
    if sha256(raw).hexdigest() != cover['sourceSha256']:
        raise ValueError(f"A fonte mudou; conferir antes de importar: {cover['id']}")
    return raw


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-dir', type=Path, help='Originais locais com nomes <id>*-original.png')
    args = parser.parse_args()
    covers = json.loads(MANIFEST.read_text(encoding='utf-8'))
    OUT.mkdir(exist_ok=True)
    for cover in covers.values():
        original = Image.open(BytesIO(source_bytes(cover, args.source_dir))).convert('RGBA')
        if original.size != (cover['width'], cover['height']):
            raise ValueError(f"Dimensões divergentes: {cover['id']}")
        buffer = BytesIO()
        original.save(buffer, format='WEBP', lossless=True, method=6, exact=True)
        data = buffer.getvalue()
        decoded = Image.open(BytesIO(data)).convert('RGBA')
        if decoded.tobytes() != original.tobytes():
            raise ValueError(f"Conversão alterou pixels: {cover['id']}")
        if sha256(data).hexdigest() != cover['sha256']:
            raise ValueError(f"Encoder diferente do manifesto; conferir versão de Pillow/libwebp: {cover['id']}")
        (OUT / cover['file']).write_bytes(data)
        print(f"{cover['id']}: {len(data)} bytes", flush=True)
    print(f"{len(covers)} imagens reproduzidas sem alterar pixels.")


if __name__ == '__main__':
    main()
