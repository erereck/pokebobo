import { PROGRESSION } from "../config/progression.js";
import { ENCOUNTER_RULES } from "../config/encounters.js";
import { CAMPAIGN_RULES } from "../config/campaign.js";
import { random } from "../random/random.js";
import { makeMon } from "../pokemon/createPokemon.js";
import { targetLevel } from "../selectors/targetLevel.js";
import { note } from "../career/journal.js";
import { afterWeek } from "../career/afterWeek.js";
import {
  captureChanceForRun,
  consumeEventBoost,
} from "../career/weekEvents.js";

export function handleCapture(s, action, state) {
  let r = s.run;
  if (action.type === "CAPTURE" && r.phase === "encounter") {
    const e = r.encounters[action.index];
    const replacement = r.party.findIndex((mon) => mon.id === action.replaceId);
    const full = r.party.length >= CAMPAIGN_RULES.partySize;
    if (!e || e.used || (full && replacement < 0) || !r.balls) return state;
    r.balls--;
    e.used = true;
    const captureChance = captureChanceForRun(r, ENCOUNTER_RULES.captureChance);
    const success = random(r) < captureChance;
    const captureBonus = consumeEventBoost(r, "capture");
    if (success) {
      const m = makeMon(
        e.name,
        Math.max(
          PROGRESSION.captureMinLevel,
          targetLevel(r) +
            PROGRESSION.captureTargetOffset +
            Math.floor(random(r) * PROGRESSION.captureLevelSpread),
        ),
        `mon${r.nextMon++}`,
      );
      const leaving = full ? r.party[replacement].name : null;
      if (full) r.party[replacement] = m;
      else r.party.push(m);
      note(
        r,
        `${e.name} entrou para a equipe! ${leaving ? `${leaving} seguiu seu próprio caminho.` : "Uma Poké Bola a menos, uma companhia a mais."}${captureBonus ? ` Bônus de evento aplicado: +${Math.round(captureBonus * 100)}%.` : ""}`,
      );
    } else {
      note(
        r,
        `${e.name} escapou. A Poké Bola e esta oportunidade ficaram pelo caminho.${captureBonus ? ` O bônus de +${Math.round(captureBonus * 100)}% foi consumido.` : ""}`,
      );
    }
    r.phase = "career";
    afterWeek(r);
    return s;
  }
  return state;
}
