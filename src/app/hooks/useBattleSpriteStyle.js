import { useState } from "react";
import {
  normalizeBattleSpriteStyle,
  readBattleSpriteStyle,
  writeBattleSpriteStyle,
} from "../preferences/battleSprites.js";

export function useBattleSpriteStyle() {
  const [spriteStyle, setSpriteStyle] = useState(() =>
    readBattleSpriteStyle(localStorage),
  );
  const [spritePreferenceSaved, setSpritePreferenceSaved] = useState(true);
  const changeSpriteStyle = (value) => {
    const style = normalizeBattleSpriteStyle(value);
    setSpriteStyle(style);
    setSpritePreferenceSaved(writeBattleSpriteStyle(localStorage, style));
  };
  return { spriteStyle, changeSpriteStyle, spritePreferenceSaved };
}
