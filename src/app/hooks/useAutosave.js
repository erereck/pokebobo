import { useEffect, useState } from "react";
import { writeSave } from "../../game/persistence/writeSave.js";

export function useAutosave(state, slot = 1) {
  const [saving, setSaving] = useState(true);
  useEffect(() => {
    try {
      writeSave(localStorage, state, slot);
      setSaving(true);
    } catch {
      setSaving(false);
    }
  }, [state, slot]);
  return saving;
}
