import metrics from "./font-metrics.json" with { type: "json" };

const glyph = (raw) => {
  const char =
    metrics.chars[raw] != null
      ? raw
      : raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const id = metrics.chars[char] ?? metrics.chars["?"];
  return { id, width: metrics.widths[id] || 6 };
};
export const textWidth = (text) =>
  Array.from(text).reduce((width, char) => width + glyph(char).width, 0);

// Quebra entre palavras; a última linha nunca invade o painel seguinte.
export function pixelLines(text, maxWidth, maxLines = 2) {
  const lines = [""];
  for (const token of text.split(/(\n|[ \t]+)/)) {
    if (!token) continue;
    if (token === "\n") {
      lines.push("");
      continue;
    }
    const index = lines.length - 1;
    if (/^[ \t]+$/.test(token)) {
      if (lines[index]) lines[index] += " ";
      continue;
    }
    if (lines[index].trim() && textWidth(lines[index] + token) > maxWidth)
      lines.push("");
    for (const char of token) {
      const i = lines.length - 1;
      if (textWidth(lines[i] + char) > maxWidth && lines[i]) lines.push("");
      lines[lines.length - 1] += char;
    }
  }
  const result = lines.slice(0, maxLines).map((line) => line.trim());
  if (lines.length > maxLines) {
    let last = result.at(-1);
    while (last && textWidth(last + "...") > maxWidth) last = last.slice(0, -1);
    result[result.length - 1] = last + "...";
  }
  return result;
}
export function pixelText(ctx, font, text, x, y, maxWidth = 224, maxLines = 2) {
  for (const [row, line] of pixelLines(text, maxWidth, maxLines).entries()) {
    let cursor = x;
    for (const char of line) {
      const { id, width } = glyph(char);
      ctx.drawImage(
        font,
        (id % 16) * 16,
        Math.floor(id / 16) * 16,
        16,
        16,
        Math.round(cursor),
        y + row * 16,
        16,
        16,
      );
      cursor += width;
    }
  }
}
