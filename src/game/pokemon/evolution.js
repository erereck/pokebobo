import { PROGRESSION } from "../config/progression.js";
import catalog from "../catalog.json" with { type: "json" };
import { movesFor } from "./moves.js";

export function grow(mon, amount) {
  const next = {
    ...mon,
    level: Math.min(PROGRESSION.maxLevel, mon.level + amount),
  };
  let evolved = true;
  while (evolved) {
    evolved = false;
    for (const name of catalog[next.name].evos) {
      const e = catalog[name];
      if (e?.evoLevel && e.evoLevel <= next.level && !e.evoType) {
        next.name = name;
        evolved = true;
        break;
      }
    }
  }
  next.moves = movesFor(next.name, next.level);
  return next;
}
