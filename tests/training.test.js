import test from "node:test";
import assert from "node:assert/strict";
import { drafted } from "./helpers/campaign.js";
import { reducer } from "../src/game/state/reducer.js";
import { train } from "../src/game/career/training.js";
import { makeMon } from "../src/game/pokemon/createPokemon.js";
import {
  levelGains,
  describeLevelGains,
} from "../src/game/selectors/levelGain.js";
test("treino no teto não gasta semana nem RNG; equipe mista ainda pode treinar", () => {
  const state = drafted(131);
  state.run.party = [
    makeMon("Venusaur", 100, "a"),
    makeMon("Blastoise", 100, "b"),
  ];
  assert.equal(reducer(state, { type: "TRAIN" }), state);
  state.run.party[1].level = 99;
  state.run.lastAmbush = 999;
  const next = reducer(state, { type: "TRAIN" });
  assert.equal(next.run.spent, state.run.spent + 1);
  assert.deepEqual(
    next.run.party.map((p) => p.level),
    [100, 100],
  );
  assert.match(next.run.journal[0].text, /Venusaur: máximo/);
  assert.match(next.run.journal[0].text, /Blastoise: \+1/);
});
test("ganhos reais distinguem teto, ganho parcial e normal sem mutar o time", () => {
  const party = [
    makeMon("Venusaur", 100, "a"),
    makeMon("Blastoise", 99, "b"),
    makeMon("Charizard", 96, "c"),
  ];
  const changes = levelGains(party, 3);
  assert.deepEqual(
    changes.map((c) => c.gain),
    [0, 1, 3],
  );
  assert.deepEqual(
    changes.map((c) => c.after),
    [100, 100, 99],
  );
  assert.deepEqual(
    party.map((c) => c.level),
    [100, 99, 96],
  );
  assert.match(describeLevelGains(changes), /Charizard: \+3/);
});
test("treino registra evolução sem prometer níveis além de 100", () => {
  const run = { party: [makeMon("Bulbasaur", 15, "a")] };
  const text = train(run, 1);
  assert.match(text, /Equipe \+1 nível/);
  assert.match(text, /Bulbasaur evoluiu para Ivysaur/);
  assert.equal(run.party[0].name, "Ivysaur");
  run.party = [makeMon("Venusaur", 99, "a")];
  assert.equal(train(run, 3), "Equipe +1 nível.");
});
