export const BATTLE_SPEED_KEY = "pokebobo:battle-speed";
export const normalizeBattleSpeed = (value) =>
  value === "fast" ? "fast" : "normal";

export function readBattleSpeed(storage) {
  try {
    return normalizeBattleSpeed(storage.getItem(BATTLE_SPEED_KEY));
  } catch {
    return "normal";
  }
}

export function writeBattleSpeed(storage, value) {
  try {
    storage.setItem(BATTLE_SPEED_KEY, normalizeBattleSpeed(value));
    return true;
  } catch {
    return false;
  }
}
