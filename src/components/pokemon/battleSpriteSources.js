import { Dex } from "@pkmn/sim";
import sprites from "../../game/data/battleSprites.json" with { type: "json" };

export function spriteFileId(name) {
  const species = Dex.species.get(name);
  if (!species?.exists) return name.toLowerCase().replace(/[^a-z0-9-]/g, "");
  const clean = (value = "") => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = clean(species.baseSpecies || species.name),
    forme = clean(species.forme);
  return forme ? `${base}-${forme}` : base;
}

export function battleSpriteSources(name, back, baseUrl, shiny = false) {
  const sprite = sprites[spriteFileId(name)];
  if (!sprite) return [];
  const front = shiny ? sprite.shinyFront : sprite.front;
  const rear = shiny ? sprite.shinyBack : sprite.back;
  return [...new Set([back ? rear : front, front])]
    .filter(Boolean)
    .map((file) => `${baseUrl}battle-sprites/${file}`);
}
