import test from "node:test";
import { drafted } from "./helpers/campaign.js";
import { reducer } from "../src/game/engine.js";
import assert from "node:assert/strict";

test("captura cobra uma semana e uma bola, não permite repetir encontro", () => {
  let s = drafted();
  s.run.lastAmbush = 999;
  const week = s.run.week,
    balls = s.run.balls;
  s = reducer(s, {
    type: "EXPLORE",
  });
  assert.equal(s.run.week, week + 1);
  assert.equal(s.run.phase, "encounter");
  s = reducer(s, {
    type: "CAPTURE",
    index: 0,
  });
  assert.equal(s.run.balls, balls - 1);
  assert.equal(s.run.week, week + 1);
  assert.equal(s.run.encounters[0].used, true);
  const unchanged = reducer(s, {
    type: "CAPTURE",
    index: 0,
  });
  assert.deepEqual(unchanged, s);
});
test("última semana de exploração só avança após resolver captura", () => {
  let s = drafted();
  s.run.lastAmbush = 999;
  s.run.spent = 2;
  s = reducer(s, {
    type: "EXPLORE",
  });
  assert.equal(s.run.position, 0);
  assert.equal(s.run.phase, "encounter");
  s = reducer(s, {
    type: "SKIP_ENCOUNTER",
  });
  assert.equal(s.run.position, 1);
  assert.equal(s.run.spent, 0);
});
