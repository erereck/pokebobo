import test from "node:test";
import assert from "node:assert/strict";
import { Dex } from "@pkmn/sim";
import catalog from "../src/game/catalog.json" with { type: "json" };
import { movesFor } from "../src/game/pokemon/moves.js";
import { learnsetFor } from "../scripts/catalog/learnsetPolicy.mjs";
const dex = Dex.mod("gen8");
test("golpes de lembrete não antecipam o aprendizado da pré-evolução", () => {
  assert.equal(catalog.Starmie.moves.find((m) => m.id === "surf").level, 44);
  assert.equal(catalog.Starmie.moves.find((m) => m.id === "psychic").level, 40);
  assert.equal(
    catalog.Roserade.moves.find((m) => m.id === "petaldance").level,
    60,
  );
  assert.equal(movesFor("Starmie", 21).includes("surf"), false);
  assert.equal(movesFor("Starmie", 21).includes("psychic"), false);
  assert.equal(movesFor("Roserade", 22).includes("petaldance"), false);
  assert.ok(movesFor("Starmie", 44).includes("surf"));
});
test("golpe recebido ao evoluir respeita o estágio; lembrete exclusivo não é automático", () => {
  const confusion = catalog.Kadabra.moves.find((m) => m.id === "confusion");
  assert.equal(confusion.level, 16);
  assert.equal(confusion.source.code, "8L0");
  const petal = catalog.Venusaur.moves.find((m) => m.id === "petalblizzard");
  assert.equal(petal.level, 32);
  assert.equal(
    catalog.Venusaur.moves.some((m) => m.id === "petaldance"),
    false,
  );
  assert.equal(
    catalog.Scizor.moves.find((m) => m.id === "bulletpunch").source.method,
    "evolution",
  );
});
test("formas compartilham fonte explicitamente; nenhum Tackle inventado para Magikarp ou Abra", () => {
  assert.deepEqual(movesFor("Magikarp", 10), ["splash"]);
  assert.deepEqual(movesFor("Abra", 10), ["teleport"]);
  assert.equal(catalog["Oricorio-Pau"].moveReference.generation, 7);
  assert.ok(
    catalog["Oricorio-Pau"].moves.every((m) => m.source.species === "Oricorio"),
  );
  assert.ok(movesFor("Oricorio-Pau", 50).includes("revelationdance"));
  assert.equal(movesFor("Oricorio-Pau", 50).includes("tackle"), false);
});
test("cada golpe tem fonte real e uma única geração de referência por set", () => {
  for (const [name, species] of Object.entries(catalog)) {
    for (const move of species.moves) {
      const s = move.source;
      assert.equal(s.generation, species.moveReference.generation, name);
      const raw = dex.species.getLearnsetData(dex.species.get(s.species).id)
        .learnset[move.id];
      assert.ok(raw.includes(s.code), name + ":" + move.id);
      assert.match(s.code, new RegExp("^" + s.generation + "L\\d+$"));
      assert.ok(
        move.level >= Math.max(1, Number(s.code.slice(2)), s.stageFloor),
      );
      assert.ok(moveDexExists(move.id));
    }
    for (let level = 1; level <= 100; level++) {
      const selected = movesFor(name, level);
      assert.ok(selected.length >= 1 && selected.length <= 4, name);
      assert.equal(new Set(selected).size, selected.length);
      assert.ok(
        selected.every((id) =>
          species.moves.some((m) => m.id === id && m.level <= level),
        ),
        name + ":" + level,
      );
    }
  }
});
function moveDexExists(id) {
  const m = dex.moves.get(id);
  return m.exists && m.gen <= 8;
}
test("gerador é reproduzível e não mistura gerações dos ancestrais", () => {
  for (const name of ["Starmie", "Roserade", "Cranidos", "Oricorio-Pau"]) {
    const generated = learnsetFor(name);
    assert.deepEqual(generated.moves, catalog[name].moves);
    assert.deepEqual(generated.reference, catalog[name].moveReference);
  }
  assert.equal(learnsetFor("Kleavor"), null);
  assert.equal(catalog.Kleavor, undefined);
});
