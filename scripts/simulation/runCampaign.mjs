import { initialState, reducer } from "../../src/game/engine.js";
import { ORIGINS } from "../../src/game/data/origins.js";
import { startBattle } from "../../src/game/battle/startBattle.js";
import { aiChoice } from "../../src/game/battle/ai.js";
import { battleSnapshot } from "../../src/game/battle/snapshot.js";
import { settle } from "../../src/game/battle/settle.js";
import { submitAiChoice } from "../../src/game/battle/submitAiChoice.js";
import { choosePreparation, chooseCapture } from "./policies.mjs";
import { battleVictory } from "../../src/game/selectors/battleVictory.js";

export function generator(seed) {
  let value = seed >>> 0 || 1;
  return () => {
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return (value >>> 0) / 4294967296;
  };
}

export function simulateCombat(spec, maxTurns = 180) {
  const battle = startBattle(spec),
    choices = [];
  let decisions = 0;
  try {
    while (
      !battle.ended &&
      battle.turn <= maxTurns &&
      decisions++ < maxTurns * 3
    ) {
      const player = aiChoice(battle, "p1"),
        foe = aiChoice(battle);
      if (player) choices.push(submitAiChoice(battle, "p1", player));
      if (foe && !battle.ended && !battle.p2.isChoiceDone()) {
        submitAiChoice(battle, "p2", foe);
      }
      settle(battle);
      if (!player && !foe && !battle.ended)
        throw Error("Unresolved simulator request");
    }
    return {
      snapshot: battleSnapshot(battle),
      choices,
      censored: !battle.ended,
    };
  } finally {
    battle.destroy();
  }
}

export function runCampaign(seed, strategy, mode = "normal", maxTurns = 180) {
  const rng = generator(seed ^ 0xa53c91e7),
    origin = ORIGINS[Math.floor(rng() * ORIGINS.length)];
  const starter = origin.starters[Math.floor(rng() * 3)];
  let state = initialState();
  if (mode !== "normal") state.meta.wins = 1;
  const act = (action) => {
    state = reducer(state, action);
  };
  act({ type: "NEW", seed, name: "Monte Carlo", mode });
  // Origin is chosen uniformly from the same seven origins available through Other origins.
  state.run.offers = [origin.id];
  act({ type: "ORIGIN", id: origin.id });
  act({ type: "STARTER", name: starter });
  while (state.run.phase === "draft")
    act({
      type: "DRAFT",
      id: state.run.offers[Math.floor(rng() * state.run.offers.length)],
    });
  act({ type: "BEGIN" });
  const actions = {},
    battles = [];
  let steps = 0,
    censored = false;
  while (state.run.phase !== "ended" && steps++ < 200) {
    const run = state.run;
    if (run.phase === "battle") {
      const result = simulateCombat(run.battle, maxTurns);
      battles.push({
        kind: run.battle.kind,
        name: run.battle.name,
        stage: run.badges + 1,
        leagueIndex: run.battle.kind === "league" ? run.leagueIndex + 1 : null,
        turns: result.snapshot.turn,
        playerMaxLevel: Math.max(...run.party.map((p) => p.level)),
        partySize: run.party.length,
        losses: result.snapshot.player.filter((p) => p.fainted).length,
        leaderMaxLevel: Math.max(...run.battle.enemy.map((p) => p.level)),
        boost: run.battle.boost,
        winner: battleVictory({ ...run, outcome: result.snapshot })
          ? "Você"
          : result.snapshot.winner === "Você"
            ? "Sem sobreviventes"
            : result.snapshot.winner,
        engineWinner: result.snapshot.winner,
        censored: result.censored,
      });
      if (result.censored) {
        censored = true;
        break;
      }
      run.battle.choices = result.choices;
      run.outcome = result.snapshot;
      run.phase = "result";
      act({ type: "RESULT" });
    } else if (run.phase === "career") {
      const action = run.inLeague
        ? { type: "CHALLENGE" }
        : choosePreparation(run, strategy, rng);
      actions[action.type] = (actions[action.type] || 0) + 1;
      act(action);
    } else if (run.phase === "encounter") {
      act(chooseCapture(run, strategy, rng));
    } else if (run.phase === "event") {
      const choiceId = run.weekEvent?.choices?.[0];
      if (!choiceId) throw Error("Weekly event has no available choice");
      actions.EVENT_CHOICE = (actions.EVENT_CHOICE || 0) + 1;
      act({ type: "EVENT_CHOICE", choiceId });
    } else throw Error("Unexpected simulation phase: " + run.phase);
  }
  if (steps >= 200) censored = true;
  const run = state.run;
  return {
    seed,
    strategy,
    mode,
    origin: origin.name,
    starter,
    won: run.won || false,
    censored,
    badges: run.badges,
    leagueWins: run.leagueIndex,
    week: run.week,
    party: run.party.map((p) => ({ name: p.name, level: p.level })),
    route: run.route.map((c) => c.id),
    actions,
    battles,
  };
}
