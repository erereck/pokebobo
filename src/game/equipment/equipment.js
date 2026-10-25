import { HELD_ITEMS } from "../config/equipment.js";
import { ITEM_RULES } from "../config/items.js";
import { marketIsOpen } from "../market/market.js";

const idOf = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
export const heldItem = (id) => HELD_ITEMS.find((item) => item.id === idOf(id));
export const itemName = (id) =>
  heldItem(id)?.name ||
  (idOf(id) === "sitrusberry" ? "Sitrus Berry" : id || "Nenhum");
export const canManageEquipment = (r) => ["career", "market", "expedition"].includes(r.phase);
export const canPrepare = (r) => r.party.some((mon) => !mon.item);
export const equipmentCount = (r, id) =>
  Math.max(0, Math.trunc(Number(r.heldItems?.[id]) || 0));
export function equipmentOffer(r, id) {
  const item = heldItem(id);
  return item &&
    marketIsOpen(r) &&
    !(r.marketPurchases || []).includes(`item:${item.id}`)
    ? item
    : null;
}

export function addEquipment(r, id) {
  const item = heldItem(id);
  if (!item) return;
  r.heldItems ||= {};
  r.heldItems[item.id] = equipmentCount(r, item.id) + 1;
}

// Berries preparadas são temporárias; equipamentos voltam para a mochila.
export function returnEquipment(r, mon) {
  const item = heldItem(mon.item);
  if (item) addEquipment(r, item.id);
  mon.item = "";
}

export function prepareEmptySlots(r) {
  let count = 0;
  for (const mon of r.party)
    if (!mon.item) {
      mon.item = ITEM_RULES.preparedItem;
      count++;
    }
  r.prepared = count > 0;
  return count;
}
