import { RIVALS } from "../data/rivals.js";
import { rivalStage } from "../rival/rival.js";
import { beginBattle } from "../battle/beginBattle.js";

export function handleRival(s, action, state) {
  const r = s.run;
  if (action.type === "RIVAL_CHOOSE") {
    if (
      r.phase !== "ready" ||
      !r.rival ||
      !RIVALS.some((p) => p.id === action.profile) ||
      r.rival.profile === action.profile
    )
      return state;
    r.rival.profile = action.profile;
    return s;
  }
  if (action.type !== "RIVAL_CHALLENGE" || !rivalStage(r)) return state;
  r.rivalReturnPhase = r.phase;
  beginBattle(r, "rival");
  return s;
}
