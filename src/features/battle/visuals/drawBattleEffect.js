import { elementGlyph, polygon, ring, star } from "./effectShapes.js";
import { drawOriginalGlyph } from "./effectAssets.js";

const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const mix = (a, b, t) => a + (b - a) * t;
const tau = Math.PI * 2;
// O desenho é puro em relação ao gameplay: os mesmos dados e frame geram
// os mesmos pixels. Não há sorteios, assets externos ou timers aqui.
export function drawBattleEffect(
  ctx,
  effect,
  progress,
  anchors,
  images = new Map(),
) {
  if (!effect || progress < 0 || progress >= 1) return;
  const source = anchors[effect.side],
    target = anchors[effect.targetSide];
  if (!source || !target) return;
  const t = clamp(progress, 0, 1),
    [light, dark] = effect.palette;
  const glyph = (type, x, y, r, phase, palette) => {
    if (!drawOriginalGlyph(ctx, images, type, x, y, r, phase))
      elementGlyph(ctx, type, x, y, r, phase, palette);
  };
  const radius = clamp(target.size * 0.22, 7, 22);
  const envelope = Math.min(1, t * 8, (1 - t) * 7);
  ctx.save();
  ctx.globalAlpha = envelope;
  const outcome = effect.outcome;
  if (outcome === "blocked") {
    const r = Math.max(radius * 1.6, (target.width || target.size) * 0.55);
    const squash = Math.min(1, (target.size * 0.65) / r);
    ring(ctx, target.x, target.y, r, light, squash);
    ring(ctx, target.x, target.y, r * 0.88, dark, squash);
    ctx.restore();
    return;
  }
  if (outcome === "fail" || outcome === "immune") {
    ring(ctx, source.x, source.y, radius * (1 + t), dark, 0.5);
    ctx.restore();
    return;
  }
  const end =
    outcome === "miss"
      ? {
          ...target,
          x: target.x + (source.x < target.x ? 28 : -28),
          y: target.y - target.size * 0.55,
        }
      : target;
  if (effect.shape === "beam" || effect.shape === "projectile") {
    const travel = clamp((t - 0.15) / 0.62, 0, 1);
    const x = mix(source.x, end.x, travel),
      y = mix(source.y, end.y, travel);
    if (effect.shape === "beam") {
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.strokeStyle = i === 1 ? light : dark;
        ctx.lineWidth = i === 1 ? 3 : 2;
        ctx.moveTo(source.x, source.y + (i - 1) * 3);
        ctx.lineTo(x, y + (i - 1) * 3);
        ctx.stroke();
      }
    }
    for (let i = 4; i >= 0; i--) {
      const trail = clamp(travel - i * 0.055, 0, 1);
      ctx.globalAlpha = envelope * (1 - i * 0.14);
      glyph(
        effect.type,
        mix(source.x, end.x, trail),
        mix(source.y, end.y, trail) +
          (effect.shape === "projectile" ? Math.sin(trail * Math.PI) * -12 : 0),
        radius * (1 - i * 0.14),
        t + i * 0.07,
        effect.palette,
      );
    }
  } else if (
    effect.shape === "strike" ||
    effect.shape === "impact" ||
    effect.shape === "arrival"
  ) {
    const hit = effect.shape === "strike" ? clamp((t - 0.25) / 0.75, 0, 1) : t;
    ctx.globalAlpha = envelope * Math.min(1, hit * 6);
    if (effect.shape === "arrival") {
      for (let i = 0; i < 3; i++)
        ring(
          ctx,
          end.x,
          end.y,
          radius * (1.4 + i * 0.5) * (1 - hit * 0.5),
          i % 2 ? dark : light,
          0.7,
        );
    } else {
      if (
        !drawOriginalGlyph(
          ctx,
          images,
          "impact",
          end.x,
          end.y,
          radius * (1.7 - hit * 0.5),
          hit,
        )
      ) {
        star(ctx, end.x, end.y, radius * (1.7 - hit * 0.5), dark);
        star(ctx, end.x, end.y, radius * (1.3 - hit * 0.3), light);
      }
    }
    for (let i = 0; i < 8; i++) {
      const angle = (i * tau) / 8,
        distance = radius * (0.5 + hit * 1.8);
      glyph(
        effect.type || "Normal",
        end.x + Math.cos(angle) * distance,
        end.y + Math.sin(angle) * distance,
        3 + hit * 2,
        t,
        effect.palette,
      );
    }
  } else if (effect.shape === "shield") {
    const r = clamp(source.size * 0.65, 18, 70);
    const horizontal = Math.max(r, (source.width || source.size) * 0.55);
    ctx.globalAlpha = envelope * 0.35;
    polygon(
      ctx,
      [
        [source.x, source.y - r],
        [source.x + horizontal * 0.8, source.y - r * 0.5],
        [source.x + horizontal * 0.7, source.y + r * 0.5],
        [source.x, source.y + r],
        [source.x - horizontal * 0.7, source.y + r * 0.5],
        [source.x - horizontal * 0.8, source.y - r * 0.5],
      ],
      dark,
      light,
    );
    ctx.globalAlpha = envelope;
    ring(ctx, source.x, source.y, horizontal, light, r / horizontal);
    star(ctx, source.x - r * 0.5, source.y - r * 0.6, 5, light);
  } else if (effect.shape === "heal") {
    ring(
      ctx,
      target.x,
      target.y + target.size * 0.35,
      radius * (1 + t),
      dark,
      0.3,
    );
    for (let i = 0; i < 5; i++) {
      const x = target.x + Math.sin(i * 2.4) * radius,
        y = target.y + radius - ((t + i * 0.16) % 1) * radius * 3;
      ctx.fillStyle = light;
      ctx.fillRect(Math.round(x - 1), Math.round(y - 4), 3, 9);
      ctx.fillRect(Math.round(x - 4), Math.round(y - 1), 9, 3);
    }
  } else if (effect.shape === "boost" || effect.shape === "unboost") {
    const direction = effect.shape === "boost" ? -1 : 1;
    for (let i = 0; i < 3; i++) {
      const x = target.x + (i - 1) * radius * 0.9,
        y = target.y + direction * (t * radius * 2 - radius);
      polygon(
        ctx,
        [
          [x - 4, y],
          [x, y + direction * 5],
          [x + 4, y],
          [x + 2, y],
          [x + 2, y - direction * 8],
          [x - 2, y - direction * 8],
          [x - 2, y],
        ],
        light,
        dark,
      );
    }
  } else if (effect.shape === "splash") {
    ring(
      ctx,
      source.x,
      source.y + source.size * 0.45,
      radius * (0.7 + t),
      light,
      0.25,
    );
    for (let i = 0; i < 3; i++)
      glyph(
        "Water",
        source.x + (i - 1) * radius,
        source.y + source.size * 0.35 - Math.sin(t * Math.PI) * radius,
        3,
        t,
        effect.palette,
      );
  } else if (effect.shape === "status" && effect.status === "slp") {
    for (let i = 0; i < 3; i++) {
      const x = target.x + radius * 0.5 + i * 6,
        y = target.y - radius - t * radius - i * 7;
      ctx.strokeStyle = light;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 5, y);
      ctx.lineTo(x, y + 5);
      ctx.lineTo(x + 5, y + 5);
      ctx.stroke();
    }
  } else {
    const anchor = effect.shape === "charge" ? source : target;
    for (let i = 0; i < 6; i++) {
      const angle = (i * tau) / 6 + t * 2,
        distance = radius * (effect.shape === "charge" ? 1.6 - t : 1 + t * 0.5);
      glyph(
        effect.type || (effect.status === "par" ? "Electric" : "Poison"),
        anchor.x + Math.cos(angle) * distance,
        anchor.y + Math.sin(angle) * distance,
        4,
        t,
        effect.palette,
      );
    }
    if (effect.shape === "charge" || effect.shape === "aura")
      ring(ctx, anchor.x, anchor.y, radius * (1 + t * 0.5), light, 0.6);
  }
  ctx.restore();
}
