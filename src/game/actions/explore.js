import { spend } from "../career/spendWeek.js";
import { createExploration } from "../world/exploration.js";

export function handleExplore(s, action, state) {
  let r = s.run;
  if (
    action.type === "EXPLORE" &&
    r.phase === "career" &&
    !r.inLeague &&
    r.encounters.some((e) => !e.used) &&
    r.balls > 0
  ) {
    spend(r, "explore");
    createExploration(r);
    r.phase = "exploration";
    return s;
  }
  return state;
}
