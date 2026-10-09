import { CAMPAIGN_RULES } from "../config/campaign.js";
import { note } from "../career/journal.js";
import { finishWildEncounter } from "./exploration.js";
import { registerPokemon } from "../pokemon/collection.js";
import { queueEvolution } from "../pokemon/moveLearning.js";

export function completeCapture(r, attempt) {
  const { mon, name, replaceId, bonus, theft } = attempt;
  if (mon) {
    const replacement = r.party.findIndex((entry) => entry.id === replaceId);
    let destination = "Uma Poké Bola a menos, uma companhia a mais.";
    if (r.party.length < CAMPAIGN_RULES.partySize) r.party.push(mon);
    else if (replacement >= 0) {
      const leaving = r.party[replacement];
      r.party[replacement] = mon;
      if (r.box.length < CAMPAIGN_RULES.boxSize) {
        r.box.push({ ...leaving, item: "" });
        destination = `${leaving.name} foi para a reserva.`;
      } else
        destination = `${leaving.name} seguiu seu próprio caminho; equipe e reserva estavam lotadas.`;
    } else {
      r.box.push(mon);
      destination = `${name} foi direto para a reserva (${r.box.length}/${CAMPAIGN_RULES.boxSize}).`;
    }
    registerPokemon(r, mon, theft ? "theft" : "capture");
    queueEvolution(r, mon);
    note(
      r,
      `${name} foi capturado! ${destination}${bonus ? ` Bônus de evento aplicado: +${Math.round(bonus * 100)}%.` : ""}`,
    );
  } else
    note(
      r,
      `${name} escapou. A Poké Bola e esta oportunidade ficaram pelo caminho.${bonus ? ` O bônus de +${Math.round(bonus * 100)}% foi consumido.` : ""}`,
    );
  r.captureAttempt = null;
  r.eventEncounterIndex = null;
  finishWildEncounter(r);
}
