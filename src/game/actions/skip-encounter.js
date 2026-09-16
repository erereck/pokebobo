import { note } from "../career/journal.js";
import { afterWeek } from "../career/afterWeek.js";

export function handleSkipEncounter(s, action, state) {
  let r = s.run;
  if (action.type === "SKIP_ENCOUNTER" && r.phase === "encounter") {
    note(r, "Você observou a rota e seguiu sem capturar. A semana passou.");
    r.phase = "career";
    afterWeek(r);
    return s;
  }
  return state;
}
