import {
  SAVE_BACKUP_KEY,
  SAVE_KEY,
  SAVE_VERSION,
} from "./constants.js";
import { initialState } from "../state/initialState.js";
import { migrateSave } from "./migrateSave.js";

function keepRecoveryCopy(storage, raw) {
  if (!raw || typeof storage?.setItem !== "function") return;
  try {
    storage.setItem(SAVE_BACKUP_KEY, raw);
  } catch {
    // Recovery copy is best effort; loading the playable save still wins.
  }
}

export function loadSave(storage) {
  const raw = storage.getItem(SAVE_KEY);
  if (!raw) return initialState();

  try {
    const parsed = JSON.parse(raw);
    if (parsed.version !== SAVE_VERSION) keepRecoveryCopy(storage, raw);
    return migrateSave(parsed);
  } catch {
    keepRecoveryCopy(storage, raw);
    return initialState();
  }
}
