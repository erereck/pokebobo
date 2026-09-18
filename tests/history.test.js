import test from "node:test";
import assert from "node:assert/strict";
import { finishRun } from "../src/game/career/finishRun.js";

function state(number = 1) {
  return {
    meta: { runs: number, wins: 0, best: 0, history: [] },
    run: {
      number,
      name: "Erick",
      mode: "normal",
      seed: 20260918,
      badges: 5,
      week: 18,
      party: [
        { id: "pika", name: "Pikachu", level: 30 },
        { id: "kada", name: "Kadabra", level: 35 },
      ],
      box: [{ id: "eevee", name: "Eevee", level: 27 }],
      battle: { name: "Sabrina" },
      route: [],
      journal: [],
      eventHistory: [],
    },
  };
}

test("Hall registra derrota com equipe rica, reserva, modo e seed", () => {
  const s = state();
  finishRun(s, false, { ending: "defeat", opponent: "Sabrina" });
  assert.equal(s.run.phase, "ended");
  assert.equal(s.meta.history.length, 1);
  assert.deepEqual(s.meta.history[0].team[0], {
    id: "pika",
    name: "Pikachu",
    level: 30,
  });
  assert.deepEqual(s.meta.history[0].levels, [30, 35]);
  assert.deepEqual(s.meta.history[0].box[0], {
    id: "eevee",
    name: "Eevee",
    level: 27,
  });
  assert.deepEqual(s.meta.history[0].boxLevels, [27]);
  assert.equal(s.meta.history[0].ending, "defeat");
  assert.equal(s.meta.history[0].reason, "defeat");
  assert.equal(s.meta.history[0].seed, 20260918);
});

test("Hall também registra run encerrada sem inventar último rival", () => {
  const s = state();
  finishRun(s, false, { ending: "retired", opponent: "" });
  assert.equal(s.meta.history[0].ending, "retired");
  assert.equal(s.meta.history[0].reason, "abandoned");
  assert.equal(s.meta.history[0].opponent, "");
});

test("histórico não corta mais as viagens antigas", () => {
  const s = state(101);
  s.meta.history = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
  finishRun(s, true, { ending: "champion", opponent: "Blue" });
  assert.equal(s.meta.history.length, 26);
  assert.equal(s.meta.history[0].won, true);
  assert.equal(s.meta.wins, 1);
});
