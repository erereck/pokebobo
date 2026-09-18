import test from "node:test";
import assert from "node:assert/strict";
import { initialState } from "../src/game/state/initialState.js";
import { finishRun } from "../src/game/career/finishRun.js";
import { makeMon } from "../src/game/pokemon/createPokemon.js";

function stateForEnding() {
  const state = initialState();
  state.meta.runs = 12;
  state.run = {
    number: 12,
    name: "Erick",
    phase: "career",
    mode: "nuzlocke",
    seed: 424242,
    badges: 6,
    week: 23,
    position: 2,
    starterName: "Bulbasaur",
    eventSeen: ["a", "b", "c"],
    battle: { name: "Rival Final" },
    route: [
      { name: "Pallet" },
      { name: "Sandgem" },
      { name: "Pewter" },
    ],
    party: [
      makeMon("Venusaur", 47, "mon0"),
      makeMon("Pikachu", 39, "mon1"),
    ],
  };
  return state;
}

test("Hall da Fama arquiva derrota com equipe, níveis e contexto da carreira", () => {
  const state = stateForEnding();
  finishRun(state, false, "nuzlocke-out");
  const entry = state.meta.history[0];

  assert.equal(entry.won, false);
  assert.equal(entry.reason, "nuzlocke-out");
  assert.equal(entry.mode, "nuzlocke");
  assert.equal(entry.seed, 424242);
  assert.equal(entry.origin, "Pallet");
  assert.equal(entry.city, "Pewter");
  assert.equal(entry.starter, "Bulbasaur");
  assert.equal(entry.events, 3);
  assert.deepEqual(entry.team, [
    { id: "mon0", name: "Venusaur", level: 47 },
    { id: "mon1", name: "Pikachu", level: 39 },
  ]);
});

test("Hall mantém até 100 carreiras em vez de apagar derrotas antigas", () => {
  const state = stateForEnding();
  state.meta.history = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: "Antigo " + i,
    won: i % 4 === 0,
    badges: i % 9,
    week: 10 + i,
    team: ["Pikachu"],
  }));
  finishRun(state, false, "abandoned");

  assert.equal(state.meta.history.length, 100);
  assert.equal(state.meta.history[0].id, 12);
  assert.equal(state.meta.history[0].reason, "abandoned");
  assert.ok(state.meta.history.some((run) => run.won === false));
});
