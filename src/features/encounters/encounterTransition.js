import { tintedPixelImage } from "./pixelAssets.js";

// FRLG: duas passagens RGB(11,11,11), depois Slice ou Ripple.
const slice = [0];
let speed = 256,
  acceleration = 1;
while (slice.at(-1) < 240) {
  slice.push(Math.min(240, slice.at(-1) + (speed >> 8)));
  if (speed <= 4095) speed += acceleration;
  if (acceleration < 128) acceleration *= 2;
}
export const encounterTransitionDuration = (water) =>
  32 + (water ? 57 : slice.length);
export function drawEncounterTransition(ctx, field, tick, water) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 240, 160);
  if (tick < 32) {
    const p = tick % 16;
    ctx.drawImage(
      tintedPixelImage(field, [90, 90, 90], (p < 8 ? p + 1 : 15 - p) / 8),
      0,
      0,
    );
    return;
  }
  const frame = tick - 32;
  if (!water) {
    const offset = slice[Math.min(frame, slice.length - 1)];
    if (offset >= 240) return;
    for (let y = 0; y < 160; y++)
      ctx.drawImage(
        field,
        y & 1 ? offset : 0,
        y,
        240 - offset,
        1,
        y & 1 ? 0 : offset,
        y,
        240 - offset,
        1,
      );
  } else {
    const amplitude = Math.min(31, Math.floor((frame * 384) / 256));
    for (let y = 0; y < 160; y++) {
      const offset = Math.trunc(
        Math.sin(((frame * 4 + y * 1.5) * Math.PI) / 128) * amplitude,
      );
      const sourceY = (y + offset + 160) % 160;
      ctx.drawImage(field, 0, sourceY, 240, 1, 0, y, 240, 1);
    }
    ctx.fillStyle = `rgba(0,0,0,${Math.max(0, (frame - 40) / 16)})`;
    ctx.fillRect(0, 0, 240, 160);
  }
}
