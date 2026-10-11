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
  const profiles = speciesScale[spriteFileId(name)];
  const profile = profiles?.[style];
  const side = back ? "back" : "front";
  // A arte 3D pode ter um corpo nativo bem menor que o desenho 2D da mesma
  // espécie. Isso não deve diminuir de novo o Pokémon na arena.
  const ratio = Math.max(
    profile?.[side] ?? 0.65,
    profiles?.["2d"]?.[side] ?? 0,
  );
  // Referência proporcional à cena, inclusive em tela cheia, sem teto em px.
  const reference = Math.min(height * 0.9, width * 0.95);
  const desiredHeight = Math.max(16, reference * ratio * (back ? 1.12 : 1));
  const lift = reference * (profile?.lift || 0);
  const normalKey = key.replace("-shiny/", "/");
  const shinyKey = normalKey.replace(
    /\/(front|back|ani|ani-back)\//,
    "/$1-shiny/",
  );
  // As duas paletas compartilham o limite de largura: uma pequena diferença
  // entre os ciclos publicados não deve mudar a altura ao alternar shiny.
  const aspect = Math.max(
    (right - left) / (bottom - top),
    ...[normalKey, shinyKey].map((variant) => {
      const bounds = matchesImage && geometry[variant]?.bounds;
      return bounds ? (bounds[2] - bounds[0]) / (bounds[3] - bounds[1]) : 0;
    }),
  );
  const scale = Math.min(
    desiredHeight / (bottom - top),
    (width * 0.9) / aspect / (bottom - top),
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
