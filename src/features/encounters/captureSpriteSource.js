import catalog from "../../game/catalog.json" with { type: "json" };
import species from "./frlg-species.json" with { type: "json" };
import { spriteSources } from "../../components/pokemon/spriteSources.js";

export function captureSpriteSource(name, shiny, baseUrl) {
  const num = catalog[name]?.num;
  if (species[name])
    return `${baseUrl}sprites/${shiny ? "frlg-shiny" : "frlg"}/${num}.png`;
  return spriteSources(name, { num, baseUrl, shiny })[0];
}
