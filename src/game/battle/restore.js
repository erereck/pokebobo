import { startBattle } from "./startBattle.js";
import { aiChoice } from "./ai.js";
import { settle } from "./settle.js";
import { submitAiChoice } from "./submitAiChoice.js";

export function restoreBattle(spec) {
  const b = startBattle(spec);
  for (const choice of spec.choices) {
    if (b.ended) break;
    const ai = aiChoice(b);
    if (!b.choose("p1", choice))
      throw Error("Essa ação não está disponível neste turno.");
    if (ai && !b.ended && b.p2.isChoiceDone() === false)
      submitAiChoice(b, "p2", ai);
    settle(b);
  }
  settle(b);
  return b;
}
