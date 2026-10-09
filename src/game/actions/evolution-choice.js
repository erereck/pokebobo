import { evolutionOptions, grow } from "../pokemon/evolution.js";
import { learnGrowthMoves, queueEvolution } from "../pokemon/moveLearning.js";
import { registerEvolution } from "../pokemon/collection.js";
import { beginBattle } from "../battle/beginBattle.js";
import { note } from "../career/journal.js";

export function handleEvolutionChoice(s, action, state) {
  const r = s.run;
  if (action.type === "EVOLUTION_REQUEST" && r.phase === "career") {
    const mon = [...r.party, ...(r.box || [])].find(
      (candidate) => candidate.id === action.monId,
    );
    if (
      !mon ||
      evolutionOptions(mon).length < 2 ||
      !evolutionOptions(mon).some((option) => option.available)
    )
      return state;
    delete mon.deferredEvolutionLevel;
    queueEvolution(r, mon);
    return s;
  }
  const pending = r.pendingEvolutionChoices?.[0];
  if (
    !pending ||
    action.monId !== pending.monId ||
    ["battle", "ended"].includes(r.phase)
  )
    return state;
  const mon = [...r.party, ...(r.box || [])].find(
    (candidate) => candidate.id === pending.monId,
  );
  if (mon) {
    if (action.defer) mon.deferredEvolutionLevel = mon.level;
    else {
      if (
        !evolutionOptions(mon).some(
          (option) => option.name === action.name && option.available,
        )
      )
        return state;
      const before = structuredClone(mon);
      const after = learnGrowthMoves(
        r,
        before,
        grow({ ...mon, name: action.name }, 0),
      );
      Object.assign(mon, after);
      registerEvolution(r, before, mon);
      note(
        r,
        `${before.name} evoluiu para ${mon.name}! Você escolheu este caminho.`,
      );
    }
  }
  r.pendingEvolutionChoices.shift();
  if (mon && !action.defer) queueEvolution(r, mon);
  if (
    !r.pendingEvolutionChoices.length &&
    !r.pendingMoveChoices?.length &&
    r.pendingBattleKind
  ) {
    const kind = r.pendingBattleKind;
    r.pendingBattleKind = null;
    beginBattle(r, kind);
  } else if (
    !r.pendingEvolutionChoices.length &&
    r.phase === "evolution-choice"
  )
    r.phase = "career";
  return s;
}
