import { isTallGrass } from "../../game/world/exploration.js";

export function fieldPose(e, tick) {
  const p = e.walk ? Math.min(16, tick) : 16;
  return {
    x: e.walk ? e.walk.fromX * 16 + (e.x - e.walk.fromX) * p : e.x * 16,
    y: e.walk ? e.walk.fromY * 16 + (e.y - e.walk.fromY) * p : e.y * 16,
  };
}

export function grassUnderFeet(e, pose) {
  const clip = { x: pose.x + 2, y: pose.y + 7, width: 12, height: 9 };
  const tiles = [];
  for (
    let y = Math.floor(clip.y / 16);
    y <= Math.floor((clip.y + clip.height - 1) / 16);
    y++
  )
    for (
      let x = Math.floor(clip.x / 16);
      x <= Math.floor((clip.x + clip.width - 1) / 16);
      x++
    )
      if (isTallGrass(e, x, y)) tiles.push({ x, y });
  return { clip, tiles };
}
