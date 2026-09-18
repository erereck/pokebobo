import { PROGRESSION } from "../config/progression.js";
import catalog from "../catalog.json" with { type: "json" };
import { movesFor } from "./moves.js";

const SPECIAL_EVOLUTION_LEVELS = Object.freeze({
  levelFriendship: 24,
  levelMove: 28,
  levelHold: 30,
  useItem: 32,
  trade: 36,
  levelExtra: 36,
  other: 32,
});

export function requiredEvolutionLevel(species) {
  if (!species) return null;
  if (species.evoLevel) return species.evoLevel;
  if (!species.evoType) return null;
  return SPECIAL_EVOLUTION_LEVELS[species.evoType] || 32;
}

function branchIndex(mon, sourceName, count) {
  if (count <= 1) return 0;
  const text = `${mon.id || "mon"}:${sourceName}`;
  let hash = 2166136261;
  for (const char of text) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % count;
}

function nextEvolution(mon) {
  const source = catalog[mon.name];
  if (!source?.evos?.length) return null;

  const choices = source.evos.filter((name) => catalog[name]);
  if (!choices.length) return null;

  // Linhas ramificadas continuam automáticas: cada Pokémon recebe um caminho
  // determinístico pelo próprio id, sem pedra, troca, amizade ou menu extra.
  const targetName = choices[branchIndex(mon, mon.name, choices.length)];
  const target = catalog[targetName];
  const level = requiredEvolutionLevel(target);
  return level && level <= mon.level ? targetName : null;
}

export function grow(mon, amount) {
  const next = {
    ...mon,
    level: Math.min(PROGRESSION.maxLevel, mon.level + amount),
  };
  let evolution = nextEvolution(next);
  while (evolution) {
    next.name = evolution;
    evolution = nextEvolution(next);
  }
  next.moves = movesFor(next.name, next.level);
  return next;
}
