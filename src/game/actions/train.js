import { spend } from "../career/spendWeek.js";
import { PROGRESSION } from "../config/progression.js";
import { random } from "../random/random.js";
import { train } from "../career/training.js";
import { note } from "../career/journal.js";
import { afterWeek } from "../career/afterWeek.js";
import { canTrain } from "../selectors/levelGain.js";

export function handleTrain(s, action, state) {
  let r = s.run;
  if (action.type === "TRAIN" && r.phase === "career" && !r.inLeague) {
    if (!canTrain(r.party)) return state;
    spend(r);
    const levels =
      PROGRESSION.trainingMin +
      Math.floor(
        random(r) * (PROGRESSION.trainingMax - PROGRESSION.trainingMin + 1),
      );
    const evo = train(r, levels);
    note(r, `Treino concluído. ${evo}`);
    afterWeek(r);
    return s;
  }
  return state;
}
