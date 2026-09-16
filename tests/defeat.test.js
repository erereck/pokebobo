import test from "node:test";
import { drafted } from "./helpers/campaign.js";
import { makeMon } from "../src/game/pokemon.js";
import { reducer } from "../src/game/engine.js";
import { finishBattle } from "./helpers/campaign.js";
import assert from "node:assert/strict";

test("derrota é definitiva e não habilita nova batalha na mesma run", () => {
  let s = drafted();
  s.run.position = 2;
  s.run.party = [makeMon("Magikarp", 1, "mon0")];
  s = reducer(s, {
    type: "CHALLENGE",
  });
  s = finishBattle(s);
  assert.equal(s.run.phase, "ended");
  assert.equal(s.run.won, false);
  assert.equal(s.meta.history.length, 1);
  assert.deepEqual(
    reducer(s, {
      type: "CHALLENGE",
    }),
    s,
  );
});
