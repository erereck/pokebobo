import { normalizeSaveSlot, saveKey } from "./constants.js";
import { writeGlobalDex, stateCollection } from "./dexStorage.js";
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
  writeGlobalDex(storage, stateCollection(state, normalized));

  const diskState = {
    ...state,
    meta: { ...state.meta, history: [], dex: [] },
  };
  storage.setItem(saveKey(normalized), JSON.stringify(diskState));
}
