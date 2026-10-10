import { terrainAt } from "../../game/world/exploration.js";

// Cada quarto usa uma borda original de FRLG. Isso permite trilhas de uma
// casa, cruzamentos e cantos internos sem alterar a colisão do mapa.
export function terrainQuadrants(x, y) {
  const terrain = terrainAt(x, y);
  if (terrain === "grass") return null;
  const same = (dx, dy) => terrainAt(x + dx, y + dy) === terrain;
  const offset = terrain === "path" ? 6 : 19;
  return [
    [-1, -1, 0, 1, 3, 9],
    [1, -1, 2, 1, 5, 10],
    [-1, 1, 6, 7, 3, 11],
    [1, 1, 8, 7, 5, 12],
  ].map(([dx, dy, corner, horizontal, vertical, inner], quadrant) => ({
    frame:
      offset +
      (!same(0, dy)
        ? !same(dx, 0)
          ? corner
          : horizontal
        : !same(dx, 0)
          ? vertical
          : !same(dx, dy)
            ? inner
            : 4),
    x: (quadrant % 2) * 8,
    y: Math.floor(quadrant / 2) * 8,
  }));
}
