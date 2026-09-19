import { normalizeSaveSlot, saveKey } from "./constants.js";
import {
  mergeHall,
  readGlobalHall,
  tagHall,
  writeGlobalHall,
} from "./hallStorage.js";

export function writeSave(storage, state, slot = 1) {
  const normalized = normalizeSaveSlot(slot);
  const incomingHall = tagHall(state.meta?.history, normalized);
  const hall = mergeHall(incomingHall, readGlobalHall(storage));
  writeGlobalHall(storage, hall);

  const diskState = {
    ...state,
    meta: { ...state.meta, history: [] },
  };
  storage.setItem(saveKey(normalized), JSON.stringify(diskState));
}
