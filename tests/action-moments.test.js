import test from "node:test";
import assert from "node:assert/strict";
import { actionMoments } from "../src/features/moments/actionMoments.js";
import { drafted } from "./helpers/campaign.js";
import { reducer } from "../src/game/state/reducer.js";
import { makeMon } from "../src/game/pokemon/createPokemon.js";

test("treino real celebra evolução confirmada sem alterar estado, seed ou coleção", () => {
  const before = drafted(1234);
  before.run.party = [makeMon("Bulbasaur", 15, "bulba")];
  before.run.moveLearningMode = "automatic";
  const after = reducer(before, { type: "TRAIN" });
  const untouchedBefore = structuredClone(before), untouchedAfter = structuredClone(after);
  assert.equal(after.run.party[0].name, "Ivysaur");
  assert.deepEqual(actionMoments(before.run, after.run, { type: "TRAIN" }), [
    { kind: "evolution", monId: "bulba", from: "Bulbasaur", to: "Ivysaur",
      level: after.run.party[0].level, shiny: false },
  ]);
  assert.deepEqual(before, untouchedBefore);
  assert.deepEqual(after, untouchedAfter);
});

test("escolha real de Eevee mantém shiny e reserva na apresentação", () => {
  const before = drafted(1234);
  before.run.box = [{ ...makeMon("Eevee", 50, "eevee"), shiny: true }];
  before.run.pendingEvolutionChoices = [{ monId: "eevee", species: "Eevee" }];
  const action = { type: "EVOLUTION_CHOICE", monId: "eevee", name: "Vaporeon" };
  const after = reducer(before, action);
  assert.equal(after.run.box[0].name, "Vaporeon");
  assert.deepEqual(actionMoments(before.run, after.run, action), [
    { kind: "evolution", monId: "eevee", from: "Eevee", to: "Vaporeon", level: 50, shiny: true },
  ]);
  assert.deepEqual(actionMoments(before.run, before.run, { ...action, defer: true }), []);
});

test("não celebra captura, troca, dados carregados ou outra aventura", () => {
  const before = drafted(1234), after = structuredClone(before);
  after.run.party[0].name = "Venusaur";
  for (const type of ["CAPTURE_FINISH", "LEAD", "BOX_SWAP", "NEW", "BATTLE_CHOICE"])
    assert.deepEqual(actionMoments(before.run, after.run, { type }), []);
  assert.deepEqual(actionMoments(null, after.run, { type: "TRAIN" }), []);
  after.run.seed++;
  assert.deepEqual(actionMoments(before.run, after.run, { type: "TRAIN" }), []);
});

test("cada parceiro evoluído entra uma vez, na ordem equipe e reserva", () => {
  const before = { number: 1, seed: 3, party: [makeMon("Bulbasaur", 15, "a")], box: [makeMon("Charmander", 15, "b")] };
  const after = structuredClone(before);
  after.party[0].name = "Ivysaur"; after.box[0].name = "Charmeleon";
  const moments = actionMoments(before, after, { type: "RESULT" });
  assert.deepEqual(moments.map(moment => moment.monId), ["a", "b"]);
  assert.equal(actionMoments(after, after, { type: "RESULT" }).length, 0);
});
