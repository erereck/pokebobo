import {
  SAVE_BACKUP_KEY,
  SAVE_KEY,
  SAVE_VERSION,
} from "./constants.js";
import { initialState } from "../state/initialState.js";
import { migrateSave } from "./migrateSave.js";

export function loadSave(storage) {
  const raw = storage.getItem(SAVE_KEY);
  if (!raw) return initialState();

  try {
    const parsed = JSON.parse(raw);
    const migrated = migrateSave(parsed);

    if (
      parsed.version !== SAVE_VERSION &&
      typeof storage.setItem === "function"
    ) {
      // Keep the exact pre-update payload once. Future additive migrations can
      // safely rewrite the main slot without destroying the previous version.
      if (!storage.getItem(SAVE_BACKUP_KEY))
        storage.setItem(SAVE_BACKUP_KEY, raw);
    }

    return migrated;
  } catch {
    // Corrupted JSON cannot be migrated, but do not actively remove the raw
    // storage entry here. The caller still gets a safe in-memory state.
    return initialState();
  }
}
