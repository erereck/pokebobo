import { note } from "../career/journal.js";
import { returnEquipment } from "../equipment/equipment.js";
import { heroRecord } from "../heroes/heroes.js";
import {
  canSellPokemon,
  marketIsOpen,
  marketOffer,
  pokemonSalePrice,
  tmEligibility,
} from "../market/market.js";

export function handleMarket(s, action, state) {
  const r = s.run;
  if (!marketIsOpen(r)) return state;

  if (action.type === "MARKET_SELL") {
    if (!canSellPokemon(r, action.monId)) return state;
    const source = r.party.some((mon) => mon.id === action.monId)
      ? r.party
      : r.box;
    const index = source.findIndex((mon) => mon.id === action.monId);
    const mon = source[index];
    const price = pokemonSalePrice(mon);
    if (!price) return state;
    heroRecord(r, mon, "sold");
    returnEquipment(r, mon);
    source.splice(index, 1);
    r.money = (r.money || 0) + price;
    note(
      r,
      `${mon.name} foi vendido por ₽ ${price.toLocaleString("pt-BR")}. Saldo: ₽ ${r.money.toLocaleString("pt-BR")}.`,
    );
    return s;
  }

  if (action.type === "MARKET_BUY_TM") {
    const tm = marketOffer(r, action.tmId);
    const mon = [...r.party, ...(r.box || [])].find(
      (candidate) => candidate.id === action.monId,
    );
    if (
      !tm ||
      !mon ||
      (r.money || 0) < tm.price ||
      tmEligibility(mon, tm.id) !== "Pode aprender"
    )
      return state;
    const index = mon.moves.indexOf(action.forgetMoveId);
    if (mon.moves.length >= 4 && index < 0) return state;
    // Uma transação: só debita dinheiro/estoque quando o golpe é aplicado.
    if (mon.moves.length < 4) mon.moves.push(tm.id);
    else mon.moves[index] = tm.id;
    mon.tmMoves = [
      ...(mon.tmMoves || []).filter((id) => mon.moves.includes(id)),
      tm.id,
    ];
    r.money -= tm.price;
    r.marketPurchases = [...(r.marketPurchases || []), tm.id];
    note(
      r,
      `${mon.name} aprendeu ${tm.name}! TM consumida por ₽ ${tm.price.toLocaleString("pt-BR")}. Saldo: ₽ ${r.money.toLocaleString("pt-BR")}.`,
    );
    return s;
  }

  if (action.type === "MARKET_LEAVE") {
    r.inLeague = true;
    r.phase = "career";
    note(
      r,
      "Preparação encerrada. Cinco batalhas separam você do título da Liga Pokémon.",
    );
    return s;
  }
  return state;
}
