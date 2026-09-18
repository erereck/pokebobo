import { SAVE_VERSION } from "./constants.js";

const number = (value, fallback = 0) =>
  Number.isFinite(value) ? value : fallback;
const array = (value) => (Array.isArray(value) ? value : []);

function normalizeHistoryEntry(entry, index) {
  if (!entry || typeof entry !== "object") return null;
  const team = array(entry.team).map((mon) =>
    typeof mon === "string"
      ? mon
      : {
          id: mon?.id || "",
          name: mon?.name || "Desconhecido",
          level: number(mon?.level, 0),
        },
  );
  return {
    ...entry,
    id: number(entry.id, index + 1),
    name: entry.name || "Treinador",
    won: Boolean(entry.won),
    badges: number(entry.badges, 0),
    week: Math.max(1, number(entry.week, 1)),
    opponent: entry.opponent || "",
    team,
    mode: entry.mode || "normal",
    route: array(entry.route),
    seed: number(entry.seed, 0),
    leagueIndex: number(entry.leagueIndex, 0),
    reason: entry.reason || (entry.won ? "champion" : "defeat"),
  };
}

function normalizeRun(run) {
  if (!run || typeof run !== "object") return null;
  const party = array(run.party);
  const route = array(run.route);
  return {
    ...run,
    number: Math.max(1, number(run.number, 1)),
    name: run.name || "Treinador",
    mode: run.mode || "normal",
    phase: run.phase || "career",
    route,
    offers: array(run.offers),
    party,
    position: Math.max(0, number(run.position, 0)),
    week: Math.max(1, number(run.week, 1)),
    spent: Math.max(0, number(run.spent, 0)),
    badges: Math.max(0, number(run.badges, 0)),
    balls: Math.max(0, number(run.balls, 0)),
    berries: Math.max(0, number(run.berries, 0)),
    leagueIndex: Math.max(0, number(run.leagueIndex, 0)),
    league: array(run.league),
    journal: array(run.journal),
    notice: run.notice || "",
    lastAmbush: number(run.lastAmbush, -10),
    nextMon: Math.max(1, number(run.nextMon, party.length + 1)),
    weeklyEvents: run.weeklyEvents !== false,
    weekEvent: run.weekEvent || null,
    lastEventWeek: run.lastEventWeek ?? null,
    eventHistory: array(run.eventHistory),
    eventSeen: array(run.eventSeen),
    eventFlags:
      run.eventFlags && typeof run.eventFlags === "object"
        ? run.eventFlags
        : {},
    eventBoosts: {
      capture: number(run.eventBoosts?.capture, 0),
      training: number(run.eventBoosts?.training, 0),
      forage: number(run.eventBoosts?.forage, 0),
      ambushShield: number(run.eventBoosts?.ambushShield, 0),
    },
    pendingEventReward: run.pendingEventReward || null,
    lastWeekAction: run.lastWeekAction || "",
  };
}

export function migrateSave(input) {
  if (!input || typeof input !== "object") throw Error("save inválido");
  if (number(input.version, 0) > SAVE_VERSION)
    throw Error("save de uma versão futura");

  const rawHistory = array(input.meta?.history);
  const history = rawHistory
    .map(normalizeHistoryEntry)
    .filter(Boolean)
    .slice(0, 100);
  const run = normalizeRun(input.run);

  const maxHistoryId = history.reduce((max, item) => Math.max(max, item.id), 0);
  const winsFromHistory = history.filter((item) => item.won).length;
  const bestFromHistory = history.reduce(
    (max, item) => Math.max(max, item.badges),
    0,
  );

  return {
    ...input,
    version: SAVE_VERSION,
    meta: {
      ...(input.meta || {}),
      runs: Math.max(
        number(input.meta?.runs, 0),
        maxHistoryId,
        number(run?.number, 0),
      ),
      wins: Math.max(number(input.meta?.wins, 0), winsFromHistory),
      best: Math.max(
        number(input.meta?.best, 0),
        bestFromHistory,
        number(run?.badges, 0),
      ),
      history,
    },
    run,
  };
}
