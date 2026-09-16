import { ITEM_RULES } from "../config/items.js";
import { spend } from "../career/spendWeek.js";
import { random } from "../random/random.js";
import { note } from "../career/journal.js";
import { afterWeek } from "../career/afterWeek.js";

export function handleForage(s, action, state) {
  let r = s.run;
  if (action.type === "FORAGE" && r.phase === "career" && !r.inLeague) {
    spend(r);
    if (random(r) < ITEM_RULES.ballLootChance) {
      r.balls += ITEM_RULES.ballsPerLoot;
      note(r, "Achado da semana: 3 Poké Bolas para a mochila.");
    } else {
      r.berries += ITEM_RULES.berryKitsPerLoot;
      note(r, "Achado da semana: 2 kits de berries para preparar a equipe.");
    }
    afterWeek(r);
    return s;
  }
  return state;
}
