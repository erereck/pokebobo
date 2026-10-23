import { MARKET_RARE_CANDY } from "../config/market.js";
import { PROGRESSION } from "../config/progression.js";
import { marketIsOpen } from "../market/market.js";
import { growWithLearning } from "../pokemon/moveLearning.js";
import { note } from "../career/journal.js";

export function handleMarketCandy(s, action, state) {
  const r = s.run;
  if (!marketIsOpen(r) || (r.money || 0) < MARKET_RARE_CANDY.price)
    return state;
  const mon = [...r.party, ...(r.box || [])].find(
    (candidate) => candidate.id === action.monId,
  );
  if (!mon || mon.level >= PROGRESSION.maxLevel) return state;

  const name = mon.name;
  Object.assign(mon, growWithLearning(r, mon, MARKET_RARE_CANDY.levels));
  r.money -= MARKET_RARE_CANDY.price;
  note(
    r,
    `Rare Candy usado em ${name}: nível ${mon.level}${name !== mon.name ? ` · evoluiu para ${mon.name}` : ""}. Custo: ₽ ${MARKET_RARE_CANDY.price.toLocaleString("pt-BR")}. Saldo: ₽ ${r.money.toLocaleString("pt-BR")}.`,
  );
  return s;
}
