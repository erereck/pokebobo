import test from "node:test";
import assert from "node:assert/strict";
import {
  collectionIndex,
  DEX_ENTRIES,
  dexRegion,
  dexRuns,
  evolutionaryFamily,
  filteredDex,
  regionProgress,
} from "../src/features/pokedex/dexModel.js";
import {
  journeyCardModel,
  journeyMons,
  cardFilename,
} from "../src/features/history/journeyCardModel.js";
import catalog from "../src/game/catalog.json" with { type: "json" };

const records = [
  {
    species: "Eevee",
    shiny: false,
    slot: 1,
    seed: 12,
    runNumber: 1,
    monId: "one",
  },
  {
    species: "Eevee",
    shiny: true,
    slot: 2,
    seed: 12,
    runNumber: 1,
    monId: "one",
  },
  {
    species: "Eevee",
    shiny: true,
    slot: 2,
    seed: 12,
    runNumber: 1,
    monId: "two",
  },
  { species: "Raichu-Alola", shiny: true, slot: 3, seed: 45, runNumber: 2 },
  { species: "Vaporeon", shiny: false, slot: 1, seed: 12, runNumber: 1 },
  { species: "Not a Pokémon", shiny: true },
  { species: "__proto__", shiny: true },
];

test("Pokédex conta formas reais uma vez; normal e shiny são registros independentes", () => {
  const index = collectionIndex(records);
  assert.equal(index.size, 3);
  assert.deepEqual(
    [index.get("Eevee").normal, index.get("Eevee").shiny],
    [true, true],
  );
  assert.deepEqual(
    [index.get("Raichu-Alola").normal, index.get("Raichu-Alola").shiny],
    [false, true],
  );
  assert.equal(
    new Set(DEX_ENTRIES.map((entry) => entry.name)).size,
    DEX_ENTRIES.length,
  );
  assert.equal(DEX_ENTRIES.length, 485);
  const alias = collectionIndex([
    { species: "Oricorio-Pau" },
    { species: "Oricorio-Pa'u" },
  ]);
  assert.equal(alias.size, 1);
});

test("progresso por região inclui todas as entradas e atribui as formas à região correta", () => {
  const progress = regionProgress(collectionIndex(records));
  assert.equal(
    progress.reduce((total, item) => total + item.total, 0),
    DEX_ENTRIES.length,
  );
  assert.equal(
    progress.reduce((total, item) => total + item.registered, 0),
    3,
  );
  assert.equal(progress.find((item) => item.name === "Kanto").registered, 2);
  assert.equal(progress.find((item) => item.name === "Alola").registered, 1);
  assert.equal(dexRegion(catalog["Mr. Mime-Galar"]), "Galar");
  assert.equal(dexRegion(catalog.Sylveon), "Kalos");
});

test("filtros combinam nome/número, tipo, região, variante e faltantes sem falso shiny", () => {
  const index = collectionIndex(records);
  assert.deepEqual(
    filteredDex(index, { query: "#133", variant: "both" }).map(
      (entry) => entry.name,
    ),
    ["Eevee"],
  );
  assert.deepEqual(
    filteredDex(index, {
      region: "Alola",
      variant: "shiny",
      type: "Electric",
    }).map((entry) => entry.name),
    ["Raichu-Alola"],
  );
  assert.deepEqual(
    filteredDex(index, { variant: "normal", sort: "name" }).map(
      (entry) => entry.name,
    ),
    ["Eevee", "Vaporeon"],
  );
  assert.equal(filteredDex(index, { status: "missing" }).length, 482);
  assert.equal(
    filteredDex(index, { status: "missing", variant: "shiny" }).length,
    0,
  );
  assert.deepEqual(
    filteredDex(index, { status: "all", query: "mr mime galar" }).map(
      (entry) => entry.name,
    ),
    ["Mr. Mime-Galar"],
  );
  assert.equal(filteredDex(index, { query: "eevee", type: "Water" }).length, 0);
});

test("comparação agrupa jornadas sem misturar slots e permite consultar cada variante", () => {
  const eevee = collectionIndex(records).get("Eevee").records;
  assert.equal(dexRuns(eevee).length, 2);
  assert.equal(dexRuns(eevee, "normal").length, 1);
  assert.equal(dexRuns(eevee, "shiny").length, 1);
  assert.equal(dexRuns(eevee, "shiny")[0].slot, 2);
});

test("família evolutiva alcança todos os ramos do Eevee e permite voltar à base", () => {
  const family = evolutionaryFamily(catalog.Sylveon);
  assert.equal(family.length, 9);
  assert.ok(family.some((entry) => entry.name === "Eevee"));
  assert.ok(family.some((entry) => entry.name === "Umbreon"));
  assert.ok(family.some((entry) => entry.name === "Vaporeon"));
});

test("cartão preserva shinies e equipe rica; registros antigos não inventam níveis nem capturas", () => {
  const model = journeyCardModel({
    id: 8,
    name: "Erick",
    won: true,
    badges: 8,
    week: 31,
    mode: "nuzlocke",
    seed: 1234,
    team: [{ name: "Eevee", shiny: true, level: 32 }],
    box: [{ name: "Raichu-Alola", shiny: true, level: 32 }],
    collection: records,
  });
  assert.equal(model.title, "CAMPEÃO DA LIGA");
  assert.equal(model.teamShinies, 2);
  assert.equal(model.registered, 3);
  assert.equal(model.shinySpecies, 2);
  assert.equal(model.mode, "Nuzlocke");
  assert.equal(cardFilename(model), "pokebobo-run-8-seed-1234.png");
  const old = journeyCardModel({
    team: ["Pikachu", "Eevee"],
    levels: [20, 25],
  });
  assert.deepEqual(journeyMons(["Pikachu"], [20]), [
    { name: "Pikachu", shiny: false, level: 20 },
  ]);
  assert.equal(old.registered, null);
  assert.equal(old.challenge, null);
  assert.equal(old.team[1].level, 25);
  const incomplete = journeyCardModel({
    team: [null, "Eevee"],
    levels: null,
    collection: [null, { species: "__proto__" }],
    route: [null],
    seed: 1234,
  });
  assert.equal(incomplete.team.length, 1);
  assert.equal(incomplete.registered, null);
  assert.equal(incomplete.challenge, null);
  assert.equal(journeyCardModel({ team: [], mode: "nuzlocke" }).teamRecorded, true);
  assert.equal(journeyCardModel({}).teamRecorded, false);
});
