import geometry from "./spriteGeometry.json" with { type: "json" };
import speciesScale from "./battleSpeciesScale.json" with { type: "json" };
import { spriteFileId } from "./battleSpriteSources.js";

export function spriteGeometryKey(source = "") {
  for (const folder of ["battle-sprites/", "sprites/"]) {
    const at = source.indexOf(`/${folder}`);
    if (at >= 0) return source.slice(at + 1).split(/[?#]/)[0];
  }
  return "";
}

export function battleSpriteLayout({
  name,
  source,
  naturalWidth,
  naturalHeight,
  width,
  height,
  limit = 160,
  back = false,
}) {
  const key = spriteGeometryKey(source);
  const known = geometry[key];
  const matchesImage =
    known &&
    (!naturalWidth ||
      (known.size[0] === naturalWidth && known.size[1] === naturalHeight));
  const measured = matchesImage
    ? known
    : {
        size: [naturalWidth, naturalHeight],
        bounds: [0, 0, naturalWidth, naturalHeight],
      };
  const [imageWidth, imageHeight] = measured.size;
  const [left, top, right, bottom] = measured.bounds;
  if (!(width > 0 && height > 0 && right > left && bottom > top)) return null;
  const style = key.startsWith("sprites/ani") ? "3d" : "2d";
  const profile = speciesScale[spriteFileId(name)]?.[style];
  const ratio = profile?.[back ? "back" : "front"] ?? 0.65;
  const reference = Math.min(limit, height * 0.78, width * 1.25);
  const desiredHeight = Math.max(16, reference * ratio * (back ? 1.12 : 1));
  const lift = reference * (profile?.lift || 0);
  const scale = Math.min(
    desiredHeight / (bottom - top),
    (width * 0.9) / (right - left),
    (height * 0.81 - lift) / (bottom - top),
  );
  return {
    width: imageWidth * scale,
    height: imageHeight * scale,
    left: (width - (right - left) * scale) / 2 - left * scale,
    bottom: height * 0.17 + lift - (imageHeight - bottom) * scale,
    transformOrigin: `${((left + right) / 2) * scale}px ${bottom * scale}px`,
    visibleWidth: (right - left) * scale,
    visibleHeight: (bottom - top) * scale,
    geometryKey: key,
  };
}
