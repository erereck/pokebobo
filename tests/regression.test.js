import test from "node:test";
import assert from "node:assert/strict";
import { drafted } from "./helpers/campaign.js";
import { reducer } from "../src/game/engine.js";
for (const seed of [1234, 811, 99, 402, 510])
  test("save/reload mantém ações e encontros da seed " + seed, () => {
    let a = drafted(seed),
      b = JSON.parse(JSON.stringify(a));
    a.run.lastAmbush = b.run.lastAmbush = 999;
    for (let i = 0; i < 6; i++) {
      const action = { type: "TRAIN" };
      a = reducer(a, action);
      b = reducer(JSON.parse(JSON.stringify(b)), action);
      assert.deepEqual(a, b);
    }
    assert.equal(a.run.position, 2);
    assert.equal(a.run.route[2].order, 1);
  });
