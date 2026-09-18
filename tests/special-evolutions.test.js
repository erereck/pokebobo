import test from "node:test";
import assert from "node:assert/strict";
import catalog from "../src/game/catalog.json" with { type: "json" };
import { evolutionLevel, grow } from "../src/game/pokemon/evolution.js";
import { makeMon } from "../src/game/pokemon/createPokemon.js";

test("evoluções especiais por amizade, item, troca e condição viram evolução por nível", () => {
  const cases = [
    ["Riolu", 19, "Lucario"],
    ["Kadabra", 31, "Alakazam"],
    ["Growlithe", 31, "Arcanine"],
    ["Tangela", 27, "Tangrowth"],
    ["Sneasel", 29, "Weavile"],
  ];
  for (const [name, level, expected] of cases) {
    const mon = makeMon(name, level, "fixed");
    assert.equal(grow(mon, 1).name, expected, name);
  }
});

test("ramificações especiais usam um caminho fixo pelo id e não exigem escolha ou item", () => {
  const allowed = new Set(catalog.Eevee.evos);
  const a = grow(makeMon("Eevee", 31, "mon42"), 1);
  const b = grow(makeMon("Eevee", 31, "mon42"), 1);
  assert.ok(allowed.has(a.name));
  assert.equal(a.name, b.name);
  assert.equal(a.level, 32);
});

test("toda linha evolutiva do catálogo com alvo elegível consegue avançar só por nível", () => {
  let checked = 0;
  for (const source of Object.values(catalog)) {
    const targets = (source.evos || []).map((name) => catalog[name]).filter(Boolean);
    if (!targets.length) continue;
    const levels = targets.map(evolutionLevel).filter(Number.isFinite);
    if (levels.length !== targets.length) continue;
    const threshold =
      targets.length > 1 ? Math.max(...levels) : levels[0];
    if (!Number.isFinite(threshold) || threshold < 1 || threshold > 100) continue;

    const before = makeMon(source.name, Math.max(1, threshold - 1), "coverage");
    const after = grow(before, 1);
    assert.ok(
      source.evos.includes(after.name) || after.name !== source.name,
      `${source.name} não evoluiu no nível ${threshold}`,
    );
    checked++;
  }
  assert.ok(checked >= 45);
});
