const base =
  "https://www.spriters-resource.com/game_boy_advance/pokemonemerald/asset/";
const cover = (id, name, credit, width, height, crop) => ({
  id: String(id),
  file: `emerald-${id}.png`,
  name,
  credit,
  width,
  height,
  crop,
  game: "Pokémon Emerald",
  sourceUrl: `${base}${id}/`,
  termsUrl: "https://www.spriters-resource.com/page/tou/",
  checked: "2026-09-13",
  use: "Piloto local, não comercial. Gráficos de Game Freak / Nintendo / The Pokémon Company.",
});
export const ROUTE_COVERS = {
  littleroot: cover(
    19776,
    "Littleroot Town",
    "Previous",
    912,
    616,
    [48, 72, 416, 224],
  ),
  forest: cover(
    19778,
    "Petalburg Woods",
    "Andrew the Hedgehog",
    768,
    909,
    [64, 176, 576, 288],
  ),
  mountain: cover(
    18615,
    "Mt. Chimney",
    "Andrew the Hedgehog",
    946,
    752,
    [64, 240, 512, 256],
  ),
  meadow: cover(
    18616,
    "Safari Zone",
    "Andrew the Hedgehog",
    2100,
    1280,
    [256, 240, 640, 320],
  ),
  lake: cover(8358, "Faraway Island", "Kaori", 600, 1210, [112, 16, 368, 184]),
  coast: cover(
    19774,
    "Abandoned Ship",
    "Andrew the Hedgehog",
    1477,
    809,
    [0, 96, 368, 184],
  ),
};
export const coverFor = (place) =>
  ROUTE_COVERS[place?.id] || ROUTE_COVERS[place?.biome];
