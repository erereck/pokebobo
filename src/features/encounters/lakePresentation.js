import { lakeDirection } from "../../game/world/exploration.js";

export const LAKE_DURATION = { fish: 64, surf: 28 };

export function fishingPose(direction, tick) {
  const offset = direction === "south" ? 8 : direction === "north" ? 4 : 0;
  const step =
    tick < 16
      ? Math.floor(tick / 4)
      : tick < 40
        ? 3
        : 2 + (Math.floor((tick - 40) / 6) % 2);
  const frame = offset + step;
  return {
    frame,
    flip: direction === "east",
    offsetX: frame >= 1 && frame <= 3 ? (direction === "east" ? 8 : -8) : 0,
    offsetY: frame === 5 ? -8 : frame === 10 || frame === 11 ? 8 : 0,
    bite: tick >= 40,
  };
}

export function drawLakeTrainer(
  ctx,
  [trainer, surf, fishing],
  e,
  method,
  tick,
) {
  const direction = lakeDirection(e)?.direction || e.facing || "south";
  const x = e.x * 16 + 8,
    y = e.y * 16 + 16;
  ctx.save();
  ctx.translate(x, y);
  if (method === "fish" && fishing) {
    const pose = fishingPose(direction, tick);
    ctx.translate(pose.offsetX, pose.offsetY);
    if (pose.flip) ctx.scale(-1, 1);
    ctx.drawImage(fishing, pose.frame * 32, 0, 32, 32, -16, -32, 32, 32);
  } else {
    const frame = direction === "south" ? 0 : direction === "north" ? 1 : 2;
    if (direction === "east") ctx.scale(-1, 1);
    const onSurf = method === "surf" && tick >= 8;
    const width = onSurf ? 32 : 16;
    ctx.drawImage(
      onSurf ? surf : trainer,
      frame * width,
      0,
      width,
      32,
      -width / 2,
      -32,
      width,
      32,
    );
  }
  ctx.restore();
  if (method === "fish" && tick >= 40) {
    // ! usa a mesma grade de pixels; evita texto HTML flutuando sobre a cena.
    ctx.fillStyle = "#fff8db";
    const top = Math.max(1, y - 43);
    ctx.fillRect(x - 4, top, 8, 11);
    ctx.fillStyle = "#303828";
    ctx.fillRect(x - 1, top + 2, 2, 5);
    ctx.fillRect(x - 1, top + 9, 2, 1);
  }
}
