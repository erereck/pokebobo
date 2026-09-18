import { SAVE_VERSION } from "./constants.js";
import { initialState } from "../state/initialState.js";

function finite(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function normalizeHistory(history = []) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((entry) => entry && typeof entry === "object")
    .map((entry, index) => ({
      id: finite(entry.id, index + 1),
      name: entry.name || "Treinador",
      won: Boolean(entry.won),
      badges: finite(entry.badges),
      week: finite(entry.week, 1),
      opponent: entry.opponent || "",
      mode: entry.mode || "normal",
      seed: finite(entry.seed, 0),
      city: entry.city || "",
      reason: entry.reason || "",
      team: Array.isArray(entry.team) ? entry.team : [],
    }));
}

function normalizeRun(run) {
  if (!run || typeof run !== "object") return null;
  if (!Array.isArray(run.party) || !Array.isArray(run.route)) return null;

  return {
    ...run,
    mode: run.mode || "normal",
    week: finite(run.week, 1),
    spent: finite(run.spent),
    badges: finite(run.badges),
    balls: finite(run.balls),
    berries: finite(run.berries),
    journal: Array.isArray(run.journal) ? run.journal : [],
    notice: run.notice || "",
    eventHistory: Array.isArray(run.eventHistory) ? run.eventHistory : [],
    eventSeen: Array.isArray(run.eventSeen) ? run.eventSeen : [],
    eventFlags:
      run.eventFlags && typeof run.eventFlags === "object" ? run.eventFlags : {},
    eventBoosts:
      run.eventBoosts && typeof run.eventBoosts === "object"
        ? run.eventBoosts
        : { capture: 0, training: 0, forage: 0, ambushShield: 0 },
    weeklyEvents: run.weeklyEvents !== false,
    pendingEventReward: run.pendingEventReward || null,
    lastWeekAction: run.lastWeekAction || "",
  };
}

export function migrateSave(input) {
  const fresh = initialState();
  if (!input || typeof input !== "object") return fresh;

  const history = normalizeHistory(input.meta?.history);
  const winsFromHistory = history.filter((run) => run.won).length;
  const bestFromHistory = history.reduce(
    (best, run) => Math.max(best, run.badges || 0),
    0,
  );

  return {
    ...input,
    version: SAVE_VERSION,
    meta: {
      ...fresh.meta,
      ...(input.meta || {}),
      runs: Math.max(finite(input.meta?.runs), history.length),
      wins: Math.max(finite(input.meta?.wins), winsFromHistory),
      best: Math.max(finite(input.meta?.best), bestFromHistory),
      history,
    },
    run: normalizeRun(input.run),
  };
}
