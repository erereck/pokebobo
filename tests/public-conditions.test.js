import test from "node:test";
import assert from "node:assert/strict";
import { makeMon } from "../src/game/pokemon/createPokemon.js";
import { restoreBattle } from "../src/game/battle/restore.js";
import { battleSnapshot } from "../src/game/battle/snapshot.js";
const spec = (move) => ({
  name: "Condições",
  seed: [1, 2, 3, 4],
  choices: ["move 1"],
  player: [{ ...makeMon("Lapras", 50, "mon0"), moves: [move] }],
  enemy: [{ ...makeMon("Lapras", 50, "foe0"), moves: ["splash"] }],
});

test("caderno acompanha confusão, clima, terreno e telas de batalhas reais", () => {
  for (const [move, check] of [
    ["confuseray", (s) => assert.ok(s.foe.conditions.includes("confusion"))],
    ["raindance", (s) => assert.equal(s.field.weather, "raindance")],
    [
      "electricterrain",
      (s) => assert.equal(s.field.terrain, "electricterrain"),
    ],
    [
      "reflect",
      (s) =>
        assert.deepEqual(s.field.sides[0].conditions, [
          { id: "reflect", layers: 1 },
        ]),
    ],
    ["trickroom", (s) => assert.deepEqual(s.field.effects, ["trickroom"])],
  ]) {
    const b = restoreBattle(spec(move));
    try {
      check(battleSnapshot(b));
    } finally {
      b.destroy();
    }
  }
});

test("camadas de hazards são públicas; duração, sources e itens ocultos não entram no campo", () => {
  const input = spec("spikes");
  input.choices = ["move 1", "move 1"];
  const b = restoreBattle(input);
  try {
    const before = JSON.stringify(b.prng),
      s = battleSnapshot(b);
    assert.deepEqual(s.field.sides[1].conditions, [
      { id: "spikes", layers: 2 },
    ]);
    b.p2.active[0].item = "lightclay";
    b.p2.active[0].ability = "levitate";
    b.p2.sideConditions.spikes.duration = 99;
    assert.deepEqual(battleSnapshot(b).field, s.field);
    s.field.sides[1].conditions[0].layers = 3;
    assert.equal(b.p2.sideConditions.spikes.layers, 2);
    assert.equal(JSON.stringify(b.prng), before);
  } finally {
    b.destroy();
  }
});
