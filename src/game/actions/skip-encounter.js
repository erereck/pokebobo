import { note } from "../career/journal.js";
import { finishWildEncounter } from "../world/exploration.js";

export function handleSkipEncounter(s, action, state) {
  let r = s.run;
  if (action.type === "SKIP_ENCOUNTER" && r.phase === "encounter") {
    if (r.exploration) r.encounters[r.exploration.activeIndex].used = true;
    if (r.eventEncounterIndex != null)
      r.encounters[r.eventEncounterIndex].used = true;
    r.eventEncounterIndex = null;
    note(
      r,
      "Você deixou o Pokémon seguir seu caminho sem gastar uma Poké Bola.",
    );
    finishWildEncounter(r);
    return s;
  }
  return state;
}
