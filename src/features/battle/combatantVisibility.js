export function combatantSpriteVisible(mon, effect, side) {
  if (!mon) return false;
  if (!mon.fainted) return true;
  return effect?.type === "faint" && effect?.side === side;
}
