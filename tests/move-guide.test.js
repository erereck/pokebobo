import test from "node:test";
import assert from "node:assert/strict";
import { moveGuide } from "../src/features/battle/moveGuide.js";
import catalog from "../src/game/catalog.json" with { type: "json" };
import { restoreBattle } from "../src/game/battle/restore.js";
import { battleSnapshot } from "../src/game/battle/snapshot.js";
import { makeMon } from "../src/game/pokemon/createPokemon.js";

test("guia de golpes usa Gen 8, cobre catálogo e distingue precisão, prioridade, cura e efeitos", () => {
  for (const mon of Object.values(catalog))
    for (const move of mon.moves) {
      const guide = moveGuide(move.id);
      assert.ok(guide, move.id);
      assert.equal(guide.name, move.name);
      assert.equal(guide.type, move.type);
      assert.ok(
        guide.notes.every(
          (note) => typeof note === "string" && !note.includes("undefined"),
        ),
      );
    }
  assert.equal(moveGuide("quickattack").priority, "+1");
  assert.equal(moveGuide("aerialace").accuracy, "Sem teste");
  assert.ok(moveGuide("recover").notes.some((note) => note.includes("50%")));
  assert.ok(
    moveGuide("swordsdance").notes.some((note) =>
      note.includes("Ataque do usuário em 2"),
    ),
  );
  assert.ok(
    moveGuide("growl").notes.some((note) =>
      note.includes("Ataque do alvo em 1"),
    ),
  );
  assert.ok(
    moveGuide("flamethrower").notes.some(
      (note) => note.includes("10%") && note.includes("queimadura"),
    ),
  );
  assert.ok(
    moveGuide("doublekick").notes.some((note) => note.includes("2 vezes")),
  );
  assert.ok(
    moveGuide("futuresight").notes.some((note) =>
      note.includes("terceiro turno"),
    ),
  );
  assert.equal(moveGuide("struggle").power, 50);
  assert.equal(moveGuide("missing-move"), null);
});

test("caderno lê tipos e estágios públicos do snapshot, preservando motor e replay", () => {
  const spec = {
    name: "Caderno",
    seed: [1, 2, 3, 4],
    choices: ["move 1"],
    player: [{ ...makeMon("Scizor", 50, "mon0"), moves: ["swordsdance"] }],
    enemy: [{ ...makeMon("Lapras", 50, "foe0"), moves: ["splash"] }],
  };
  const before = JSON.stringify(spec),
    battle = restoreBattle(spec);
  try {
    const snap = battleSnapshot(battle);
    assert.deepEqual(snap.active.types, ["Bug", "Steel"]);
    assert.equal(snap.active.boosts.atk, 2);
    snap.active.boosts.atk = -6;
    assert.equal(battle.p1.active[0].boosts.atk, 2);
    assert.equal(JSON.stringify(spec), before);
  } finally {
    battle.destroy();
  }
});
