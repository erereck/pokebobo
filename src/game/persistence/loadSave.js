import {
  SAVE_VERSION,
  normalizeSaveSlot,
  saveBackupKey,
  saveKey,
} from "./constants.js";
import { initialState } from "../state/initialState.js";
import { migrateSave } from "./migrateSave.js";
import {
  mergeHall,
  readGlobalHall,
  tagHall,
  writeGlobalHall,
} from "./hallStorage.js";

function read(storage, key) {
  try { return storage.getItem(key); } catch { return null; }
}

function backupOldVersion(storage, raw, parsed, backupKey) {
  if (parsed?.version === SAVE_VERSION || typeof storage.setItem !== "function")
    return;
  try { storage.setItem(backupKey, raw); } catch {}
}

function attachGlobalHall(storage, state, slot) {
  const local = tagHall(state.meta?.history, slot);
  const global = readGlobalHall(storage);
  const history = mergeHall(global, local);
  state.meta.history = history;
  try { writeGlobalHall(storage, history); } catch {}
  return state;
}

function blankWithHall(storage) {
  const state = initialState();
  state.meta.history = readGlobalHall(storage);
  return state;
}

export function loadSave(storage, slot = 1) {
  const normalized = normalizeSaveSlot(slot);
  const key = saveKey(normalized);
  const backupKey = saveBackupKey(normalized);
  const raw = read(storage, key);

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      backupOldVersion(storage, raw, parsed, backupKey);
      return attachGlobalHall(storage, migrateSave(parsed), normalized);
    } catch {}
  }

  const backup = read(storage, backupKey);
  if (backup) {
    try {
      return attachGlobalHall(storage, migrateSave(JSON.parse(backup)), normalized);
    } catch {}
  }

  return blankWithHall(storage);
}
