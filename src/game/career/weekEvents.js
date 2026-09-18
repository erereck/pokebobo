import { WEEK_EVENT_RULES } from "../config/events.js";
import { WEEK_EVENTS } from "../data/weekEvents.js";
import { random } from "../random/random.js";
import { train } from "./training.js";
import { growWithLearning } from "../pokemon/moveLearning.js";
import { ITEM_RULES } from "../config/items.js";
import { city } from "../selectors/city.js";

const byId = new Map(WEEK_EVENTS.map((event) => [event.id, event]));

export function ensureWeekEventState(r) {
  if (!Array.isArray(r.eventHistory)) r.eventHistory = [];
  if (!Array.isArray(r.eventSeen)) r.eventSeen = [];
  if (!r.eventFlags || typeof r.eventFlags !== "object") r.eventFlags = {};
  if (!r.eventBoosts || typeof r.eventBoosts !== "object")
    r.eventBoosts = {
      capture: 0,
      training: 0,
      forage: 0,
      ambushShield: 0,
    };
  r.eventBoosts.capture ||= 0;
  r.eventBoosts.training ||= 0;
  r.eventBoosts.forage ||= 0;
  r.eventBoosts.ambushShield ||= 0;
}

function conditionMatches(r, condition = {}) {
  if (condition.minBadges != null && r.badges < condition.minBadges) return false;
  if (condition.maxBadges != null && r.badges > condition.maxBadges) return false;
  if (condition.minBalls != null && r.balls < condition.minBalls) return false;
  if (condition.minBerries != null && r.berries < condition.minBerries) return false;
  if (condition.minParty != null && r.party.length < condition.minParty) return false;
  if (condition.mode && r.mode !== condition.mode) return false;
  if (
    condition.unusedEncounter &&
    !r.encounters?.some((encounter) => !encounter.used)
  )
    return false;
  if (condition.flag && !r.eventFlags[condition.flag]) return false;
  if (condition.notFlag && r.eventFlags[condition.notFlag]) return false;
  if (condition.action) {
    const actions = Array.isArray(condition.action)
      ? condition.action
      : [condition.action];
    if (!actions.includes(r.lastWeekAction)) return false;
  }
  return true;
}

function requirementsMet(r, requires = {}) {
  if (requires.balls != null && r.balls < requires.balls) return false;
  if (requires.berries != null && r.berries < requires.berries) return false;
  if (requires.minParty != null && r.party.length < requires.minParty)
    return false;
  if (
    requires.unusedEncounter &&
    !r.encounters?.some((encounter) => !encounter.used)
  )
    return false;
  return true;
}

function weightedPick(r, values) {
  const total = values.reduce((sum, value) => sum + (value.weight || 1), 0);
  let roll = random(r) * total;
  for (const value of values) {
    roll -= value.weight || 1;
    if (roll < 0) return value;
  }
  return values.at(-1);
}

function template(r, text = "") {
  return text
    .replaceAll("{lead}", r.party[0]?.name || "seu Pokémon")
    .replaceAll("{city}", city(r)?.name || "a cidade")
    .replaceAll("{route}", r.routeName || "a rota")
    .replaceAll("{trainer}", r.name || "Treinador")
    .replaceAll("{badges}", String(r.badges || 0));
}

export function weekEventView(r) {
  const state = r.weekEvent;
  const event = state && byId.get(state.id);
  if (!event) return null;
  const allowed = new Set(state.choices || []);
  return {
    id: event.id,
    rarity: event.rarity || "common",
    title: template(r, event.title),
    kicker: template(r, event.kicker),
    text: template(r, event.text),
    choices: event.choices
      .filter((choice) => allowed.has(choice.id))
      .map((choice) => ({
        id: choice.id,
        label: template(r, choice.label),
        hint: template(r, choice.hint),
      })),
  };
}

export function maybeStartWeekEvent(r) {
  ensureWeekEventState(r);
  if (
    r.weeklyEvents === false ||
    r.inLeague ||
    r.phase !== "career" ||
    r.lastEventWeek === r.week
  )
    return false;

  const chance =
    r.mode === "rush" ? WEEK_EVENT_RULES.rushChance : WEEK_EVENT_RULES.chance;
  if (random(r) >= chance) return false;

  let candidates = WEEK_EVENTS.filter((event) => {
    if (event.once && r.eventSeen.includes(event.id)) return false;
    if (!conditionMatches(r, event.condition)) return false;
    return event.choices.some((choice) => requirementsMet(r, choice.requires));
  });
  if (!candidates.length) return false;

  const recent = new Set(r.eventHistory);
  const fresh = candidates.filter((event) => !recent.has(event.id));
  if (fresh.length) candidates = fresh;

  const event = weightedPick(r, candidates);
  const choices = event.choices
    .filter((choice) => requirementsMet(r, choice.requires))
    .map((choice) => choice.id);
  if (!choices.length) return false;

  r.weekEvent = { id: event.id, choices };
  r.lastEventWeek = r.week;
  r.eventHistory.push(event.id);
  r.eventHistory = r.eventHistory.slice(-WEEK_EVENT_RULES.historyLimit);
  if (!r.eventSeen.includes(event.id)) r.eventSeen.push(event.id);
  r.phase = "event";
  return true;
}

function addBoost(r, key, value) {
  ensureWeekEventState(r);
  const limits = {
    capture: WEEK_EVENT_RULES.maxCaptureBonus,
    training: WEEK_EVENT_RULES.maxTrainingBonus,
    forage: WEEK_EVENT_RULES.maxForageBonus,
    ambushShield: WEEK_EVENT_RULES.maxAmbushShields,
  };
  r.eventBoosts[key] = Math.min(
    limits[key] ?? Number.POSITIVE_INFINITY,
    Math.max(0, (r.eventBoosts[key] || 0) + value),
  );
}

function applyLevelsToLead(r, amount) {
  const before = r.party[0];
  if (!before) return "";
  const next = growWithLearning(r, before, amount);
  r.party[0] = next;
  const gain = next.level - before.level;
  if (!gain) return `${before.name} já está no nível máximo.`;
  const evolution =
    next.name !== before.name ? ` ${before.name} evoluiu para ${next.name}!` : "";
  return `${next.name} +${gain} nível${gain === 1 ? "" : "is"}.${evolution}`;
}

export function applyWeekEventEffect(r, effect = {}) {
  ensureWeekEventState(r);
  const details = [];

  if (effect.balls) r.balls = Math.max(0, r.balls + effect.balls);
  if (effect.berries) r.berries = Math.max(0, r.berries + effect.berries);
  if (effect.spentDelta)
    r.spent = Math.max(0, r.spent + effect.spentDelta);
  if (effect.extraWeek) {
    r.week += effect.extraWeek;
    r.spent += effect.extraWeek;
  }

  if (effect.teamLevels) {
    const result = train(r, effect.teamLevels);
    if (result) details.push(result);
  }
  if (effect.leadLevels) {
    const result = applyLevelsToLead(r, effect.leadLevels);
    if (result) details.push(result);
  }

  if (effect.prepared) {
    r.party = r.party.map((mon) => ({ ...mon, item: ITEM_RULES.preparedItem }));
    r.prepared = true;
  }

  for (const [key, value] of Object.entries(effect.boosts || {}))
    addBoost(r, key, value);

  for (const flag of effect.setFlags || []) r.eventFlags[flag] = true;
  for (const flag of effect.clearFlags || []) delete r.eventFlags[flag];

  return details.filter(Boolean).join(" ");
}

export function resolveWeekEventChoice(r, choiceId) {
  ensureWeekEventState(r);
  const state = r.weekEvent;
  const event = state && byId.get(state.id);
  if (!event || !state.choices?.includes(choiceId)) return null;
  const choice = event.choices.find((candidate) => candidate.id === choiceId);
  if (!choice || !requirementsMet(r, choice.requires)) return null;

  const resolved = choice.outcomes?.length
    ? weightedPick(r, choice.outcomes)
    : choice;
  const effectText = applyWeekEventEffect(r, resolved.effect || {});
  const result = template(r, resolved.result || choice.result || "");
  const battle = resolved.battle || choice.battle || null;
  const bonusEncounter = Boolean(
    resolved.effect?.bonusEncounter || choice.effect?.bonusEncounter,
  );

  return {
    eventId: event.id,
    title: template(r, event.title),
    result: [result, effectText].filter(Boolean).join(" "),
    battle,
    bonusEncounter,
  };
}

export function queueEventBattleReward(r, reward) {
  r.pendingEventReward = reward ? structuredClone(reward) : null;
}

export function claimEventBattleReward(r) {
  if (!r.pendingEventReward) return "";
  const reward = r.pendingEventReward;
  r.pendingEventReward = null;
  const detail = applyWeekEventEffect(r, reward);
  const parts = [];
  if (reward.balls)
    parts.push(`+${reward.balls} Poké Bola${reward.balls === 1 ? "" : "s"}`);
  if (reward.berries)
    parts.push(`+${reward.berries} kit${reward.berries === 1 ? "" : "s"} de berries`);
  if (reward.teamLevels) parts.push(`equipe +${reward.teamLevels}`);
  return [parts.join(" · "), detail].filter(Boolean).join(". ");
}

export function captureChanceForRun(r, baseChance) {
  return Math.min(0.98, baseChance + (r.eventBoosts?.capture || 0));
}

export function consumeEventBoost(r, key) {
  ensureWeekEventState(r);
  const value = r.eventBoosts[key] || 0;
  r.eventBoosts[key] = 0;
  return value;
}

export function consumeAmbushShield(r) {
  ensureWeekEventState(r);
  if (!r.eventBoosts.ambushShield) return false;
  r.eventBoosts.ambushShield--;
  return true;
}
