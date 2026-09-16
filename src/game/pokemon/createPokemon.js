import { movesFor } from "./moves.js";

export function makeMon(name, level, id) {
  return {
    id,
    name,
    level,
    item: "",
    moves: movesFor(name, level),
  };
}
