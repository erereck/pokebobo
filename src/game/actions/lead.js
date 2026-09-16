import { note } from "../career/journal.js";

export function handleLead(s, action, state) {
  let r = s.run;
  if (action.type === "LEAD" && r.phase === "career") {
    const idx = r.party.findIndex((m) => m.id === action.id);
    if (idx > 0) {
      const [m] = r.party.splice(idx, 1);
      r.party.unshift(m);
      note(r, `${m.name} agora abre as batalhas.`);
    }
    return s;
  }
  return state;
}
