import { SAVE_KEY, SAVE_VERSION } from "./constants.js";
import { initialState } from "../state/initialState.js";

export function loadSave(storage) {
  try {
    const raw = storage.getItem(SAVE_KEY);
    if (!raw) return initialState();
    const s = JSON.parse(raw);
    if (s.version !== SAVE_VERSION || !s.meta || !Array.isArray(s.meta.history))
      throw Error("incompatível");
    if (s.run && (!Array.isArray(s.run.party) || !Array.isArray(s.run.route)))
      throw Error("incompleto");
    return s;
  } catch {
    return initialState();
  }
}
