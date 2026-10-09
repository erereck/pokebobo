import test from "node:test";
import assert from "node:assert/strict";
import { drafted } from "./helpers/campaign.js";
import { reducer } from "../src/game/state/reducer.js";
import { isTallGrass } from "../src/game/world/exploration.js";
import { random } from "../src/game/random/random.js";
import { writeSave } from "../src/game/persistence/writeSave.js";
import { loadSave } from "../src/game/persistence/loadSave.js";
import {
  captureTimeline,
  trainerThrowFrame,
} from "../src/features/encounters/captureTimeline.js";

function field(seed = 1234) {
  const state = reducer(drafted(seed), { type: "EXPLORE" });
  state.run.moveLearningMode = "automatic";
  state.run.lastAmbush = 999;
  return state;
}
function encounter(seed = 1234) {
  const state = field(seed);
  state.run.phase = "encounter";
  state.run.exploration.activeIndex = 0;
  return state;
}
function reload(s) {
  const store = new Map();
  const storage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, value) => store.set(key, value),
  };
  writeSave(storage, s);
  return loadSave(storage);
}

test("áreas contínuas têm pelo menos vinte casas de mato, sem marcadores de captura", () => {
  for (let seed = 1; seed <= 30; seed++) {
    const e = field(seed).run.exploration;
    const grass = [];
    for (let x = 0; x < 12; x++)
      for (let y = 0; y < 8; y++) if (isTallGrass(e, x, y)) grass.push([x, y]);
    assert.ok(grass.length >= 20);
    assert.ok(
      grass.every(([x, y]) =>
        grass.some(([a, b]) => Math.abs(a - x) + Math.abs(b - y) === 1),
      ),
    );
    assert.ok(!isTallGrass(e, 1, 6));
    assert.ok(!isTallGrass(e, 9, 3));
  }
});

test("cada passo no mato sorteia encontro; ficar parado ou andar na trilha não sorteia", () => {
  let s = field();
  const rng = s.run.rng;
  assert.equal(reducer(s, { type: "MOVE_ROUTE", dx: 0, dy: 0 }), s);
  s = reducer(s, { type: "MOVE_ROUTE", dx: 1, dy: 0 });
  assert.equal(s.run.rng, rng);
  s.run.exploration.x = 3;
  s.run.exploration.y = 3;
  let steps = 0;
  while (s.run.phase === "exploration" && steps++ < 10)
    s = reducer(s, {
      type: "MOVE_ROUTE",
      dx: s.run.exploration.x === 3 ? 1 : -1,
      dy: 0,
    });
  assert.equal(s.run.phase, "encounter");
  assert.notEqual(s.run.rng, rng);
  assert.ok(!s.run.encounters[s.run.exploration.activeIndex].used);
});

test("passo animado bloqueia movimento e só abre encontro ao terminar; reload conserva o sorteio", () => {
  let s = field();
  s.run.exploration.x = 3;
  s.run.exploration.y = 3;
  s.run.exploration.grassSteps = 9;
  s = reducer(s, { type: "MOVE_ROUTE", dx: 1, dy: 0, animate: true });
  assert.equal(s.run.phase, "exploration");
  assert.equal(reducer(s, { type: "MOVE_ROUTE", dx: -1, dy: 0 }), s);
  assert.equal(reducer(s, { type: "EXIT_ROUTE" }), s);
  assert.equal(reducer(s, { type: "ROUTE_STEP_COMPLETE", id: -1 }), s);
  const index = s.run.exploration.walk.encounterIndex;
  s = reload(s);
  s = reducer(s, {
    type: "ROUTE_STEP_COMPLETE",
    id: s.run.exploration.walk.id,
  });
  assert.equal(s.run.phase, "encounter");
  assert.equal(s.run.exploration.activeIndex, index);
  const level = s.run.encounters[index].level;
  assert.ok(Number.isInteger(level));
  const base = s;
  const again = reducer(reload(base), {
    type: "CAPTURE",
    index,
    animate: true,
  });
  const same = reducer(base, { type: "CAPTURE", index, animate: true });
  assert.deepEqual(again.run.captureAttempt, same.run.captureAttempt);
  if (same.run.captureAttempt.mon)
    assert.equal(same.run.captureAttempt.mon.level, level);
});

test("resultado animado e instantâneo têm as mesmas regras; bola e RNG são cobrados uma vez", () => {
  for (let seed = 1; seed <= 30; seed++) {
    const base = encounter(seed);
    const expected = reducer(base, { type: "CAPTURE", index: 0 });
    let s = reducer(base, { type: "CAPTURE", index: 0, animate: true });
    assert.equal(s.run.phase, "capture");
    assert.equal(s.run.balls, base.run.balls - 1);
    assert.deepEqual(s.run.party, base.run.party);
    assert.deepEqual(s.run.collection, base.run.collection);
    assert.equal(reducer(s, { type: "CAPTURE", index: 0, animate: true }), s);
    assert.equal(
      reducer(s, { type: "BOX_TO_RESERVE", monId: s.run.party[0].id }),
      s,
    );
    assert.equal(reducer(s, { type: "CAPTURE_FINISH", id: "errado" }), s);
    const rng = s.run.rng;
    s = reducer(s, { type: "CAPTURE_FINISH", id: s.run.captureAttempt.id });
    assert.deepEqual(s, expected);
    assert.equal(s.run.rng, rng);
    assert.equal(reducer(s, { type: "CAPTURE_FINISH", id: "errado" }), s);
  }
});

test("sucesso e falha de captura retomam após reload sem rerrolar nem duplicar o Pokémon", () => {
  for (const success of [true, false]) {
    let s = encounter();
    for (let seed = 1; seed < 100000; seed++) {
      if (random({ rng: seed }) < 0.86 === success) {
        s.run.rng = seed;
        break;
      }
    }
    s = reducer(s, { type: "CAPTURE", index: 0, animate: true });
    assert.equal(s.run.captureAttempt.success, success);
    const outcome = structuredClone(s.run.captureAttempt),
      balls = s.run.balls,
      rng = s.run.rng;
    s = reload(s);
    assert.deepEqual(s.run.captureAttempt, outcome);
    s = reducer(s, { type: "CAPTURE_FINISH", id: outcome.id });
    assert.equal(s.run.balls, balls);
    assert.equal(s.run.rng, rng);
    assert.equal(s.run.party.length, success ? 2 : 1);
    assert.equal(s.run.phase, "exploration");
    assert.equal(s.run.exploration.cooldown, 2);
  }
});

test("quadros do Red e arco de 34 ticks seguem os marcos da referência FRLG", () => {
  assert.deepEqual(trainerThrowFrame(19), [1, 48]);
  assert.deepEqual(trainerThrowFrame(20), [2, 64]);
  assert.deepEqual(trainerThrowFrame(26), [3, 64]);
  assert.deepEqual(trainerThrowFrame(32), [4, 48]);
  assert.deepEqual(trainerThrowFrame(56), [0, 48]);
  const { frames } = captureTimeline({ success: true, shakes: 3 }, 40);
  assert.deepEqual([frames[20].ball.x, frames[20].ball.y], [55, 91]);
  assert.equal(frames[54].stage, "open");
  assert.equal(frames[64].stage, "absorb");
  assert.equal(frames[92].stage, "close");
  assert.equal(frames[102].stage, "bounce");
  assert.equal(frames.filter((f) => f.stars).length, 24);
  assert.equal(frames.at(-1).stage, "caught");
  for (let shakes = 0; shakes <= 3; shakes++) {
    const fail = captureTimeline({ success: false, shakes }, 40).frames;
    assert.equal(fail.at(-1).stage, "escaped");
    assert.ok(fail.at(-1).monVisible);
    assert.ok(fail.every((f) => !f.ball || Number.isFinite(f.ball.y)));
  }
});
