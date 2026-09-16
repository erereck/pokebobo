import { note } from "../career/journal.js";
import { finishRun } from "../career/finishRun.js";

export function handleAbandon(s, action, state) {
  let r = s.run;
  if (
    action.type === "ABANDON" &&
    !["ended", "origin", "starter", "draft", "ready"].includes(r.phase)
  ) {
    note(r, "Você guardou a mochila. Esta run terminou por aqui.");
    finishRun(s, false);
    return s;
  }
  return state;
}
