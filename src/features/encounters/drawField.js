import { EXPLORATION_RULES } from "../../game/config/exploration.js";
import { terrainAt, isTallGrass } from "../../game/world/exploration.js";
import { fieldPose, grassUnderFeet } from "./fieldPresentation.js";

export function drawField(ctx, [tiles, trainer, surf, grass], e, tick) {
  const { width, height } = EXPLORATION_RULES;
  ctx.clearRect(0, 0, width * 16, height * 16);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const terrain = terrainAt(x, y);
      const tile =
        terrain === "water"
          ? 3
          : terrain === "path"
            ? 2
            : isTallGrass(e, x, y)
              ? 1
              : 0;
      ctx.drawImage(tiles, tile * 16, 0, 16, 16, x * 16, y * 16, 16, 16);
      if (
        terrain === "grass" &&
        !isTallGrass(e, x, y) &&
        ((x === 0 && y % 3 === 0) || (y === 0 && x % 3 === 0))
      )
        ctx.drawImage(tiles, 64, 0, 16, 16, x * 16, y * 16, 16, 16);
    }
  const { x, y } = fieldPose(e, tick);
  const facing = e.facing || "south";
  const idle = facing === "south" ? 0 : facing === "north" ? 1 : 2;
  const steps =
    facing === "south" ? [3, 4] : facing === "north" ? [5, 6] : [7, 8];
  const frame = e.walk && tick < 8 ? steps[(e.steps - 1) % 2] : idle;
  ctx.save();
  ctx.translate(x + 8, y + 16);
  if (facing === "east") ctx.scale(-1, 1);
  const sheet = e.surfing ? surf : trainer,
    w = e.surfing ? 32 : 16;
  ctx.drawImage(sheet, frame * w, 0, w, 32, -w / 2, -32, w, 32);
  ctx.restore();
  // O mato original cobre os pés; anima apenas a casa atravessada.
  const foreground = grassUnderFeet(e, { x, y });
  if (!e.surfing && foreground.tiles.length) {
    const elapsed = e.walk ? tick : tick + 16;
    const fx =
      e.steps && elapsed < 50 ? Math.min(4, Math.floor(elapsed / 10)) + 1 : 0;
    const frameIndex = fx === 5 ? 0 : fx;
    ctx.save();
    ctx.beginPath();
    ctx.rect(
      foreground.clip.x,
      foreground.clip.y,
      foreground.clip.width,
      foreground.clip.height,
    );
    ctx.clip();
    for (const tile of foreground.tiles)
      ctx.drawImage(
        grass,
        0,
        frameIndex * 16,
        16,
        16,
        tile.x * 16,
        tile.y * 16,
        16,
        16,
      );
    ctx.restore();
  }
}
