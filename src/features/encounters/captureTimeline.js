// Referência: pret/pokefirered, battle_anim_special.c (sequência ativa).
// Um tick é um quadro de 60 Hz. Nenhuma função de apresentação sorteia resultados.
const sin = (angle, amplitude) =>
  (Math.trunc(Math.sin((angle * Math.PI) / 128) * 256) * amplitude) >> 8;
const cos = (angle, amplitude) => sin(angle + 64, amplitude);
const paletteFlash = (tick) =>
  Math.max(0, Math.min(1, tick <= 16 ? tick / 16 : (34 - tick) / 16));

export function captureTimeline(attempt, monY) {
  const frames = [];
  const base = {
    stage: "throw",
    monScale: 1,
    monY,
    monVisible: true,
    ball: null,
    particles: null,
    stars: null,
  };
  const push = (changes = {}) => frames.push({ ...base, ...changes });
  for (let i = 0; i < 20; i++) push();
  const targetY = monY - 16;
  for (let i = 0; i < 34; i++) {
    const p = i / 34;
    push({
      ball: {
        x: Math.round(55 + (176 - 55) * p),
        y: Math.round(91 + (targetY - 91) * p) + sin(Math.trunc(p * 128), -40),
        frame: 0,
        angle: 0,
      },
    });
  }
  const ball = { x: 176, y: targetY, frame: 2, angle: 0 };
  for (let i = 0; i < 10; i++)
    push({
      stage: "open",
      ball: { ...ball, frame: i < 5 ? 1 : 2 },
      particles: { tick: i, x: 176, y: targetY - 5 },
      tint: i / 16,
      flash: paletteFlash(i),
    });
  for (let i = 0; i < 28; i++)
    push({
      stage: "absorb",
      ball,
      monScale: 256 / (256 + (i + 1) * 32),
      monY: monY - Math.trunc(((monY - targetY) * (i + 1)) / 28),
      tint: Math.min(1, (i + 10) / 16),
      flash: paletteFlash(i + 10),
      particles: { tick: i + 10, x: 176, y: targetY - 5 },
    });
  base.monVisible = false;
  for (let i = 0; i < 10; i++)
    push({ stage: "close", ball: { ...ball, frame: i < 5 ? 1 : 0 } });
  ball.frame = 0;
  ball.y += 40;
  let amplitude = 40,
    angle = 0,
    bounce = 0,
    rising = false;
  while (bounce < 4) {
    push({
      stage: "bounce",
      ball: { ...ball, y: ball.y - cos(angle, amplitude) },
    });
    angle += (rising ? -1 : 1) * (4 + bounce);
    if (!rising && angle >= 64) {
      amplitude -= 10;
      bounce++;
      rising = true;
    } else if (rising && angle <= 0) {
      angle = 0;
      rising = false;
    }
  }
  for (let count = 0; count < attempt.shakes; count++) {
    for (let i = 0; i < 31; i++) push({ stage: "wait", ball: { ...ball } });
    let x = 0,
      subpixel = 0,
      rotation = 0;
    for (const [duration, direction] of [
      [8, 1],
      [1, 0],
      [13, -1],
      [5, 1],
    ]) {
      for (let i = 0; i < duration; i++) {
        if (subpixel > 255) {
          x += direction;
          subpixel &= 255;
        } else subpixel += 176;
        rotation += direction * 3;
        push({
          stage: `shake-${count + 1}`,
          ball: { ...ball, x: ball.x + x, angle: (rotation * Math.PI) / 128 },
        });
      }
      subpixel = 0;
    }
    push({ stage: "wait", ball: { ...ball } });
  }
  const revealAt = frames.length;
  if (attempt.success) {
    for (let i = 0; i < 315; i++)
      push({
        stage: i < 95 ? "wait" : "caught",
        ball: {
          ...ball,
          dark:
            i < 40
              ? 0
              : i < 60
                ? 6 / 16
                : Math.max(0, (6 - Math.floor((i - 60) / 3)) / 16),
          alpha: 1,
        },
        stars:
          i >= 40 && i < 64 ? { tick: i - 40, x: ball.x, y: ball.y } : null,
      });
    for (let i = 0; i < 32; i++)
      push({
        stage: "caught",
        ball: { ...ball, alpha: 1 - Math.floor(i / 2) / 16 },
      });
    push({ stage: "caught" });
  } else {
    for (let i = 0; i < 31; i++) push({ stage: "wait", ball: { ...ball } });
    for (let i = 0; i < 51; i++)
      push({
        stage: "breakout",
        monVisible: true,
        monScale: Math.min(1, (40 + i * 18) / 256),
        monY: monY + (i >= 12 ? 0 : Math.max(0, (4096 - (i + 1) * 288) >> 8)),
        tint: Math.max(0, Math.min(1, (51 - i) / 16)),
        flash: paletteFlash(i),
        ball: i < 10 ? { ...ball, frame: i < 5 ? 1 : 2 } : null,
        particles: { tick: i, x: ball.x, y: ball.y - 5 },
      });
    for (let i = 0; i < 40; i++) push({ stage: "escaped", monVisible: true });
  }
  return { frames, revealAt };
}

export function trainerThrowFrame(tick) {
  return tick < 20
    ? [1, 48]
    : tick < 26
      ? [2, 64]
      : tick < 32
        ? [3, 64]
        : tick < 56
          ? [4, 48]
          : [0, 48];
}

export function drawBallParticles(ctx, image, effect, stars = false) {
  const { tick, x, y } = effect;
  if (stars) {
    if (tick % 2) return;
    for (const [dx, dy, arc] of [
      [10, 2, -3],
      [15, 0, -4],
      [-10, 2, -4],
    ]) {
      const p = tick / 24;
      ctx.drawImage(
        image,
        0,
        24,
        8,
        8,
        Math.round(x + dx * p) - 4,
        Math.round(y + dy * p) + sin(Math.trunc(p * 128), arc) - 4,
        8,
        8,
      );
    }
  } else {
    for (let i = 0; i < 16; i++) {
      const age = tick - i - 1;
      if (age < 0 || age >= 25) continue;
      const frame = [0, 1, 2, 0, 2, 1][age % 6];
      ctx.save();
      ctx.translate(
        x + sin((i % 8) * 32, age * 2),
        y + cos((i % 8) * 32, age * 2),
      );
      if (age % 6 === 3) ctx.scale(-1, 1);
      ctx.drawImage(image, 0, frame * 8, 8, 8, -4, -4, 8, 8);
      ctx.restore();
    }
  }
}
