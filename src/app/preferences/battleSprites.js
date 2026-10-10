export const BATTLE_SPRITE_KEY = "pokebobo:battle-sprites";

export const normalizeBattleSpriteStyle = (style) =>
  style === "2d" ? "2d" : "3d";

export function readBattleSpriteStyle(storage) {
  try {
    return normalizeBattleSpriteStyle(storage.getItem(BATTLE_SPRITE_KEY));
  } catch {
    return "3d";
  }
}

export function writeBattleSpriteStyle(storage, style) {
  try {
    storage.setItem(BATTLE_SPRITE_KEY, normalizeBattleSpriteStyle(style));
    return true;
  } catch {
    return false;
  }
}
