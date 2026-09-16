import { restoreBattle } from "../battle/restore.js";
import { battleSnapshot } from "../battle/snapshot.js";

export function handleBattleChoice(s, action, state) {
  let r = s.run;
  if (action.type === "BATTLE_CHOICE" && r.phase === "battle") {
    r.battle.choices.push(action.choice);
    const b = restoreBattle(r.battle);
    const snap = battleSnapshot(b);
    if (b.ended) {
      r.outcome = snap;
      r.phase = "result";
    }
    b.destroy();
    return s;
  }
  return state;
}
