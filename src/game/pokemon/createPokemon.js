import { movesFor } from "./moves.js";

export function makeMon(name, level, id, shiny = false) {
  return {
    id,
    shiny: shiny === true,
    name,
    level,
    item: "",
    moves: movesFor(name, level),
  };
}
