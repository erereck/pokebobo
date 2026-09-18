import { SAVE_BACKUP_KEY, SAVE_KEY, SAVE_VERSION } from "./constants.js";
import { initialState } from "../state/initialState.js";
import { migrateSave } from "./migrateSave.js";

function parseSave(raw) {
  return migrateSave(JSON.parse(raw));
}

function read(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function backupOldVersion(storage, raw, parsed) {
  if (parsed?.version === SAVE_VERSION || typeof storage.setItem !== "function")
    return;
  try {
    storage.setItem(SAVE_BACKUP_KEY, raw);
  } catch {
    // A failed backup must not prevent a readable save from loading.
  }
}

export function loadSave(storage) {
  const raw = read(storage, SAVE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      backupOldVersion(storage, raw, parsed);
      return migrateSave(parsed);
    } catch {
      // Try the automatic pre-migration backup before falling back to blank.
    }
  }

  const backup = read(storage, SAVE_BACKUP_KEY);
  if (backup) {
    try {
      return parseSave(backup);
    } catch {
      // Both copies are malformed; only then start from a clean state.
    }
  }
  return initialState();
}
