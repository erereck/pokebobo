export const CARD_COLORS = Object.freeze({
  ruby: "#c62f45",
  seam: "#701d30",
  rubber: "#1b2931",
  lcd: "#edf0dc",
  bright: "#f9fbe9",
  dim: "#dce2c8",
  line: "#bcc7ad",
  ink: "#21362f",
  soft: "#435a50",
  amber: "#f0cd6b",
  lens: "#70e4ed",
  hp: "#428653",
  white: "#fff7e9",
});

export function panel(ctx, x, y, w, h, color, radius = 16, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = color;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export function text(
  ctx,
  value,
  x,
  y,
  size = 24,
  color = CARD_COLORS.ink,
  weight = 500,
  family = "DM Sans",
  width,
) {
  ctx.fillStyle = color;
  ctx.font = weight + " " + size + 'px "' + family + '"';
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  if (width) {
    while (ctx.measureText(value).width > width && size > 16) {
      size--;
      ctx.font = weight + " " + size + 'px "' + family + '"';
    }
    if (ctx.measureText(value).width > width) {
      while (value.length && ctx.measureText(value + "…").width > width)
        value = value.slice(0, -1);
      value += "…";
    }
  }
  ctx.fillText(value, x, y);
}

export function star(ctx, x, y, radius = 12) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * i) / 4 - Math.PI / 2;
    const distance = i % 2 ? radius * 0.34 : radius;
    const px = x + Math.cos(angle) * distance,
      py = y + Math.sin(angle) * distance;
    if (i) ctx.lineTo(px, py);
    else ctx.moveTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = CARD_COLORS.amber;
  ctx.fill();
  ctx.strokeStyle = "#856719";
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function visibleSprite(image) {
  const temp = document.createElement("canvas");
  temp.width = image.naturalWidth;
  temp.height = image.naturalHeight;
  const ctx = temp.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, temp.width, temp.height).data;
  let left = temp.width,
    right = -1,
    top = temp.height,
    bottom = -1;
  for (let y = 0; y < temp.height; y++)
    for (let x = 0; x < temp.width; x++) {
      if (pixels[(y * temp.width + x) * 4 + 3] < 16) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  if (right < left)
    throw Error("Um sprite ficou vazio. Tente preparar o cartão novamente.");
  return {
    image: temp,
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

export function drawSprite(ctx, sprite, centerX, bottom, maxWidth, maxHeight) {
  const scale = Math.min(maxWidth / sprite.width, maxHeight / sprite.height);
  const width = Math.round(sprite.width * scale),
    height = Math.round(sprite.height * scale);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    sprite.image,
    sprite.left,
    sprite.top,
    sprite.width,
    sprite.height,
    Math.round(centerX - width / 2),
    Math.round(bottom - height),
    width,
    height,
  );
}
