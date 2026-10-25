import { expeditionFloor } from "../../game/expeditions/expeditions.js";
import { EXPEDITION_RULES as RULES } from "../../game/config/expeditions.js";
import { fieldPose } from "../encounters/fieldPresentation.js";

// Cenografia autoral em pixels, desenhada no mesmo visor do campo. O único
// bitmap reutilizado é Red, já local e creditado no manifesto de FRLG.
export function drawPassage(ctx, x, y, ruins = false) {
  ctx.fillStyle = ruins ? "#87978b" : "#6c6982";
  ctx.fillRect(x + 1, y, 14, 16);
  ctx.fillStyle = "#222736";
  ctx.fillRect(x + 4, y + 3, 8, 13);
  ctx.fillStyle = "#bcb9a1";
  ctx.fillRect(x + 3, y, 10, 3);
  ctx.fillStyle = "#e3c66c";
  ctx.fillRect(x + 7, y + 7, 2, 5);
  ctx.fillRect(x + 5, y + 9, 6, 2);
}

export function drawExpedition(ctx, [trainer], e, site, tick) {
  const cave = site.theme === "cave";
  const p = cave
    ? {
        void: "#242639",
        wall: "#57576f",
        cap: "#77758b",
        floor: "#aaa39e",
        seam: "#938e91",
        glow: "#73ced2",
      }
    : {
        void: "#243d3d",
        wall: "#57756b",
        cap: "#90a18c",
        floor: "#c5c5a3",
        seam: "#afb493",
        glow: "#e7d078",
      };
  ctx.fillStyle = p.void;
  ctx.fillRect(0, 0, 192, 144);
  ctx.save();
  ctx.translate(0, 16);
  for (let y = 0; y < RULES.height; y++)
    for (let x = 0; x < RULES.width; x++) {
      const px = x * 16,
        py = y * 16;
      if (expeditionFloor(e.room, x, y)) {
        ctx.fillStyle = p.floor;
        ctx.fillRect(px, py, 16, 16);
        ctx.fillStyle = p.seam;
        if (cave) {
          ctx.fillRect(px + ((x * 3 + y * 5) % 12), py + 10, 3, 1);
          ctx.fillRect(px + 10, py + 3, 1, 2);
        } else {
          ctx.fillRect(px, py + 15, 16, 1);
          ctx.fillRect(px + (y % 2) * 8, py, 1, 16);
        }
        if (!expeditionFloor(e.room, x, y - 1)) {
          ctx.fillStyle = cave ? "#8d8790" : "#a0ac8d";
          ctx.fillRect(px, py, 16, 3);
        }
      } else {
        ctx.fillStyle = p.wall;
        ctx.fillRect(px + 1, py + 2, 14, 14);
        ctx.fillStyle = p.cap;
        ctx.fillRect(px + 1, py + 1, 14, 5);
        ctx.fillStyle = p.void;
        if (cave) {
          ctx.fillRect(px, py, 3, 3);
          ctx.fillRect(px + 12, py + 12, 4, 4);
          ctx.fillRect(px + 6, py + 10, 5, 1);
          ctx.fillStyle = p.wall;
          ctx.fillRect(px + 2, py + 2, 3, 2);
        } else ctx.fillRect(px + 6, py + 9, 1, 7);
      }
    }
  // Cristais / inscrições nas paredes: posições fixas, nunca RNG de gameplay.
  for (const [x, y] of [
    [1, 0],
    [10, 0],
    [0, 4],
    [11, 5],
  ]) {
    ctx.fillStyle = p.glow;
    ctx.fillRect(x * 16 + 6, y * 16 + 4, 3, 8);
    ctx.fillRect(x * 16 + 4, y * 16 + 7, 7, 3);
    ctx.fillStyle = "#f4efd5";
    ctx.fillRect(x * 16 + 6, y * 16 + 4, 1, 3);
  }
  if (e.room < 2) {
    const { x, y } = RULES.cache,
      open = e.collected.includes(e.room);
    ctx.fillStyle = "#665443";
    ctx.fillRect(x * 16 + 1, y * 16 + 7, 14, 8);
    ctx.fillStyle = "#d2a65e";
    ctx.fillRect(x * 16 + 2, y * 16 + (open ? 1 : 4), 12, open ? 5 : 8);
    ctx.fillStyle = "#f4d985";
    ctx.fillRect(x * 16 + 7, y * 16 + 7, 2, 6);
    if (open) {
      ctx.fillStyle = "#3a343e";
      ctx.fillRect(x * 16 + 3, y * 16 + 7, 10, 3);
    }
    if (e.room === 1) {
      // As duas bolsas da decisão ficam juntas no mesmo ponto de interação.
      for (const [offset, color] of [
        [2, "#b7554c"],
        [9, "#667f64"],
      ]) {
        ctx.fillStyle = color;
        ctx.fillRect(x * 16 + offset, y * 16 + 5, 5, 8);
        ctx.fillStyle = "#e0cf9b";
        ctx.fillRect(x * 16 + offset + 1, y * 16 + 4, 3, 2);
      }
    }
    drawPassage(ctx, RULES.gate.x * 16, RULES.gate.y * 16, !cave);
  } else {
    // Sentinela original com manto e lampião; o elenco é mostrado antes da luta.
    const x = RULES.guardian.x * 16,
      y = RULES.guardian.y * 16 - 12;
    ctx.fillStyle = "#35405b";
    ctx.fillRect(x + 3, y + 2, 10, 26);
    ctx.fillStyle = p.glow;
    ctx.fillRect(x + 5, y + 6, 6, 3);
    ctx.fillStyle = "#dfbe88";
    ctx.fillRect(x + 6, y + 3, 4, 3);
    ctx.fillStyle = "#212d40";
    ctx.fillRect(x + 2, y + 25, 12, 3);
    ctx.fillStyle = "#f0d37c";
    ctx.fillRect(x + 14, y + 8, 2, 4);
  }
  const { x, y } = fieldPose(e, tick),
    facing = e.facing || "north";
  const idle = facing === "south" ? 0 : facing === "north" ? 1 : 2;
  const steps =
    facing === "south" ? [3, 4] : facing === "north" ? [5, 6] : [7, 8];
  const frame = e.walk && tick < 8 ? steps[(e.steps - 1) % 2] : idle;
  ctx.save();
  ctx.translate(x + 8, y + 16);
  if (facing === "east") ctx.scale(-1, 1);
  ctx.drawImage(trainer, frame * 16, 0, 16, 32, -8, -32, 16, 32);
  ctx.restore();
  ctx.restore();
}
