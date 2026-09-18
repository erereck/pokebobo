import test from "node:test";
import { grow } from "../src/game/pokemon.js";
import { makeMon } from "../src/game/pokemon.js";
import assert from "node:assert/strict";
import { catalog } from "../src/game/pokemon.js";
import { Dex } from "@pkmn/sim";
import { requiredEvolutionLevel } from "../src/game/pokemon/evolution.js";

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


test("evoluções especiais viram evolução direta por nível", () => {
  const source = Object.values(catalog).find(
    (mon) =>
      mon.evos.length === 1 &&
      catalog[mon.evos[0]]?.evoType &&
      requiredEvolutionLevel(catalog[mon.evos[0]]) > 1,
  );
  assert.ok(source, "o catálogo precisa conter ao menos uma evolução especial");
  const target = catalog[source.evos[0]];
  const level = requiredEvolutionLevel(target);
  const evolved = grow(makeMon(source.name, level - 1, "special-path"), 1);
  assert.equal(evolved.name, target.name);
  assert.equal(evolved.level, level);
});

test("toda evolução especial de caminho único tem um nível substituto", () => {
  const targets = Object.values(catalog).filter((mon) => mon.evoType);
  assert.ok(targets.length > 0);
  for (const target of targets)
    assert.ok(
      requiredEvolutionLevel(target) > 0,
      `${target.name} ficou sem nível de evolução`,
    );
});
