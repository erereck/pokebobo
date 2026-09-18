import test from "node:test";
import assert from "node:assert/strict";
import { drafted } from "./helpers/campaign.js";
import { finishRun } from "../src/game/career/finishRun.js";

test("Hall arquiva também uma run sem título", () => {
  const state = drafted(404);
  state.run.badges = 3;
  state.run.week = 11;
  finishRun(state, false, "abandoned");

  assert.equal(state.meta.history.length, 1);
  assert.equal(state.meta.history[0].won, false);
  assert.equal(state.meta.history[0].badges, 3);
  assert.equal(state.meta.history[0].reason, "abandoned");
  assert.equal(state.meta.history[0].route.length, 10);
  assert.ok(Array.isArray(state.meta.history[0].team));
});
