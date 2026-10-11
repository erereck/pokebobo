import { useState } from "react";
import {
  normalizeBattleSpriteStyle,
  readBattleSpriteStyle,
  writeBattleSpriteStyle,
} from "../preferences/battleSprites.js";

export function useBattleSpriteStyle() {
  const [spriteStyle, setSpriteStyle] = useState(() =>
    readBattleSpriteStyle(browserStorage),
  );
  const [spritePreferenceSaved, setSpritePreferenceSaved] = useState(true);
  const changeSpriteStyle = (value) => {
    const style = normalizeBattleSpriteStyle(value);
    setSpriteStyle(style);
    setSpritePreferenceSaved(writeBattleSpriteStyle(browserStorage, style));
  };
  return { spriteStyle, changeSpriteStyle, spritePreferenceSaved };
}
import { browserStorage } from "../../shared/browserStorage.js";
