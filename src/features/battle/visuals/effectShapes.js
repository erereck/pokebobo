const tau = Math.PI * 2;
export function polygon(ctx, points, fill, stroke) {
  ctx.beginPath();
  points.forEach(([x, y], i) =>
    i
      ? ctx.lineTo(Math.round(x), Math.round(y))
      : ctx.moveTo(Math.round(x), Math.round(y)),
  );
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
export function ring(ctx, x, y, r, color, squash = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(
    Math.round(x),
    Math.round(y),
    Math.max(1, r),
    Math.max(1, r * squash),
    0,
    0,
    tau,
  );
  ctx.stroke();
}
export function star(ctx, x, y, r, color) {
  polygon(
    ctx,
    Array.from({ length: 8 }, (_, i) => {
      const angle = (i * Math.PI) / 4,
        distance = i % 2 ? r * 0.28 : r;
      return [x + Math.sin(angle) * distance, y + Math.cos(angle) * distance];
    }),
    color,
  );
}
export function orb(ctx, x, y, r, palette) {
  ctx.fillStyle = palette[1];
  ctx.beginPath();
  ctx.arc(Math.round(x), Math.round(y), Math.max(1, r), 0, tau);
  ctx.fill();
  ctx.fillStyle = palette[0];
  ctx.fillRect(
    Math.round(x - r * 0.5),
    Math.round(y - r * 0.5),
    Math.max(2, r * 0.5),
    Math.max(2, r * 0.5),
  );
}
export function elementGlyph(ctx, type, x, y, r, phase, palette) {
  const [light, dark] = palette;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  if (type === "Fire" || type === "Dragon") {
    polygon(
      ctx,
      [
        [-r, r * 0.5],
        [-r * 0.5, -r * 0.4],
        [0, -r * 1.5],
        [r * 0.3, -r * 0.4],
        [r, -r * 0.2],
        [r * 0.7, r * 0.6],
        [0, r],
      ],
      dark,
    );
    polygon(
      ctx,
      [
        [-r * 0.4, r * 0.5],
        [0, -r * 0.6],
        [r * 0.4, r * 0.5],
      ],
      light,
    );
  } else if (type === "Water") {
    orb(ctx, 0, 0, r, palette);
    ring(ctx, 0, 0, r + 2, light);
  } else if (type === "Grass" || type === "Bug") {
    ctx.rotate(phase * tau);
    polygon(
      ctx,
      [
        [-r, 0],
        [0, -r * 0.5],
        [r, 0],
        [0, r * 0.5],
      ],
      dark,
      light,
    );
    ctx.fillStyle = light;
    ctx.fillRect(-r * 0.6, -1, r * 1.2, 2);
  } else if (type === "Electric") {
    polygon(
      ctx,
      [
        [r * 0.4, -r * 1.4],
        [-r * 0.8, 0],
        [-r * 0.1, 0],
        [-r * 0.4, r * 1.4],
        [r * 0.8, -r * 0.1],
        [r * 0.1, -r * 0.1],
      ],
      light,
      dark,
    );
  } else if (type === "Ice" || type === "Steel") {
    ctx.rotate(phase * Math.PI);
    polygon(
      ctx,
      [
        [0, -r],
        [r * 0.65, 0],
        [0, r],
        [-r * 0.65, 0],
      ],
      light,
      dark,
    );
    ctx.fillStyle = dark;
    ctx.fillRect(-1, -r * 0.7, 2, r * 1.4);
    if (type === "Ice") ctx.fillRect(-r * 0.7, -1, r * 1.4, 2);
  } else if (type === "Rock" || type === "Ground") {
    ctx.rotate(phase * Math.PI);
    polygon(
      ctx,
      [
        [-r, -r * 0.4],
        [-r * 0.4, -r],
        [r * 0.5, -r * 0.8],
        [r, r * 0.2],
        [r * 0.4, r],
        [-r * 0.7, r * 0.6],
      ],
      dark,
      light,
    );
    polygon(
      ctx,
      [
        [-r * 0.5, -r * 0.2],
        [0, -r * 0.7],
        [r * 0.4, -r * 0.4],
      ],
      light,
    );
  } else if (type === "Psychic") {
    ring(ctx, 0, 0, r, light, 0.55);
    ring(ctx, 0, 0, r * 0.65, dark);
    star(ctx, 0, 0, r * 0.5, light);
  } else if (type === "Flying") {
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.strokeStyle = i ? dark : light;
      ctx.lineWidth = 2;
      ctx.moveTo(-r, i * 5);
      ctx.quadraticCurveTo(0, i * 5 - r * 0.7, r, i * 5);
      ctx.stroke();
    }
  } else if (type === "Poison" || type === "Ghost") {
    orb(ctx, 0, Math.sin(phase * tau) * 2, r, palette);
    if (type === "Ghost") {
      ctx.fillStyle = light;
      ctx.fillRect(-r * 0.4, -2, 2, 3);
      ctx.fillRect(r * 0.2, -2, 2, 3);
    } else ring(ctx, r * 0.5, -r * 0.7, r * 0.3, light);
  } else if (type === "Dark") {
    polygon(
      ctx,
      [
        [0, -r],
        [r * 0.6, -r * 0.6],
        [r, 0],
        [r * 0.6, r * 0.7],
        [0, r],
        [-r * 0.4, r * 0.5],
        [r * 0.2, r * 0.4],
        [r * 0.4, 0],
        [0, -r * 0.4],
      ],
      dark,
      light,
    );
  } else if (type === "Fighting") {
    ctx.fillStyle = dark;
    ctx.fillRect(-r * 0.7, -r * 0.4, r * 1.4, r * 1.2);
    ctx.fillStyle = light;
    for (let i = 0; i < 4; i++)
      ctx.fillRect(-r * 0.7 + i * r * 0.35, -r * 0.6, r * 0.25, r * 0.5);
  } else star(ctx, 0, 0, r, light);
  ctx.restore();
}
