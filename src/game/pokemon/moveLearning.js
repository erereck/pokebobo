import catalog from "../catalog.json" with { type: "json" };
import { grow } from "./evolution.js";

function candidates(before, after) {
  const data = catalog[after.name];
  if (!data) return [];
  const known = new Set(before.moves || []);
  const crossed = data.moves.filter(
    (move) => move.level > before.level && move.level <= after.level,
  );
  const evolutionMoves =
    before.name !== after.name
      ? data.moves.filter((move) => move.level <= 1)
      : [];
  const seen = new Set();
  return [...crossed, ...evolutionMoves]
    .filter((move) => !known.has(move.id) && !seen.has(move.id))
    .filter((move) => {
      seen.add(move.id);
      return true;
    })
    .sort((a, b) => a.level - b.level || a.id.localeCompare(b.id));
}

export function ensureMoveLearningState(r) {
  if (!Array.isArray(r.pendingMoveChoices)) r.pendingMoveChoices = [];
  if (!("pendingBattleKind" in r)) r.pendingBattleKind = null;
}

export function growWithLearning(r, mon, amount) {
  ensureMoveLearningState(r);
  const before = { ...mon, moves: [...(mon.moves || [])] };
  const after = grow(mon, amount);
  if (after.level <= before.level) return after;
  if (!Array.isArray(after.moves)) after.moves = [];

  const queued = new Set(
    r.pendingMoveChoices.map((choice) => `${choice.monId}:${choice.moveId}`),
  );

  for (const move of candidates(before, after)) {
    if (after.moves.includes(move.id)) continue;

    // Enquanto houver espaço, aprender golpe é automático e não interrompe a run.
    if (after.moves.length < 4) {
      after.moves.push(move.id);
      continue;
    }

    // Só existe decisão quando o moveset já está completo.
    const key = `${after.id}:${move.id}`;
    if (queued.has(key)) continue;
    r.pendingMoveChoices.push({
      monId: after.id,
      species: after.name,
      moveId: move.id,
      level: Math.max(move.level, after.level),
    });
    queued.add(key);
  }
  return after;
}

export function currentMoveChoice(r) {
  ensureMoveLearningState(r);
  return r.pendingMoveChoices[0] || null;
}
