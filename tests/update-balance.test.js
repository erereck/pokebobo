import test from "node:test";
import assert from "node:assert/strict";
import { initialState, reducer, loadSave } from "../src/game/engine.js";
import { GYMS } from "../src/game/data/gyms/index.js";
import { gymChallenge } from "../src/game/selectors/gymChallenge.js";
import { arrival } from "../src/game/world/arrival.js";
import { beginBattle } from "../src/game/battle/beginBattle.js";
import { drafted } from "./helpers/campaign.js";
import { makeMon } from "../src/game/pokemon/createPokemon.js";
import { createRoute } from "../src/game/world/createRoute.js";
import { familyOf } from "../src/game/world/encounterPool.js";
import { random } from "../src/game/random/random.js";
import { SAVE_VERSION } from "../src/game/persistence/constants.js";

test("draft respeita cada posição original e oferece três escolhas por etapa em 80 seeds", () => {
  for (let seed = 1; seed <= 80; seed++) {
    let state = reducer(initialState(), { type: "NEW", seed });
    state = reducer(state, { type: "ORIGIN", id: "pallet" });
    state = reducer(state, { type: "STARTER", name: "Bulbasaur" });
    while (state.run.phase === "draft") {
      const run = state.run;
      if (run.route.length >= 2) {
        assert.equal(run.offers.length, 3);
        for (const id of run.offers)
          assert.equal(
            GYMS.find((g) => g.id === id).order,
            run.route.length - 1,
          );
      }
      state = reducer(state, {
        type: "DRAFT",
        id: run.offers[seed % run.offers.length],
      });
    }
    assert.deepEqual(
      state.run.route.slice(2).map((g) => g.order),
      [1, 2, 3, 4, 5, 6, 7, 8],
    );
  }
  for (const gym of GYMS) {
    assert.equal(gym.levels.length, gym.team.length);
    assert.ok(gym.levels.every((n) => n > 0 && n <= 100));
    assert.ok(gym.sourceUrl);
  }
});

test("viagem não dá níveis nem evolui a equipe", () => {
  const { run } = drafted();
  run.position = 1;
  const team = structuredClone(run.party);
  arrival(run);
  assert.deepEqual(run.party, team);
  assert.ok(!run.notice.includes("+2"));
});

test("líder recebe +6 exatamente a partir da diferença de 10, uma única vez", () => {
  const { run } = drafted(),
    gym = GYMS.find((g) => g.id === "mahogany");
  run.position = 2;
  run.route[2] = gym;
  run.party = [makeMon("Charizard", 43, "mon0")];
  assert.equal(gymChallenge(run).boost, 0);
  run.party[0].level = 44;
  assert.deepEqual(gymChallenge(run).levels, [36, 38, 40]);
  beginBattle(run, "gym");
  assert.deepEqual(
    run.battle.enemy.map((m) => m.level),
    [36, 38, 40],
  );
  assert.deepEqual(gym.levels, [30, 32, 34]);
  assert.deepEqual(gymChallenge(run).levels, [36, 38, 40]);
  run.party[0].level = 100;
  assert.deepEqual(gymChallenge(run).levels, [36, 38, 40]);
});

test("rotas têm identidade, duas famílias distintas, variedade e save estável", () => {
  const signatures = new Set();
  for (let seed = 1; seed < 40; seed++) {
    const state = drafted(seed),
      run = state.run;
    assert.equal(run.encounters.length, 2);
    assert.notEqual(
      familyOf(run.encounters[0].name),
      familyOf(run.encounters[1].name),
    );
    signatures.add(run.encounters.map((e) => e.name).join(","));
    const save = JSON.stringify(state);
    assert.deepEqual(loadSave({ getItem: () => save }), state);
    assert.equal(run.currentRoute.id, run.route[0].id + "--" + run.route[1].id);
    const seen = new Set(run.seenFamilies);
    run.position = 1;
    createRoute(run);
    assert.ok(run.encounters.some((e) => !seen.has(familyOf(e.name))));
  }
  assert.ok(signatures.size > 8);
});

test("time completo exige escolher substituto e falha de captura preserva os seis", () => {
  const state = drafted();
  state.run.party = Array.from({ length: 6 }, (_, i) =>
    makeMon("Pidgey", 12, "mon" + i),
  );
  state.run.nextMon = 6;
  state.run.phase = "encounter";
  state.run.lastAmbush = 999;
  assert.equal(reducer(state, { type: "CAPTURE", index: 0 }), state);
  let failSeed = 1;
  while (random({ rng: failSeed }) < 0.86) failSeed++;
  state.run.rng = failSeed;
  const failed = reducer(state, {
    type: "CAPTURE",
    index: 0,
    replaceId: "mon2",
  });
  assert.deepEqual(failed.run.party, state.run.party);
  assert.equal(failed.run.balls, state.run.balls - 1);
  state.run.rng = 1;
  const success = reducer(state, {
    type: "CAPTURE",
    index: 0,
    replaceId: "mon2",
  });
  assert.equal(success.run.party.length, 6);
  assert.equal(success.run.party[2].id, "mon6");
  assert.equal(success.run.party[0].id, "mon0");
  assert.equal(success.run.party[5].id, "mon5");
});

test("save antigo reconhecível migra sem apagar a carreira", () => {
  for (const version of [1, 2, 3]) {
    const old = { ...drafted(), version };
    const loaded = loadSave({
      getItem: () => JSON.stringify(old),
      setItem() {},
    });
    assert.equal(loaded.version, SAVE_VERSION);
    assert.equal(loaded.run.seed, old.run.seed);
    assert.equal(loaded.run.name, old.run.name);
    assert.equal(loaded.run.party[0].name, old.run.party[0].name);
    assert.equal(loaded.meta.runs, old.meta.runs);
  }
});
