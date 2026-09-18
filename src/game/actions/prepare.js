import { ITEM_RULES } from "../config/items.js";
import { spend } from "../career/spendWeek.js";
import { note } from "../career/journal.js";
import { afterWeek } from "../career/afterWeek.js";

export function handlePrepare(s, action, state) {
  let r = s.run;
  if (
    action.type === "PREPARE" &&
    r.phase === "career" &&
    !r.inLeague &&
    r.berries > 0
  ) {
    spend(r, "prepare");
    r.berries--;
    r.party = r.party.map((m) => ({
      ...m,
      item: ITEM_RULES.preparedItem,
    }));
    r.prepared = true;
    note(
      r,
      "Equipe preparada. Cada Pokémon leva uma Sitrus Berry: cura automática durante a próxima batalha.",
    );
    afterWeek(r);
    return s;
  }
  return state;
}
