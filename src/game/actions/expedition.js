import { EXPEDITION_RULES as RULES } from "../config/expeditions.js";
import { EXPEDITION_STORIES } from "../data/expeditions.js";
import {
  activeExpedition,
  availableExpeditions,
  expeditionSite,
  nearPoint,
  startExpedition,
  moveInExpedition,
  collectExpeditionCache,
  advanceExpedition,
  claimExpeditionTreasure,
  fieldExpeditionOpen,
} from "../expeditions/expeditions.js";
import { spend } from "../career/spendWeek.js";
import { weekLimit } from "../selectors/weekLimit.js";
import { afterWeek } from "../career/afterWeek.js";
import { note } from "../career/journal.js";
import { beginBattle } from "../battle/beginBattle.js";
import { itemName } from "../equipment/equipment.js";

export function handleExpedition(s, action, state) {
  const r = s.run;
  if (action.type === "EXPEDITION_ENTER") {
    if (!["career", "exploration"].includes(r.phase) || r.activeExpedition)
      return state;
    const site = availableExpeditions(r).find(
      (candidate) => candidate.id === action.siteId,
    );
    if (!site) return state;
    if (r.phase === "career") {
      if (r.spent >= weekLimit(r)) return state;
      spend(r, "expedition");
    } else if (
      !r.exploration ||
      !fieldExpeditionOpen(r) ||
      r.exploration.walk ||
      !nearPoint(r.exploration, RULES.entrance)
    )
      return state;
    startExpedition(r, site);
    note(
      r,
      `${EXPEDITION_STORIES[site.id].name}: uma única semana para toda a visita. Você pode sair com seus achados; não poderá voltar nesta jornada.`,
    );
    return s;
  }
  const e = activeExpedition(r);
  if (r.phase !== "expedition" || !e) return state;
  if (action.type === "EXPEDITION_MOVE")
    return moveInExpedition(e, action.dx, action.dy, action.animate)
      ? s
      : state;
  if (action.type === "EXPEDITION_STEP_COMPLETE") {
    if (!e.walk || e.walk.id !== action.id) return state;
    e.walk = null;
    return s;
  }
  if (e.walk) return state;
  const story = EXPEDITION_STORIES[r.activeExpedition];
  if (action.type === "EXPEDITION_COLLECT") {
    if (!collectExpeditionCache(r, action.choice)) return state;
    note(r, `${story.name} — ${story.rooms[e.room].found}`);
    return s;
  }
  if (action.type === "EXPEDITION_ADVANCE")
    return advanceExpedition(e) ? s : state;
  if (action.type === "EXPEDITION_CHALLENGE") {
    if (e.status !== "active" || e.room !== 2 || !nearPoint(e, RULES.guardian))
      return state;
    beginBattle(r, "expedition");
    return s;
  }
  if (action.type === "EXPEDITION_REWARD") {
    if (!claimExpeditionTreasure(r, action.reward)) return state;
    note(
      r,
      `${story.name}: você recebeu ${itemName(action.reward)} e ₽ ${expeditionSite(r.activeExpedition).victoryMoney}. A equipe se recuperou; nenhuma semana ou nível extra.`,
    );
    return s;
  }
  if (action.type === "EXPEDITION_LEAVE") {
    if (!["active", "cleared"].includes(e.status)) return state;
    if (e.status === "active") e.status = "escaped";
    r.activeExpedition = null;
    r.phase = "career";
    note(
      r,
      `${story.name}: ${e.status === "cleared" ? "expedição concluída" : "você voltou em segurança"}. Todos os achados foram conservados. A visita está encerrada nesta jornada.`,
    );
    // A visita substitui toda a exploração semanal. Não empilha outro evento
    // ou uma emboscada surpresa sobre a decisão explícita do guardião.
    afterWeek(r, { allowAmbush: false, allowEvent: false });
    return s;
  }
  return state;
}
