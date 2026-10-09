import metrics from "./font-metrics.json" with { type: "json" };

export function pixelText(ctx, font, text, x, y, maxWidth = 224) {
  const left = x;
  for (const raw of text) {
    if (raw === "\n") {
      x = left;
      y += 16;
      continue;
    }
    const char =
      metrics.chars[raw] != null
        ? raw
        : raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const id = metrics.chars[char] ?? metrics.chars["?"];
    const width = metrics.widths[id] || 6;
    if (x + width > left + maxWidth) {
      x = left;
      y += 16;
    }
    ctx.drawImage(
      font,
      (id % 16) * 16,
      Math.floor(id / 16) * 16,
      16,
      16,
      Math.round(x),
      y,
      16,
      16,
    );
    x += width;
  }
}
