import { Dex } from "@pkmn/sim";
import { MOVE_RULES } from "../../src/game/config/moves.js";
export const moveDex = Dex.mod("gen8");

function sourceData(species) {
  const data = moveDex.species.getLearnsetData(species.id).learnset;
  if (data) return { species: species.name, learnset: data };
  if (species.changesFrom) {
    const parent = moveDex.species.get(species.changesFrom);
    const shared = moveDex.species.getLearnsetData(parent.id).learnset;
    if (shared) return { species: parent.name, learnset: shared };
  }
  return { species: species.name, learnset: {} };
}
export function lineageFor(name) {
  const chain = [];
  let species = moveDex.species.get(name);
  while (species.exists) {
    chain.unshift({ species, data: sourceData(species) });
    if (!species.prevo) break;
    species = moveDex.species.get(species.prevo);
  }
  return chain;
}
export function learnsetFor(name) {
  const chain = lineageFor(name);
  const generation = MOVE_RULES.generations.find((gen) =>
    chain.every((stage) =>
      Object.values(stage.data.learnset).some((sources) =>
        sources.some((s) => new RegExp("^" + gen + "L\\d+$").test(s)),
      ),
    ),
  );
  if (!generation) return null;
  const moves = new Map(),
    excluded = [];
  let stageFloor = 1;
  for (const { species, data } of chain) {
    stageFloor = Math.max(stageFloor, species.evoLevel || 1);
    const inherited = new Map(moves);
    for (const [id, sources] of Object.entries(data.learnset)) {
      const move = moveDex.moves.get(id);
      if (!move.exists || move.gen > 8) continue;
      for (const code of sources.filter((s) =>
        new RegExp("^" + generation + "L\\d+$").test(s),
      )) {
        const rawLevel = Number(code.slice(2));
        if (rawLevel === 1 && species.prevo) {
          excluded.push({
            id,
            species: species.name,
            sourceSpecies: data.species,
            code,
            reason: inherited.has(id)
              ? "reminder-keeps-ancestor-level"
              : "reminder-only",
            deferredTo: inherited.get(id)?.level ?? null,
          });
          continue;
        }
        const level = Math.max(1, rawLevel, stageFloor);
        const candidate = {
          id,
          name: move.name,
          type: move.type,
          power: move.basePower,
          category: move.category,
          accuracy: move.accuracy,
          pp: move.pp,
          level,
          source: {
            species: data.species,
            generation,
            code,
            stage: species.name,
            stageFloor,
            method: rawLevel === 0 ? "evolution" : "level-up",
          },
        };
        if (!moves.has(id) || level < moves.get(id).level)
          moves.set(id, candidate);
      }
    }
  }
  return {
    reference: {
      policy: MOVE_RULES.id,
      generation,
      lineage: chain.map((s) => s.species.name),
      sourceSpecies: chain.map((s) => s.data.species),
    },
    moves: [...moves.values()].sort(
      (a, b) => a.level - b.level || a.id.localeCompare(b.id),
    ),
    excluded,
  };
}
