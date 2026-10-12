import { Dex } from "@pkmn/sim";
import { battleSpriteSources, spriteFileId } from "./battleSpriteSources.js";
import forms from "./staticFormSprites.json" with { type: "json" };

export function spriteSources(name, {
  num, baseUrl, back = false, animated = false, battleStyle, shiny = false,
  embeddedFront, embeddedBack,
}) {
  const id = spriteFileId(name);
  const isForm = Boolean(Dex.species.get(name).forme);
  const local = shiny
    ? `${baseUrl}sprites/shiny/${id}.png`
    : isForm
      ? forms[id] ? `${baseUrl}sprites/${forms[id]}` : battleSpriteSources(name, false, baseUrl)[0]
      : embeddedFront?.[num] || `${baseUrl}sprites/${num}.png`;
  const animatedSprite = (rear) =>
    `https://play.pokemonshowdown.com/sprites/${rear ? "ani-back" : "ani"}${shiny ? "-shiny" : ""}/${id}.gif`;
  let sources;
  if (battleStyle === "2d")
    sources = [...battleSpriteSources(name, back, baseUrl, shiny), local];
  else if (back)
    sources = [
      !isForm && !shiny && embeddedBack?.[num],
      animatedSprite(true),
      ...battleSpriteSources(name, true, baseUrl, shiny),
      !isForm && !shiny && `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${num}.png`,
      local,
    ];
  else if (animated)
    sources = [animatedSprite(false), ...battleSpriteSources(name, false, baseUrl, shiny), local];
  else sources = [local];
  return [...new Set(sources.filter(Boolean))];
}
