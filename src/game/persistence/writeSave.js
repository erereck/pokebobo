import { SAVE_KEY } from "./constants.js";
/** Keep the serialized format stable; storage failures propagate to the UI. */
export function writeSave(storage, state) {
  storage.setItem(SAVE_KEY, JSON.stringify(state));
}
