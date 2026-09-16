import test from "node:test";
import { drafted } from "./helpers/campaign.js";
import { reducer } from "../src/game/engine.js";
import assert from "node:assert/strict";

test("três semanas viajam automaticamente; cidade de ginásio inicia batalha obrigatória", () => {
  let s = drafted();
  s.run.lastAmbush = 999;
  s = reducer(s, {
    type: "TRAIN",
  });
  s = reducer(s, {
    type: "TRAIN",
  });
  assert.equal(s.run.spent, 2);
  const before = s.run.party[0].level;
  s = reducer(s, {
    type: "TRAIN",
  });
  assert.equal(s.run.position, 1);
  assert.equal(s.run.spent, 0);
  assert.ok(
    s.run.party[0].level >= before + 1 && s.run.party[0].level <= before + 3,
  );
  s.run.position = 2;
  s.run.spent = 2;
  s = reducer(s, {
    type: "TRAIN",
  });
  assert.equal(s.run.phase, "battle");
  assert.equal(s.run.battle.kind, "gym");
  assert.equal(s.run.position, 2);
});
