import { SHINY_RULES } from "../config/shiny.js";
import { random } from "../random/random.js";

export function shinyFromRoll(roll) {
  return roll < 1 / SHINY_RULES.denominator;
}

// Um fluxo independente preserva os encontros, capturas e batalhas da seed.
// Cada Pokémon novo recebe a marca uma vez; saves antigos continuam normais.
export function rollShiny(run) {
  const stream = { rng: run.shinyRng ?? ((run.seed ^ 0x9e3779b9) >>> 0 || 1) };
  const shiny = shinyFromRoll(random(stream));
  run.shinyRng = stream.rng;
  return shiny;
}
