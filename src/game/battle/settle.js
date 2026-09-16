import { submitAiChoice } from "./submitAiChoice.js";

export function settle(b) {
  let n = 0;
  while (!b.ended && b.p1.activeRequest?.wait && n++ < 12) {
    const c = submitAiChoice(b);
    if (!c) break;
  }
}
