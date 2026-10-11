import { useEffect, useRef, useState } from "react";
import { writeSave } from "../../game/persistence/writeSave.js";
import { browserStorage } from "../../shared/browserStorage.js";

export function useAutosave(state, slot = 1) {
  const [saving, setSaving] = useState(true);
  const written = useRef(null);
  const persistNow = (next, nextSlot = slot) => {
    try {
      writeSave(browserStorage, next, nextSlot);
      written.current = { state: next, slot: nextSlot };
      setSaving(true);
      return true;
    } catch {
      setSaving(false);
      return false;
    }
  };
  useEffect(() => {
    if (written.current?.state !== state || written.current?.slot !== slot)
      persistNow(state, slot);
  }, [state, slot]);
  return { saving, persistNow };
}
