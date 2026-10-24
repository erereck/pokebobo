import test from "node:test";
import assert from "node:assert/strict";
import { drafted, finishBattle } from "./helpers/campaign.js";
import { reducer, initialState } from "../src/game/engine.js";
import { RIVAL_STAGES } from "../src/game/config/rival.js";
import { rivalStage, rivalTeam } from "../src/game/rival/rival.js";
import { makeMon } from "../src/game/pokemon.js";
import { parseSaveBackup } from "../src/game/persistence/importSave.js";
import catalog from "../src/game/catalog.json" with { type: "json" };
import { ORIGINS } from "../src/game/data/origins.js";

test("rival é determinístico, usa outro inicial e só permite escolha na partida pronta", () => {
  const s = drafted(85),
    other = drafted(85);
  assert.deepEqual(s.run.rival, other.run.rival);
  assert.equal(s.run.rival.starter, "Charmander");
  assert.equal(reducer(s, { type: "RIVAL_CHOOSE", profile: "nico" }), s);
  s.run.phase = "ready";
  const profile = s.run.rival.profile === "nico" ? "lia" : "nico";
  const next = reducer(s, { type: "RIVAL_CHOOSE", profile });
  assert.equal(next.run.rival.profile, profile);
  assert.equal(next.run.rng, s.run.rng);
  assert.equal(reducer(s, { type: "RIVAL_CHOOSE", profile: "ausente" }), s);
});
test("todas as origens preservam a linhagem do rival ao evoluir nos três marcos", () => {
  for (const origin of ORIGINS)
    for (const starter of origin.starters) {
      let s = reducer(initialState(), {
        type: "NEW",
        seed: 123,
        name: "Teste",
      });
      s.run.phase = "starter";
      s.run.route = [origin];
      s = reducer(s, { type: "STARTER", name: starter });
      assert.notEqual(s.run.rival.starter, starter);
      for (const stage of RIVAL_STAGES) {
        const team = rivalTeam(s.run, stage);
        assert.equal(team.length, stage.size);
        assert.ok(team.every((m) => catalog[m.name] && m.moves.length > 0));
        let root = team.at(-1).name;
        while (catalog[root].prevo) root = catalog[root].prevo;
        assert.equal(root, s.run.rival.starter);
      }
    }
});
test("revanche só aparece nos marcos, não acumula etapas antigas e fecha ao entrar na Liga", () => {
  const s = drafted();
  for (const [badges, expected] of [
    [0, null],
    [1, null],
    [2, 2],
    [4, 2],
    [5, 5],
    [7, 5],
    [8, 8],
  ]) {
    s.run.badges = badges;
    assert.equal(rivalStage(s.run)?.badges || null, expected);
  }
  s.run.rival.victories = [8];
  assert.equal(rivalStage(s.run), null);
  s.run.rival.victories = [];
  s.run.inLeague = true;
  assert.equal(reducer(s, { type: "RIVAL_CHALLENGE" }), s);
});
test("vitória real volta à fase de origem, dá equipamento uma vez e não gasta semanas/níveis", () => {
  for (const phase of ["career", "market"]) {
    let s = drafted(99);
    Object.assign(s.run, {
      badges: phase === "market" ? 8 : 2,
      phase,
      party: [makeMon("Garchomp", 80, "p0")],
      moveLearningMode: "automatic",
    });
    const before = { week: s.run.week, spent: s.run.spent };
    s = reducer(s, { type: "RIVAL_CHALLENGE" });
    assert.equal(s.run.battle.kind, "rival");
    assert.deepEqual(
      parseSaveBackup(JSON.stringify(s)).run.battle,
      s.run.battle,
    );
    const stage = s.run.battle.rivalStage,
      reward = s.run.battle.rivalReward;
    s = finishBattle(s);
    assert.equal(s.run.phase, phase);
    assert.equal(s.run.heldItems[reward], 1);
    assert.deepEqual(s.run.rival.victories, [stage]);
    assert.equal(s.run.rival.memories.length, 1);
    assert.equal(s.run.rival.memories[0].name, "Garchomp");
    assert.equal(s.run.week, before.week);
    assert.equal(s.run.spent, before.spent);
    assert.equal(s.run.party[0].level, 80);
    assert.equal(reducer(s, { type: "RIVAL_CHALLENGE" }), s);
  }
});

test("derrota real para o rival encerra a jornada sem conceder a recompensa", () => {
  let s = drafted(99);
  Object.assign(s.run, {
    badges: 8,
    phase: "market",
    party: [makeMon("Magikarp", 1, "p0")],
    moveLearningMode: "automatic",
  });
  s = reducer(s, { type: "RIVAL_CHALLENGE" });
  const opponent = s.run.battle.name;
  s = finishBattle(s);
  assert.equal(s.run.phase, "ended");
  assert.equal(s.run.won, false);
  assert.equal(s.run.heldItems.choicescarf, undefined);
  assert.deepEqual(s.run.rival.victories, []);
  assert.equal(s.meta.history[0].opponent, opponent);
  assert.equal(s.meta.history[0].rival.profile, s.run.rival.profile);
});
