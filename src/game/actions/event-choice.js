import { note } from "../career/journal.js";
import { afterWeek } from "../career/afterWeek.js";
import {
  queueEventBattleReward,
  resolveWeekEventChoice,
} from "../career/weekEvents.js";
import { beginBattle } from "../battle/beginBattle.js";

export function handleEventChoice(s, action, state) {
  const r = s.run;
  if (action.type !== "EVENT_CHOICE" || r.phase !== "event") return state;

  const resolved = resolveWeekEventChoice(r, action.choiceId);
  if (!resolved) return state;

  note(r, `${resolved.title}: ${resolved.result}`);
  r.weekEvent = null;

  if (resolved.battle) {
    queueEventBattleReward(r, resolved.battle.reward);
    beginBattle(r, "ambush");
    return s;
  }

  if (resolved.bonusEncounter) {
    r.phase = "encounter";
    return s;
  }

  r.phase = "career";
  afterWeek(r, { allowEvent: false });
  return s;
}
