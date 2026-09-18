import { PROGRESSION } from "../config/progression.js";
import catalog from "../catalog.json" with { type: "json" };
import { movesFor } from "./moves.js";

export const SPECIAL_EVOLUTION_LEVELS = Object.freeze({
  levelFriendship: 22,
  levelMove: 28,
  useItem: 30,
  levelHold: 30,
  levelExtra: 32,
  trade: 36,
  other: 36,
});

export function evolutionLevel(name) {
  const evo = catalog[name];
  if (!evo) return null;
  if (evo.evoLevel) return evo.evoLevel;
  return SPECIAL_EVOLUTION_LEVELS[evo.evoType] || (evo.prevo ? 36 : null);
}

function availableEvolution(name, level) {
  for (const evoName of catalog[name]?.evos || []) {
    const requiredLevel = evolutionLevel(evoName);
    if (requiredLevel && requiredLevel <= level) return evoName;
  }
  return null;
}

export function grow(mon, amount) {
  const next = {
    ...mon,
    level: Math.min(PROGRESSION.maxLevel, mon.level + amount),
    moves: Array.isArray(mon.moves) ? [...mon.moves] : [],
  };
  let evoName = availableEvolution(next.name, next.level);
  while (evoName) {
    next.name = evoName;
    evoName = availableEvolution(next.name, next.level);
  }
  if (!next.moves.length) next.moves = movesFor(next.name, next.level);
  return next;
}
