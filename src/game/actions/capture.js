import { PROGRESSION } from "../config/progression.js";
import { ENCOUNTER_RULES } from "../config/encounters.js";
import { CAMPAIGN_RULES } from "../config/campaign.js";
import { random } from "../random/random.js";
import { makeMon } from "../pokemon/createPokemon.js";
import { targetLevel } from "../selectors/targetLevel.js";
import { note } from "../career/journal.js";
import { finishWildEncounter } from "../world/exploration.js";
import { registerPokemon } from "../pokemon/collection.js";
import { queueEvolution } from "../pokemon/moveLearning.js";
import { EXPLORATION_RULES } from "../config/exploration.js";
import {
  captureChanceForRun,
  consumeEventBoost,
} from "../career/weekEvents.js";

export function handleCapture(s, action, state) {
  let r = s.run;
  if (action.type === "CAPTURE" && r.phase === "encounter") {
    if (!Array.isArray(r.box)) r.box = [];
    const e = r.encounters[action.index];
    if (r.exploration && action.index !== r.exploration.activeIndex)
      return state;
    if (r.eventEncounterIndex != null && action.index !== r.eventEncounterIndex)
      return state;
    const replacement = r.party.findIndex((mon) => mon.id === action.replaceId);
    const fullParty = r.party.length >= CAMPAIGN_RULES.partySize;
    const fullBox = r.box.length >= CAMPAIGN_RULES.boxSize;
    const needsRelease = fullParty && fullBox;
    if (!e || e.used || (needsRelease && replacement < 0) || !r.balls)
      return state;

    r.balls--;
    e.used = true;
    const captureChance = e.theft
      ? 1
      : captureChanceForRun(
          r,
          e.legendary
            ? EXPLORATION_RULES.legendaryCaptureChance
            : ENCOUNTER_RULES.captureChance,
        );
    const success = random(r) < captureChance;
    const captureBonus = consumeEventBoost(r, "capture");
    if (success) {
      const m = makeMon(
        e.name,
        Math.max(
          PROGRESSION.captureMinLevel,
          targetLevel(r) +
            (e.legendary ? -5 : 0) +
            PROGRESSION.captureTargetOffset +
            Math.floor(random(r) * PROGRESSION.captureLevelSpread),
        ),
        `mon${r.nextMon++}`,
      );
      registerPokemon(r, m, e.theft ? "theft" : "capture");
      queueEvolution(r, m);

      let destinationText = "Uma Poké Bola a menos, uma companhia a mais.";
      if (!fullParty) {
        r.party.push(m);
      } else if (replacement >= 0) {
        const leaving = r.party[replacement];
        r.party[replacement] = m;
        if (!fullBox) {
          r.box.push({ ...leaving, item: "" });
          destinationText = `${leaving.name} foi para a reserva.`;
        } else {
          destinationText = `${leaving.name} seguiu seu próprio caminho; equipe e reserva estavam lotadas.`;
        }
      } else {
        r.box.push(m);
        destinationText = `${e.name} foi direto para a reserva (${r.box.length}/${CAMPAIGN_RULES.boxSize}).`;
      }

      note(
        r,
        `${e.name} foi capturado! ${destinationText}${captureBonus ? ` Bônus de evento aplicado: +${Math.round(captureBonus * 100)}%.` : ""}`,
      );
    } else {
      note(
        r,
        `${e.name} escapou. A Poké Bola e esta oportunidade ficaram pelo caminho.${captureBonus ? ` O bônus de +${Math.round(captureBonus * 100)}% foi consumido.` : ""}`,
      );
    }
    r.eventEncounterIndex = null;
    finishWildEncounter(r);
    return s;
  }
  return state;
}
