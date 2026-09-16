import test from "node:test";
import assert from "node:assert/strict";
import {
  runCampaign,
  simulateCombat,
} from "../scripts/simulation/runCampaign.mjs";
import { makeMon } from "../src/game/pokemon/createPokemon.js";
import { restoreBattle } from "../src/game/battle/restore.js";
import { battleSnapshot } from "../src/game/battle/snapshot.js";

test("simulador incremental produz o mesmo resultado que o replay usado pelo jogo", () => {
  const spec = {
    name: "Misty",
    seed: [4, 8, 12, 16],
    player: [makeMon("Pikachu", 24, "mon0"), makeMon("Ivysaur", 24, "mon1")],
    enemy: [makeMon("Staryu", 18, "foe0"), makeMon("Starmie", 21, "foe1")],
    choices: [],
  };
  const result = simulateCombat(spec);
  assert.equal(result.censored, false);
  const replay = restoreBattle({ ...spec, choices: result.choices });
  try {
    assert.deepEqual(battleSnapshot(replay), result.snapshot);
  } finally {
    replay.destroy();
  }
});
test("Monte Carlo é reproduzível e separa timeout de derrota", () => {
  const a = runCampaign(112233, "coverage"),
    b = runCampaign(112233, "coverage");
  assert.deepEqual(a, b);
  const censored = runCampaign(112233, "coverage", "normal", 0);
  assert.equal(censored.censored, true);
  assert.equal(censored.won, false);
});
