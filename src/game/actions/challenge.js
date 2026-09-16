import { beginBattle } from "../battle/beginBattle.js";
import { city } from "../selectors/city.js";
import { advance } from "../world/advance.js";

export function handleChallenge(s, action, state) {
  let r = s.run;
  if (action.type === "CHALLENGE" && r.phase === "career") {
    if (r.inLeague) beginBattle(r, "league");
    else if (city(r).kind === "gym") beginBattle(r, "gym");
    else {
      r.week++;
      advance(r);
    }
    return s;
  }
  return state;
}
