import { canPrepare, prepareEmptySlots } from "../equipment/equipment.js";
import { spend } from "../career/spendWeek.js";
import { note } from "../career/journal.js";
import { afterWeek } from "../career/afterWeek.js";

export function handlePrepare(s, action, state) {
  let r = s.run;
  if (
    action.type === "PREPARE" &&
    r.phase === "career" &&
    !r.inLeague &&
    r.berries > 0 &&
    canPrepare(r)
  ) {
    spend(r, "prepare");
    r.berries--;
    const count = prepareEmptySlots(r);
    note(
      r,
      `Equipe preparada. ${count} Pokémon sem item receberam Sitrus Berry. Equipamentos já usados foram preservados.`,
    );
    afterWeek(r);
    return s;
  }
  return state;
}
