import atlas from "./effectAtlas.json" with { type: "json" };
import { loadPixelImage } from "../../encounters/pixelAssets.js";

const images = new Map();
export function preloadBattleEffects() {
  return Promise.all(
    Object.entries(atlas.sheets).map(async ([name, meta]) => {
      if (images.has(name)) return;
      try {
        images.set(
          name,
          await loadPixelImage(
            `${import.meta.env.BASE_URL}battle-effects/${meta.file}`,
          ),
        );
      } catch {
        /* As partículas próprias mantêm o turno jogável; outra arena tenta de novo. */
      }
    }),
  );
}
export const loadedBattleEffects = () => new Map(images);

export function drawOriginalGlyph(ctx, images, type, x, y, r, phase) {
  const name = atlas.types[type] || type,
    meta = atlas.sheets[name],
    image = images.get(name);
  if (!meta || !image) return false;
  const [w, h] = meta.frame,
    sequence = meta.sequence;
  const step = Math.floor(Math.max(0, phase) * Math.max(8, sequence.length));
  const index = sequence[step % sequence.length],
    size = Math.max(2, Math.round(r * 2));
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  if (type === "Grass" || type === "Rock" || type === "Ground")
    ctx.rotate(phase * Math.PI * 2);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    image,
    (index % meta.columns) * w,
    Math.floor(index / meta.columns) * h,
    w,
    h,
    -size / 2,
    (-size * h) / w / 2,
    size,
    (size * h) / w,
  );
  ctx.restore();
  return true;
}
