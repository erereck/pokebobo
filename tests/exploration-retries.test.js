import test from "node:test";
import assert from "node:assert/strict";
import { drafted } from "./helpers/campaign.js";
import { reducer } from "../src/game/state/reducer.js";
import { random } from "../src/game/random/random.js";
import { captureTimeline } from "../src/features/encounters/captureTimeline.js";
import { terrainQuadrants } from "../src/features/encounters/terrainPresentation.js";
import { writeSave } from "../src/game/persistence/writeSave.js";
import { loadSave } from "../src/game/persistence/loadSave.js";

function field(spent = 0) {
  const state = drafted(1234);
  state.run.lastAmbush = 999;
  state.run.moveLearningMode = "automatic";
  state.run.spent = spent;
  return reducer(state, { type: "EXPLORE" });
}
function reload(state) {
  const store = new Map();
  const storage = {
    getItem: (key) => store.get(key),
    setItem: (key, value) => store.set(key, value),
  };
  writeSave(storage, state);
  return loadSave(storage);
}
const failureSeed = (() => {
  let seed = 1;
  while (random({ rng: seed }) < 0.67) seed++;
  return seed;
})();

test("o 50º passo termina a rota, sem encontro ou cobrança extra, inclusive após reload", () => {
  let state = field(2);
  const week = state.run.week;
  for (let i = 0; i < 49; i++) {
    state = reducer(state, { type: "MOVE_ROUTE", dx: i % 2 ? -1 : 1, dy: 0 });
    assert.equal(state.run.phase, "exploration");
  }
  assert.equal(state.run.exploration.steps, 49);
  assert.equal(reducer(state, { type: "MOVE_ROUTE", dx: 0, dy: 0 }), state);
  state.run.exploration.x = 3;
  state.run.exploration.y = 3;
  state.run.exploration.grassSteps = 9;
  const rng = state.run.rng;
  state = reducer(state, { type: "MOVE_ROUTE", dx: 1, dy: 0, animate: true });
  assert.equal(state.run.phase, "exploration");
  assert.equal(state.run.exploration.walk.encounterIndex, null);
  assert.equal(state.run.rng, rng);
  assert.equal(reducer(state, { type: "MOVE_ROUTE", dx: -1, dy: 0 }), state);
  state = reducer(reload(state), { type: "ROUTE_STEP_COMPLETE", id: 50 });
  assert.equal(state.run.exploration, null);
  assert.equal(state.run.position, 1);
  assert.equal(state.run.spent, 0);
  assert.equal(state.run.week, week);
  assert.equal(reducer(state, { type: "ROUTE_STEP_COMPLETE", id: 50 }), state);
});

test("falha mantém espécie, nível e semana; bolas acabam ou sucesso encerram o encontro", () => {
  let state = field();
  state.run.phase = "encounter";
  state.run.exploration.activeIndex = 0;
  state.run.encounters[0].level = 12;
  state.run.balls = 3;
  const week = state.run.week,
    name = state.run.encounters[0].name;
  for (let i = 0; i < 3; i++) {
    state.run.rng = failureSeed;
    state = reducer(state, { type: "CAPTURE", index: 0, animate: true });
    const id = state.run.captureAttempt.id;
    assert.equal(state.run.captureAttempt.success, false);
    assert.equal(
      reducer(state, { type: "CAPTURE", index: 0, animate: true }),
      state,
    );
    state = reducer(reload(state), { type: "CAPTURE_FINISH", id });
    assert.equal(state.run.balls, 2 - i);
    assert.equal(state.run.encounters[0].name, name);
    assert.equal(state.run.encounters[0].level, 12);
    assert.equal(state.run.week, week);
    assert.equal(state.run.party.length, 1);
    assert.equal(state.run.phase, i < 2 ? "encounter" : "exploration");
    assert.equal(state.run.encounters[0].used, i === 2);
  }
  assert.equal(reducer(state, { type: "CAPTURE", index: 0 }), state);
});

test("retry de save antigo não perde a oportunidade; sucesso não duplica captura", () => {
  let state = field();
  state.run.phase = "encounter";
  state.run.exploration.activeIndex = 0;
  state.run.rng = failureSeed;
  state = reducer(state, { type: "CAPTURE", index: 0, animate: true });
  state.run.encounters[0].used = true;
  delete state.run.encounters[0].captureAttempts;
  state = reducer(reload(state), {
    type: "CAPTURE_FINISH",
    id: state.run.captureAttempt.id,
  });
  assert.equal(state.run.encounters[0].used, false);
  assert.equal(state.run.encounters[0].captureAttempts, 1);
  state.run.rng = 1;
  state = reducer(state, { type: "CAPTURE", index: 0, animate: true });
  assert.equal(state.run.captureAttempt.success, true);
  const id = state.run.captureAttempt.id,
    balls = state.run.balls;
  state = reducer(state, { type: "CAPTURE_FINISH", id });
  assert.equal(state.run.party.length, 2);
  assert.equal(state.run.balls, balls);
  assert.equal(state.run.encounters[0].used, true);
  assert.equal(reducer(state, { type: "CAPTURE_FINISH", id }), state);
  assert.equal(reducer(state, { type: "CAPTURE", index: 0 }), state);
});

test("resultado aparece logo após a última sacudida sem perder as estrelas", () => {
  const { frames, revealAt } = captureTimeline(
    { success: true, shakes: 3 },
    40,
  );
  assert.ok(frames.length - revealAt <= 66);
  assert.equal(frames.filter((frame) => frame.stars).length, 24);
  assert.equal(frames[revealAt + 8].stage, "caught");
});

test("retry em evento mantém o alvo e consome o bônus uma vez; fugir não cobra outra bola", () => {
  let state = field();
  state.run.exploration = null;
  state.run.phase = "encounter";
  state.run.eventEncounterIndex = 1;
  state.run.encounters[1].level = 20;
  state.run.eventBoosts = { capture: 0.08 };
  let seed = 1;
  while (random({ rng: seed }) < 0.75) seed++;
  state.run.rng = seed;
  const balls = state.run.balls,
    week = state.run.week;
  assert.equal(reducer(state, { type: "CAPTURE", index: 0 }), state);
  state = reducer(state, { type: "CAPTURE", index: 1 });
  assert.equal(state.run.phase, "encounter");
  assert.equal(state.run.eventEncounterIndex, 1);
  assert.equal(state.run.eventBoosts.capture, 0);
  assert.equal(state.run.encounters[1].level, 20);
  assert.equal(state.run.balls, balls - 1);
  assert.equal(state.run.week, week);
  assert.equal(reducer(state, { type: "CAPTURE", index: 0 }), state);
  state = reducer(state, { type: "SKIP_ENCOUNTER" });
  assert.equal(state.run.eventEncounterIndex, null);
  assert.equal(state.run.encounters[1].used, true);
  assert.equal(state.run.balls, balls - 1);
});

test("encontro legado fixa o Pokémon após falhar, em vez de trocar a oportunidade", () => {
  let state = field();
  state.run.exploration = null;
  state.run.phase = "encounter";
  state.run.rng = failureSeed;
  state = reducer(state, { type: "CAPTURE", index: 0 });
  assert.equal(state.run.phase, "encounter");
  assert.equal(state.run.eventEncounterIndex, 0);
  assert.equal(reducer(state, { type: "CAPTURE", index: 1 }), state);
});

test("trilhas estreitas, cruzamentos e lago usam bordas e cantos de FRLG", () => {
  assert.deepEqual(
    terrainQuadrants(1, 6).map((part) => part.frame),
    [15, 16, 17, 18],
  );
  assert.deepEqual(
    terrainQuadrants(3, 6).map((part) => part.frame),
    [7, 7, 13, 13],
  );
  assert.deepEqual(
    terrainQuadrants(9, 1).map((part) => part.frame),
    [19, 20, 22, 23],
  );
  assert.equal(terrainQuadrants(3, 3), null);
});
