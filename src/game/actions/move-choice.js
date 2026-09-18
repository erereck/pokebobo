import catalog from "../catalog.json" with { type: "json" };
import { beginBattle } from "../battle/beginBattle.js";
import { note } from "../career/journal.js";
import {
  currentMoveChoice,
  ensureMoveLearningState,
} from "../pokemon/moveLearning.js";

function findMon(r, id) {
  return r.party.find((mon) => mon.id === id) || r.box?.find((mon) => mon.id === id);
}

function moveName(species, id) {
  return (
    catalog[species]?.moves.find((move) => move.id === id)?.name ||
    id
  );
}

export function handleMoveChoice(s, action, state) {
  const r = s.run;
  if (action.type !== "MOVE_CHOICE") return state;
  ensureMoveLearningState(r);
  const pending = currentMoveChoice(r);
  if (!pending || (action.monId && action.monId !== pending.monId)) return state;

  const mon = findMon(r, pending.monId);
  if (!mon) {
    r.pendingMoveChoices.shift();
  } else if (action.skip) {
    r.pendingMoveChoices.shift();
  } else {
    if (!Array.isArray(mon.moves)) mon.moves = [];
    if (mon.moves.includes(pending.moveId)) {
      r.pendingMoveChoices.shift();
    } else if (mon.moves.length < 4 && !action.forgetMoveId) {
      mon.moves.push(pending.moveId);
      note(r, `${mon.name} aprendeu ${moveName(pending.species, pending.moveId)}!`);
      r.pendingMoveChoices.shift();
    } else {
      const index = mon.moves.indexOf(action.forgetMoveId);
      if (index < 0) return state;
      const forgotten = mon.moves[index];
      mon.moves[index] = pending.moveId;
      note(
        r,
        `${mon.name} esqueceu ${moveName(mon.name, forgotten)} e aprendeu ${moveName(pending.species, pending.moveId)}!`,
      );
      r.pendingMoveChoices.shift();
    }
  }

  if (!r.pendingMoveChoices.length && r.pendingBattleKind) {
    const kind = r.pendingBattleKind;
    r.pendingBattleKind = null;
    r.phase = "career";
    beginBattle(r, kind);
  } else if (!r.pendingMoveChoices.length && r.phase === "move-choice") {
    r.phase = "career";
  }
  return s;
}
