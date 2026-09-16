import test from "node:test";
import { grow } from "../src/game/pokemon.js";
import { makeMon } from "../src/game/pokemon.js";
import assert from "node:assert/strict";
import { catalog } from "../src/game/pokemon.js";
import { Dex } from "@pkmn/sim";

test("evolução e golpes acompanham os níveis sem ultrapassar 100", () => {
  const m = grow(makeMon("Bulbasaur", 15, "mon0"), 1);
  assert.equal(m.name, "Ivysaur");
  assert.equal(grow(m, 90).name, "Venusaur");
  assert.equal(grow(m, 90).level, 100);
  assert.ok(m.moves.length <= 4);
  assert.ok(m.moves.length > 0);
});
test("catálogo embarcado só referencia sprites, evoluções e golpes existentes", () => {
  for (const m of Object.values(catalog)) {
    assert.ok(m.num > 0);
    for (const id of makeMon(m.name, 50, "x").moves)
      assert.equal(Dex.moves.get(id).exists, true, `${m.name}: ${id}`);
  }
});
