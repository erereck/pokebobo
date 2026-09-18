import { CAMPAIGN_RULES } from "../config/campaign.js";
import { SAVE_VERSION } from "./constants.js";

const MODES = new Set(["normal", "rush", "nuzlocke"]);
const ENDINGS = new Set(["champion", "defeat", "retired"]);

function number(value, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback;
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeMons(value) {
  return list(value)
    .map((mon) =>
      typeof mon === "string"
        ? mon
        : mon && typeof mon === "object"
          ? {
              ...mon,
              id: typeof mon.id === "string" ? mon.id : "",
              name: typeof mon.name === "string" && mon.name ? mon.name : "Desconhecido",
              level: Math.max(0, Math.trunc(number(mon.level))),
            }
          : null,
    )
    .filter(Boolean);
}

function levelsFor(mons, explicit) {
  const listed = list(explicit);
  if (listed.length)
    return listed.map((level) => Math.max(0, Math.trunc(number(level))));
  return mons.map((mon) =>
    typeof mon === "object" && mon ? Math.max(0, Math.trunc(number(mon.level))) : 0,
  );
}

function normalizeHistoryEntry(entry, index) {
  const source = object(entry);
  if (!Object.keys(source).length) return null;
  const won = Boolean(source.won);
  const opponent = typeof source.opponent === "string" ? source.opponent : "";
  const reason =
    typeof source.reason === "string" && source.reason
      ? source.reason
      : won
        ? "champion"
        : source.ending === "retired"
          ? "abandoned"
          : "defeat";
  const inferredEnding =
    reason === "abandoned" ? "retired" : won ? "champion" : "defeat";
  const team = normalizeMons(source.team);
  const box = normalizeMons(source.box);
  return {
    ...source,
    id: Math.max(1, Math.trunc(number(source.id, index + 1))),
    name:
      typeof source.name === "string" && source.name.trim()
        ? source.name
        : "Treinador",
    won,
    ending: ENDINGS.has(source.ending) ? source.ending : inferredEnding,
    reason,
    mode: MODES.has(source.mode) ? source.mode : source.mode || "legacy",
    seed: Math.max(0, Math.trunc(number(source.seed))),
    badges: Math.min(8, Math.max(0, Math.trunc(number(source.badges)))),
    week: Math.max(1, Math.trunc(number(source.week, 1))),
    opponent,
    team,
    levels: levelsFor(team, source.levels),
    box,
    boxLevels: levelsFor(box, source.boxLevels),
    route: list(source.route),
    highlights: list(source.highlights),
    events: Math.max(0, Math.trunc(number(source.events))),
    leagueIndex: Math.max(0, Math.trunc(number(source.leagueIndex))),
  };
}

function normalizeMoveChoices(value) {
  return list(value)
    .filter((choice) => choice && typeof choice === "object")
    .map((choice) => ({
      monId: typeof choice.monId === "string" ? choice.monId : "",
      species: typeof choice.species === "string" ? choice.species : "",
      moveId: typeof choice.moveId === "string" ? choice.moveId : "",
      level: Math.max(0, Math.trunc(number(choice.level))),
    }))
    .filter((choice) => choice.monId && choice.moveId);
}

function normalizeRun(run) {
  if (!run || typeof run !== "object" || Array.isArray(run)) return null;
  const party = list(run.party);
  const boosts = object(run.eventBoosts);
  const normalized = {
    ...run,
    number: Math.max(1, Math.trunc(number(run.number, 1))),
    name:
      typeof run.name === "string" && run.name.trim() ? run.name : "Treinador",
    mode: MODES.has(run.mode) ? run.mode : "normal",
    rng: Math.max(1, Math.trunc(number(run.rng, 1))),
    phase: typeof run.phase === "string" ? run.phase : "origin",
    route: list(run.route),
    offers: list(run.offers),
    party,
    box: list(run.box).slice(0, CAMPAIGN_RULES.boxSize),
    pendingMoveChoices: normalizeMoveChoices(run.pendingMoveChoices),
    pendingBattleKind:
      typeof run.pendingBattleKind === "string" ? run.pendingBattleKind : null,
    position: Math.max(0, Math.trunc(number(run.position))),
    week: Math.max(1, Math.trunc(number(run.week, 1))),
    spent: Math.max(0, Math.trunc(number(run.spent))),
    badges: Math.min(8, Math.max(0, Math.trunc(number(run.badges)))),
    balls: Math.max(0, Math.trunc(number(run.balls, CAMPAIGN_RULES.initialBalls))),
    berries: Math.max(0, Math.trunc(number(run.berries, CAMPAIGN_RULES.initialBerryKits))),
    leagueIndex: Math.max(0, Math.trunc(number(run.leagueIndex))),
    league: list(run.league),
    journal: list(run.journal),
    notice: typeof run.notice === "string" ? run.notice : "",
    lastAmbush: Number.isFinite(Number(run.lastAmbush))
      ? Number(run.lastAmbush)
      : -10,
    nextMon: Math.max(1, Math.trunc(number(run.nextMon, party.length + 1))),
    weeklyEvents: run.weeklyEvents !== false,
    weekEvent: run.weekEvent || null,
    lastEventWeek:
      run.lastEventWeek === null || run.lastEventWeek === undefined
        ? null
        : number(run.lastEventWeek, null),
    eventHistory: list(run.eventHistory),
    eventSeen: list(run.eventSeen),
    eventFlags: object(run.eventFlags),
    eventBoosts: {
      capture: Number(boosts.capture) || 0,
      training: Number(boosts.training) || 0,
      forage: Number(boosts.forage) || 0,
      ambushShield: Number(boosts.ambushShield) || 0,
    },
    pendingEventReward: run.pendingEventReward || null,
    lastWeekAction:
      typeof run.lastWeekAction === "string" ? run.lastWeekAction : "",
  };

  if (normalized.phase === "move-choice" && !normalized.pendingMoveChoices.length)
    normalized.phase = "career";
  if (!normalized.pendingMoveChoices.length) normalized.pendingBattleKind = null;

  normalized.seed = Math.max(
    1,
    Math.trunc(number(run.seed, normalized.rng) || normalized.rng),
  );
  return normalized;
}

export function migrateSave(value) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("save inválido");
  if (number(value.version, 0) > SAVE_VERSION)
    throw Error("save de uma versão futura");

  const sourceMeta = object(value.meta);
  const history = list(sourceMeta.history)
    .map(normalizeHistoryEntry)
    .filter(Boolean);
  const run = normalizeRun(value.run);
  const historyRuns = history.reduce((max, item) => Math.max(max, item.id), 0);
  const historyWins = history.filter((item) => item.won).length;
  const historyBest = history.reduce(
    (max, item) => Math.max(max, item.badges || 0),
    0,
  );

  return {
    ...value,
    version: SAVE_VERSION,
    meta: {
      ...sourceMeta,
      runs: Math.max(
        Math.trunc(number(sourceMeta.runs)),
        historyRuns,
        Math.trunc(number(run?.number)),
      ),
      wins: Math.max(Math.trunc(number(sourceMeta.wins)), historyWins),
      best: Math.max(
        Math.trunc(number(sourceMeta.best)),
        historyBest,
        Math.trunc(number(run?.badges)),
      ),
      history,
    },
    run,
  };
}
