import { ENCOUNTER_RULES } from "../config/encounters.js";
import { CAMPAIGN_RULES } from "../config/campaign.js";
import { EXPLORATION_RULES } from "../config/exploration.js";
import { random } from "../random/random.js";
import { makeMon } from "../pokemon/createPokemon.js";
import { revealWild } from "../world/revealWild.js";
import {
  captureChanceForRun,
  consumeEventBoost,
} from "../career/weekEvents.js";
import { completeCapture } from "../world/completeCapture.js";

export function handleCapture(s, action, state) {
  const r = s.run;
  if (action.type === "CAPTURE_FINISH") {
    if (
      r.phase !== "capture" ||
      !r.captureAttempt ||
      action.id !== r.captureAttempt.id
    )
      return state;
    completeCapture(r, r.captureAttempt);
    return s;
  }
  if (action.type !== "CAPTURE" || r.phase !== "encounter") return state;
  if (!Array.isArray(r.box)) r.box = [];
  const e = r.encounters[action.index];
  if (r.exploration && action.index !== r.exploration.activeIndex) return state;
  if (r.eventEncounterIndex != null && action.index !== r.eventEncounterIndex)
    return state;
  const replacement = r.party.findIndex((mon) => mon.id === action.replaceId);
  const needsRelease =
    r.party.length >= CAMPAIGN_RULES.partySize &&
    r.box.length >= CAMPAIGN_RULES.boxSize;
  if (!e || e.used || (needsRelease && replacement < 0) || !r.balls)
    return state;
  r.balls--;
  e.used = true;
  const chance = e.theft
    ? 1
    : captureChanceForRun(
        r,
        e.legendary
          ? EXPLORATION_RULES.legendaryCaptureChance
          : ENCOUNTER_RULES.captureChance,
      );
  const roll = random(r);
  const success = roll < chance;
  const bonus = consumeEventBoost(r, "capture");
  if (success) revealWild(r, action.index);
  const mon = success ? makeMon(e.name, e.level, `mon${r.nextMon++}`) : null;
  const attempt = {
    id: `${r.week}-${action.index}-${r.balls}-${r.rng}`,
    index: action.index,
    name: e.name,
    mon,
    success,
    bonus,
    theft: !!e.theft,
    replaceId: action.replaceId || "",
    // As sacudidas apresentam o resultado já sorteado; não são novos sorteios.
    shakes: success
      ? 3
      : Math.min(3, Math.floor(((roll - chance) / (1 - chance)) * 4)),
  };
  if (action.animate) {
    r.captureAttempt = attempt;
    r.phase = "capture";
  } else completeCapture(r, attempt);
  return s;
}
