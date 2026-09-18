import { CAMPAIGN_RULES } from "../config/campaign.js";
import { ORIGINS } from "../data/origins.js";
import { sample } from "../random/sample.js";

export function handleNew(s, action, state) {
  let r = s.run;
  if (action.type === "NEW") {
    const mode =
      s.meta.wins && ["rush", "nuzlocke"].includes(action.mode)
        ? action.mode
        : "normal";
    s.meta.runs++;
    r = s.run = {
      number: s.meta.runs,
      name: (action.name || "Treinador").trim().slice(0, 24) || "Treinador",
      mode,
      rng: action.seed >>> 0 || Date.now() >>> 0 || 1,
      phase: "origin",
      route: [],
      offers: [],
      party: [],
      box: [],
      pendingMoveChoices: [],
      pendingBattleKind: null,
      position: 0,
      week: 1,
      spent: 0,
      badges: 0,
      balls: CAMPAIGN_RULES.initialBalls,
      berries: CAMPAIGN_RULES.initialBerryKits,
      leagueIndex: 0,
      league: [],
      journal: [],
      notice: "",
      lastAmbush: -10,
      nextMon: 1,
      weeklyEvents: true,
      weekEvent: null,
      lastEventWeek: null,
      eventHistory: [],
      eventSeen: [],
      eventFlags: {},
      eventBoosts: {
        capture: 0,
        training: 0,
        forage: 0,
        ambushShield: 0,
      },
      pendingEventReward: null,
      lastWeekAction: "",
    };
    r.seed = r.rng;
    r.offers = (
      s.meta.runs === 1 ? ORIGINS.slice(0, 3) : sample(r, ORIGINS, 3)
    ).map((x) => x.id);
    return s;
  }
  return state;
}
