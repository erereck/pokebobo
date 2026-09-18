import { ENCOUNTER_RULES } from "../config/encounters.js";
import { random } from "../random/random.js";
import { weekLimit } from "../selectors/weekLimit.js";
import { beginBattle } from "../battle/beginBattle.js";
import { city } from "../selectors/city.js";
import { advance } from "../world/advance.js";
import {
  consumeAmbushShield,
  maybeStartWeekEvent,
} from "./weekEvents.js";
import { note } from "./journal.js";

export function afterWeek(
  r,
  { allowAmbush = true, allowEvent = true } = {},
) {
  if (allowEvent && maybeStartWeekEvent(r)) return;

  if (
    allowAmbush &&
    r.week - r.lastAmbush > ENCOUNTER_RULES.ambushCooldownWeeks &&
    random(r) < ENCOUNTER_RULES.ambushChance
  ) {
    if (consumeAmbushShield(r)) {
      note(
        r,
        "Um caminho seguro evitou uma emboscada que teria interrompido a viagem.",
      );
    } else {
      r.pendingTravel = r.spent >= weekLimit(r);
      beginBattle(r, "ambush");
      return;
    }
  }

  if (r.spent >= weekLimit(r)) {
    if (city(r).kind === "gym") beginBattle(r, "gym");
    else advance(r);
  }
}
