"""Rasteriza a geometria do favicon existente, em zona segura de ícone maskable."""
from pathlib import Path
from PIL import Image, ImageDraw

out = Path(__file__).resolve().parents[1] / 'public/icons'
out.mkdir(exist_ok=True)
for size in [192, 512]:
    scale = size * 4 / 64
    image = Image.new('RGB', (size * 4, size * 4), '#c62f45')
    draw = ImageDraw.Draw(image)
    box = tuple(round(v * scale) for v in [12, 12, 52, 52])
    draw.pieslice(box, 0, 180, fill='#f9fbe9')
    draw.ellipse(box, outline='#21362f', width=round(4 * scale))
    draw.line([(12*scale, 32*scale), (52*scale, 32*scale)], fill='#21362f', width=round(4*scale))
    draw.ellipse(tuple(round(v*scale) for v in [25,25,39,39]), fill='#f9fbe9', outline='#21362f', width=round(4*scale))
    image.resize((size,size), Image.Resampling.LANCZOS).save(out / f'pokebobo-{size}.png', optimize=True)
