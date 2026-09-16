import test from "node:test";
import assert from "node:assert/strict";
import { makeMon } from "../src/game/pokemon/createPokemon.js";
import { startBattle } from "../src/game/battle/startBattle.js";
import { aiChoice } from "../src/game/battle/ai.js";
import { observeBattle } from "../src/game/battle/aiObservation.js";
import { submitAiChoice } from "../src/game/battle/submitAiChoice.js";

function battle(enemy, player) {
  return startBattle({
    name: "IA",
    seed: [1, 2, 3, 4],
    enemy,
    player,
    choices: [],
  });
}
const mon = (name, id, moves) => ({ ...makeMon(name, 35, id), moves });
test("IA evita imunidade e não consome RNG nem consulta escolha ou dados ocultos", () => {
  const b = battle(
    [mon("Pikachu", "foe0", ["thunderbolt", "quickattack"])],
    [mon("Quagsire", "mon0", ["tackle", "surf"])],
  );
  try {
    const rng = JSON.stringify(b.prng),
      observation = observeBattle(b);
    assert.equal(aiChoice(b), "move 2");
    assert.equal(JSON.stringify(b.prng), rng);
    b.p1.active[0].item = "choicescarf";
    b.p1.active[0].ability = "waterabsorb";
    b.p1.active[0].storedStats.def = 999;
    b.p1.active[0].moveSlots[0].id = "earthquake";
    assert.deepEqual(observeBattle(b), observation);
    assert.equal(aiChoice(b), "move 2");
    b.choose("p1", "move 2");
    assert.equal(aiChoice(b), "move 2");
  } finally {
    b.destroy();
  }
});
test("IA usa prioridade para finalizar um alvo e respeita PP", () => {
  const b = battle(
    [mon("Pikachu", "foe0", ["thunderbolt", "quickattack"])],
    [mon("Pidgeot", "mon0", ["tackle"])],
  );
  try {
    b.p1.active[0].hp = 1;
    assert.equal(aiChoice(b), "move 2");
    b.p2.activeRequest.active[0].moves[1].pp = 0;
    assert.equal(aiChoice(b), "move 1");
  } finally {
    b.destroy();
  }
});
test("IA usa recuperação quando ferida e não repete status em alvo já afetado", () => {
  const b = battle(
    [mon("Milotic", "foe0", ["recover", "toxic", "seismictoss"])],
    [mon("Lapras", "mon0", ["tackle"])],
  );
  try {
    b.p2.active[0].hp = 20;
    assert.equal(aiChoice(b), "move 1");
    b.p2.active[0].hp = b.p2.active[0].maxhp;
    b.p1.active[0].status = "psn";
    assert.equal(aiChoice(b), "move 3");
  } finally {
    b.destroy();
  }
});
test("IA troca em desvantagem clara, respeitando aprisionamento", () => {
  const b = battle(
    [
      mon("Magikarp", "foe0", ["tackle"]),
      mon("Raichu", "foe1", ["thunderbolt"]),
    ],
    [mon("Gyarados", "mon0", ["waterfall"])],
  );
  try {
    b.turn = 3;
    assert.equal(aiChoice(b), "switch 2");
    b.p2.activeRequest.active[0].trapped = true;
    assert.equal(aiChoice(b), "move 1");
  } finally {
    b.destroy();
  }
});
test("aprisionamento oculto é descoberto pela tentativa e IA usa um golpe legal", () => {
  const b = battle(
    [mon("Aggron", "foe0", ["tackle"]), mon("Flygon", "foe1", ["earthquake"])],
    [mon("Magnezone", "mon0", ["thunderbolt"])],
  );
  try {
    b.turn = 3;
    assert.equal(b.p2.activeRequest.active[0].trapped, undefined);
    assert.equal(aiChoice(b), "switch 2");
    assert.equal(submitAiChoice(b), "move 1");
    assert.equal(b.p2.activeRequest.active[0].trapped, true);
  } finally {
    b.destroy();
  }
});
