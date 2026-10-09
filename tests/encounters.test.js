import test from "node:test";
import { drafted } from "./helpers/campaign.js";
import { reducer } from "../src/game/engine.js";
import assert from "node:assert/strict";

function walkToFirst(s) {
  const spot = { x: 3, y: 3 };
  while (s.run.phase === "exploration" && s.run.exploration.x !== spot.x)
    s = reducer(s, {
      type: "MOVE_ROUTE",
      dx: Math.sign(spot.x - s.run.exploration.x),
      dy: 0,
    });
  while (s.run.phase === "exploration" && s.run.exploration.y !== spot.y)
    s = reducer(s, {
      type: "MOVE_ROUTE",
      dx: 0,
      dy: Math.sign(spot.y - s.run.exploration.y),
    });
  let steps = 0;
  while (s.run.phase === "exploration" && steps++ < 12)
    s = reducer(s, {
      type: "MOVE_ROUTE",
      dx: s.run.exploration.x === 3 ? 1 : -1,
      dy: 0,
    });
  return s;
}

test("captura cobra uma semana e uma bola, não permite repetir encontro", () => {
  let s = drafted();
  s.run.lastAmbush = 999;
  const week = s.run.week,
    balls = s.run.balls;
  s = reducer(s, {
    type: "EXPLORE",
  });
  assert.equal(s.run.week, week + 1);
  assert.equal(s.run.phase, "exploration");
  s = walkToFirst(s);
  assert.equal(s.run.phase, "encounter");
  const index = s.run.exploration.activeIndex;
  s = reducer(s, {
    type: "CAPTURE",
    index,
  });
  assert.equal(s.run.balls, balls - 1);
  assert.equal(s.run.week, week + 1);
  assert.equal(s.run.encounters[index].used, true);
  const unchanged = reducer(s, {
    type: "CAPTURE",
    index,
  });
  assert.deepEqual(unchanged, s);
});
test("última semana de exploração só avança ao sair da rota", () => {
  let s = drafted();
  s.run.lastAmbush = 999;
  s.run.spent = 2;
  s = reducer(s, {
    type: "EXPLORE",
  });
  assert.equal(s.run.position, 0);
  assert.equal(s.run.phase, "exploration");
  s = reducer(s, { type: "EXIT_ROUTE" });
  assert.equal(s.run.position, 1);
  assert.equal(s.run.spent, 0);
});
