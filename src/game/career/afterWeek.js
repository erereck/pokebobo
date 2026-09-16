import { ENCOUNTER_RULES } from "../config/encounters.js";
import { random } from "../random/random.js";
import { weekLimit } from "../selectors/weekLimit.js";
import { beginBattle } from "../battle/beginBattle.js";
import { city } from "../selectors/city.js";
import { advance } from "../world/advance.js";

export function afterWeek(r, allowAmbush = true) {
  if (
    allowAmbush &&
    r.week - r.lastAmbush > ENCOUNTER_RULES.ambushCooldownWeeks &&
    random(r) < ENCOUNTER_RULES.ambushChance
  ) {
    r.pendingTravel = r.spent >= weekLimit(r);
    beginBattle(r, "ambush");
    return;
  }
  if (r.spent >= weekLimit(r)) {
    if (city(r).kind === "gym") beginBattle(r, "gym");
    else advance(r);
  }
}
