export function effectAnchor(
  box,
  arena,
  visibleHeight,
  visibleBottom,
  scale = 1,
  visibleWidth,
) {
  const size = Math.max(8, Number(visibleHeight) || box.height * 0.4);
  const bottom = Number(visibleBottom) || box.height * 0.17;
  return {
    x: (box.left - arena.left + box.width / 2) * scale,
    y: (box.bottom - arena.top - bottom - size * 0.5) * scale,
    size: size * scale,
    width: (Number(visibleWidth) || size) * scale,
  };
}
