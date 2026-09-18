import { PROGRESSION } from "../config/progression.js";
import {
  DEFAULT_SPECIAL_EVOLUTION_LEVEL,
  SPECIAL_EVOLUTION_LEVELS,
} from "../config/specialEvolutions.js";
import catalog from "../catalog.json" with { type: "json" };
import { movesFor } from "./moves.js";

function stableHash(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function evolutionLevel(target) {
  if (!target) return Number.POSITIVE_INFINITY;
  if (target.evoLevel) return target.evoLevel;
  if (target.evoType)
    return (
      SPECIAL_EVOLUTION_LEVELS[target.evoType] ??
      DEFAULT_SPECIAL_EVOLUTION_LEVEL
    );
  return Number.POSITIVE_INFINITY;
}

function nextEvolution(mon) {
  const current = catalog[mon.name];
  const candidates = (current?.evos || [])
    .map((name) => catalog[name])
    .filter(Boolean);

  if (!candidates.length) return null;

  if (candidates.length === 1) {
    const target = candidates[0];
    return mon.level >= evolutionLevel(target) ? target : null;
  }

  // Branches no longer depend on item, friendship, gender, time or trade.
  // Every branch opens at one common level and the individual Pokémon id
  // deterministically decides which path that specimen takes.
  const branchLevel = Math.max(...candidates.map(evolutionLevel));
  if (mon.level < branchLevel) return null;
  const index = stableHash(`${mon.id || mon.name}:${mon.name}`) % candidates.length;
  return candidates[index];
}

export function grow(mon, amount) {
  const next = {
    ...mon,
    level: Math.min(PROGRESSION.maxLevel, mon.level + amount),
  };

  let evolved = true;
  while (evolved) {
    evolved = false;
    const target = nextEvolution(next);
    if (target) {
      next.name = target.name;
      evolved = true;
    }
  }

  next.moves = movesFor(next.name, next.level);
  return next;
}
