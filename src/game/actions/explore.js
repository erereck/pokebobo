import { spend } from "../career/spendWeek.js";

export function handleExplore(s, action, state) {
  let r = s.run;
  if (
    action.type === "EXPLORE" &&
    r.phase === "career" &&
    !r.inLeague &&
    r.encounters.some((e) => !e.used) &&
    r.balls > 0
  ) {
    spend(r);
    r.phase = "encounter";
    return s;
  }
  return state;
}
