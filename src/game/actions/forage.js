import { ITEM_RULES } from "../config/items.js";
import { spend } from "../career/spendWeek.js";
import { random } from "../random/random.js";
import { note } from "../career/journal.js";
import { afterWeek } from "../career/afterWeek.js";
import { consumeEventBoost } from "../career/weekEvents.js";

export function handleForage(s, action, state) {
  let r = s.run;
  if (action.type === "FORAGE" && r.phase === "career" && !r.inLeague) {
    spend(r, "forage");
    const bonus = consumeEventBoost(r, "forage");
    if (random(r) < ITEM_RULES.ballLootChance) {
      const amount = ITEM_RULES.ballsPerLoot + bonus;
      r.balls += amount;
      note(
        r,
        `Achado da semana: ${amount} Poké Bolas para a mochila.${bonus ? ` Bônus de evento: +${bonus}.` : ""}`,
      );
    } else {
      const amount = ITEM_RULES.berryKitsPerLoot + bonus;
      r.berries += amount;
      note(
        r,
        `Achado da semana: ${amount} kits de berries para preparar a equipe.${bonus ? ` Bônus de evento: +${bonus}.` : ""}`,
      );
    }
    afterWeek(r);
    return s;
  }
  return state;
}
