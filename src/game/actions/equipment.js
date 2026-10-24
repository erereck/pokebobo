import { note } from "../career/journal.js";
import {
  canManageEquipment,
  equipmentCount,
  equipmentOffer,
  heldItem,
  returnEquipment,
} from "../equipment/equipment.js";

export function handleEquipment(s, action, state) {
  const r = s.run;
  if (!canManageEquipment(r)) return state;
  const mon = [...r.party, ...(r.box || [])].find((m) => m.id === action.monId);
  if (!mon) return state;
  if (action.type === "UNEQUIP_ITEM") {
    if (!mon.item) return state;
    returnEquipment(r, mon);
    note(
      r,
      `${mon.nickname || mon.name} está sem item. Equipamentos retirados voltam à mochila; berries preparadas são descartadas.`,
    );
    return s;
  }
  const item =
    action.type === "MARKET_BUY_ITEM"
      ? equipmentOffer(r, action.itemId)
      : heldItem(action.itemId);
  if (!item || heldItem(mon.item)?.id === item.id) return state;
  if (action.type === "MARKET_BUY_ITEM") {
    if ((r.money || 0) < item.price) return state;
    r.money -= item.price;
    r.marketPurchases = [...(r.marketPurchases || []), `item:${item.id}`];
  } else {
    if (action.type !== "EQUIP_ITEM" || !equipmentCount(r, item.id))
      return state;
    r.heldItems[item.id]--;
  }
  returnEquipment(r, mon);
  mon.item = item.id;
  note(
    r,
    `${mon.nickname || mon.name} equipou ${item.name}.${action.type === "MARKET_BUY_ITEM" ? ` Compra de ₽ ${item.price.toLocaleString("pt-BR")}.` : " Sem gastar semana."}`,
  );
  return s;
}
