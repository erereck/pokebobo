"""Extrai cinco retratos normais, sem redesenhar ou redimensionar os pixels.

Usa somente originais locais com hashes congelados. --check não escreve arquivos.
"""
from hashlib import sha256
from io import BytesIO
from pathlib import Path
import argparse
import json
import struct
import zlib
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
FORMS = ["exeggutor-alola", "mrmime-galar", "oricorio-pau", "raichu-alola", "weezing-galar"]
parser = argparse.ArgumentParser()
parser.add_argument("--check", action="store_true")
args = parser.parse_args()
sources = json.loads((ROOT / "public/battle-sprites/manifest.json").read_text(encoding="utf-8"))
geometry_path = ROOT / "src/components/pokemon/staticFormSpriteGeometry.json"
geometry = json.loads(geometry_path.read_text(encoding="utf-8")) if args.check else {}
index, records = {}, []
for species in FORMS:
    record = sources[species]
    source = record["front"]
    original = (ROOT / "public/battle-sprites" / source["file"]).read_bytes()
    assert sha256(original).hexdigest() == source["sha256"], species
    data = original
    if data.startswith(b"\x89PNG"):
        # Conserva pixels; ignora apenas o ICC auxiliar inválido já documentado.
        offset, clean = 8, data[:8]
        while offset < len(data):
            length = struct.unpack(">I", data[offset:offset + 4])[0]
            chunk = data[offset:offset + length + 12]
            if zlib.crc32(chunk[4:-4]) == struct.unpack(">I", chunk[-4:])[0]:
                clean += chunk
            elif not chunk[4] & 32:
                raise ValueError(f"Chunk crítico inválido: {species}")
            offset += length + 12
        data = clean
    image = Image.open(BytesIO(data)).convert("RGBA")
    size = max(image.size)
    square = Image.new("RGBA", (size, size))
    offset = ((size - image.width) // 2, (size - image.height) // 2)
    square.alpha_composite(image, offset)
    assert square.crop((offset[0], offset[1], offset[0] + image.width, offset[1] + image.height)).tobytes() == image.tobytes()
    bounds = list(square.getchannel("A").getbbox())
    stream = BytesIO()
    square.save(stream, format="PNG")
    output = stream.getvalue()
    file = f"forms/{species}.png"
    target = ROOT / "public/sprites" / file
    entry = {"size": list(square.size), "bounds": bounds, "frames": 1}
    if args.check:
        assert target.read_bytes() == output, file
        assert geometry[f"sprites/{file}"] == entry, file
    else:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(output)
        geometry[f"sprites/{file}"] = entry
    index[species] = file
    records.append({"name": record["name"], "file": file, "sourceFile": f"battle-sprites/{source['file']}",
        "sourceUrl": source["sourceUrl"], "sourceSha256": source["sha256"], "sourceFrame": 0,
        "bytes": len(output), "sha256": sha256(output).hexdigest(), **entry})
outputs = {
    ROOT / "src/components/pokemon/staticFormSprites.json": (json.dumps(index, separators=(",", ":")) + "\n").encode(),
    ROOT / "public/sprites/forms-manifest.json": (json.dumps(records, indent=2, ensure_ascii=False) + "\n").encode(),
}
if not args.check:
    outputs[geometry_path] = (json.dumps(dict(sorted(geometry.items())), separators=(",", ":")) + "\n").encode()
for target, data in outputs.items():
    if args.check:
        assert target.read_bytes() == data, target
    else:
        target.write_bytes(data)
print(json.dumps({"portraits": len(records), "bytes": sum(r["bytes"] for r in records), "mode": "check" if args.check else "write"}))
