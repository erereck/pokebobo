import { arrival } from "../world/arrival.js";
import { note } from "../career/journal.js";
import { city } from "../selectors/city.js";

export function handleBegin(s, action, state) {
  let r = s.run;
  if (action.type === "BEGIN" && r.phase === "ready") {
    r.phase = "career";
    arrival(r);
    note(
      r,
      `${r.name} saiu de ${city(r).name} com ${r.party[0].name}. O resto é história por escrever.`,
    );
    return s;
  }
  return state;
}
