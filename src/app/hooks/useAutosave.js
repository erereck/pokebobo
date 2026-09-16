import { useEffect, useState } from "react";
import { writeSave } from "../../game/persistence/writeSave.js";
export function useAutosave(state) {
  const [saving, setSaving] = useState(true);
  useEffect(() => {
    try {
      writeSave(localStorage, state);
      setSaving(true);
    } catch {
      setSaving(false);
    }
  }, [state]);
  return saving;
}
