import test from "node:test";
import { makeMon } from "../src/game/pokemon.js";
import { restoreBattle } from "../src/game/battle.js";
import assert from "node:assert/strict";
import { battleSnapshot } from "../src/game/battle.js";
import { best } from "./helpers/campaign.js";

test("Showdown restaura exatamente HP, log e turno a partir das decisões salvas", () => {
  const spec = {
    name: "Brock",
    seed: [1, 2, 3, 4],
    player: [
      { ...makeMon("Blastoise", 40, "mon0"), moves: ["tackle", "withdraw"] },
    ],
    enemy: [{ ...makeMon("Lapras", 40, "foe0"), moves: ["tackle", "amnesia"] }],
    choices: ["move 1", "move 1"],
  };
  const a = restoreBattle(spec);
  const b = restoreBattle(JSON.parse(JSON.stringify(spec)));
  assert.deepEqual(battleSnapshot(a), battleSnapshot(b));
  assert.equal(a.turn, 3);
  assert.equal(a.p2.active[0].species.name, "Lapras");
  assert.ok(a.p2.active[0].hp < a.p2.active[0].maxhp);
  a.destroy();
  b.destroy();
});
test("troca forçada resolve sem travar quando primeiro Pokémon cai", () => {
  const spec = {
    name: "Brock",
    seed: [1, 2, 3, 4],
    player: [makeMon("Magikarp", 1, "mon0"), makeMon("Blastoise", 90, "mon1")],
    enemy: [makeMon("Onix", 12, "foe0")],
    choices: [],
  };
  let sawSwitch = false;
  for (let i = 0; i < 30; i++) {
    const b = restoreBattle(spec);
    if (b.ended) {
      assert.equal(b.winner, "Você");
      b.destroy();
      break;
    }
    if (b.p1.activeRequest.forceSwitch) sawSwitch = true;
    spec.choices.push(best(b));
    b.destroy();
  }
  assert.equal(sawSwitch, true);
});
