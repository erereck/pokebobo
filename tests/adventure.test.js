import test from "node:test";
import assert from "node:assert/strict";
import { drafted } from "./helpers/campaign.js";
import { reducer } from "../src/game/state/reducer.js";
import { makeMon } from "../src/game/pokemon/createPokemon.js";
import { train } from "../src/game/career/training.js";
import { grow } from "../src/game/pokemon/evolution.js";
import { beginBattle } from "../src/game/battle/beginBattle.js";
import { createRoute } from "../src/game/world/createRoute.js";
import { applyWeekEventEffect } from "../src/game/career/weekEvents.js";
import { writeSave } from "../src/game/persistence/writeSave.js";
import { loadSave } from "../src/game/persistence/loadSave.js";
import { readGlobalDex } from "../src/game/persistence/dexStorage.js";

function memory() {
  const store = new Map();
  return {
    getItem: (key) => store.get(key) || null,
    setItem: (key, value) => store.set(key, value),
  };
}
function event(s, id, choice) {
  s.run.phase = "event";
  s.run.weekEvent = { id, choices: [choice] };
  return reducer(s, { type: "EVENT_CHOICE", choiceId: choice });
}

test("Eevee espera uma escolha; caminho bloqueado não evolui e reserva também escolhe", () => {
  let s = drafted();
  s.run.moveLearningMode = "automatic";
  s.run.box = [makeMon("Eevee", 21, "eevee")];
  assert.equal(grow(makeMon("Eevee", 29, "pure"), 1).name, "Eevee");
  train(s.run, 1);
  assert.equal(s.run.box[0].name, "Eevee");
  assert.equal(s.run.pendingEvolutionChoices[0].monId, "eevee");
  assert.equal(
    reducer(s, { type: "EVOLUTION_CHOICE", monId: "eevee", name: "Vaporeon" }),
    s,
  );
  assert.equal(reducer(s, { type: "TRAIN" }), s);
  s = reducer(s, { type: "EVOLUTION_CHOICE", monId: "eevee", name: "Umbreon" });
  assert.equal(s.run.box[0].name, "Umbreon");
  assert.ok(
    s.run.collection.some(
      (entry) => entry.species === "Umbreon" && entry.kind === "evolution",
    ),
  );
  assert.equal(s.run.pendingEvolutionChoices.length, 0);
});

test("escolha adiada retorna no próximo nível e todas as formas de Eevee ficam disponíveis", () => {
  let s = drafted();
  s.run.moveLearningMode = "automatic";
  s.run.party = [makeMon("Eevee", 29, "eevee")];
  train(s.run, 0);
  s = reducer(s, { type: "EVOLUTION_CHOICE", monId: "eevee", defer: true });
  train(s.run, 0);
  assert.equal(s.run.pendingEvolutionChoices.length, 0);
  train(s.run, 3);
  const base = structuredClone(s);
  for (const name of [
    "Vaporeon",
    "Jolteon",
    "Flareon",
    "Espeon",
    "Umbreon",
    "Leafeon",
    "Glaceon",
    "Sylveon",
  ]) {
    const next = reducer(base, {
      type: "EVOLUTION_CHOICE",
      monId: "eevee",
      name,
    });
    assert.equal(next.run.party[0].name, name);
  }
});

test("evolução e aprendizado retomam o ginásio pendente após reload", () => {
  let s = drafted();
  s.run.party = [makeMon("Eevee", 29, "eevee")];
  s.run.position = 2;
  train(s.run, 1);
  beginBattle(s.run, "gym");
  assert.equal(s.run.phase, "evolution-choice");
  const storage = memory();
  writeSave(storage, s);
  s = loadSave(storage);
  assert.equal(s.run.pendingBattleKind, "gym");
  s = reducer(s, {
    type: "EVOLUTION_CHOICE",
    monId: "eevee",
    name: "Vaporeon",
  });
  let n = 0;
  while (s.run.pendingMoveChoices.length && n++ < 30)
    s = reducer(s, { type: "MOVE_CHOICE", skip: true });
  assert.equal(s.run.phase, "battle");
  assert.equal(s.run.battle.player[0].name, "Vaporeon");
});

test("pesca exige terceira insígnia e margem; Surf exige quinta e compartilha encontro", () => {
  let s = drafted();
  s.run.badges = 3;
  createRoute(s.run);
  assert.equal(s.run.encounters.length, 3);
  s = reducer(s, { type: "EXPLORE" });
  assert.equal(reducer(s, { type: "LAKE_ENCOUNTER", method: "fish" }), s);
  s.run.exploration.x = 8;
  s.run.exploration.y = 3;
  assert.equal(reducer(s, { type: "MOVE_ROUTE", dx: 1, dy: 0 }), s);
  assert.equal(reducer(s, { type: "LAKE_ENCOUNTER", method: "surf" }), s);
  s.run.badges = 2;
  assert.equal(reducer(s, { type: "LAKE_ENCOUNTER", method: "fish" }), s);
  s.run.badges = 3;
  const spent = s.run.spent,
    week = s.run.week;
  s = reducer(s, { type: "LAKE_ENCOUNTER", method: "fish" });
  assert.equal(s.run.phase, "encounter");
  assert.equal(s.run.exploration.activeIndex, 2);
  s = reducer(s, { type: "SKIP_ENCOUNTER" });
  s.run.badges = 5;
  assert.equal(reducer(s, { type: "LAKE_ENCOUNTER", method: "surf" }), s);
  assert.equal(s.run.week, week);
  assert.equal(s.run.spent, spent);
});

test("caminhada não rerrola rota nem permite capturar encontro ainda oculto", () => {
  let s = reducer(drafted(), { type: "EXPLORE" });
  const seed = s.run.rng;
  assert.equal(reducer(s, { type: "CAPTURE", index: 0 }), s);
  assert.equal(reducer(s, { type: "MOVE_ROUTE", dx: 2, dy: 0 }), s);
  s = reducer(s, { type: "MOVE_ROUTE", dx: 1, dy: 0 });
  assert.equal(s.run.rng, seed);
  const storage = memory();
  writeSave(storage, s);
  const restored = loadSave(storage);
  assert.deepEqual(restored.run.exploration, s.run.exploration);
  assert.deepEqual(restored.run.encounters, s.run.encounters);
});

test("lendários exigem pista e seis insígnias; existe só uma oportunidade na run", () => {
  let s = drafted();
  s.run.badges = 5;
  s.run.eventFlags["forest-clue"] = true;
  const blocked = event(structuredClone(s), "secret-mew", "approach");
  assert.equal(blocked.run.phase, "event");
  assert.equal(blocked.run.eventEncounterIndex, undefined);
  s.run.badges = 6;
  s = event(s, "secret-mew", "approach");
  assert.equal(s.run.phase, "encounter");
  const index = s.run.eventEncounterIndex;
  assert.equal(s.run.encounters[index].name, "Mew");
  assert.equal(s.run.eventFlags["legendary-attempted"], true);
  s = reducer(s, { type: "SKIP_ENCOUNTER" });
  assert.equal(s.run.encounters[index].used, true);
  const count = s.run.encounters.length;
  applyWeekEventEffect(s.run, {
    specialEncounter: { name: "Suicune", legendary: true },
  });
  assert.equal(s.run.encounters.length, count);
});

test("roubo abre batalha real e só entrega Eevee na vitória, uma vez na run", () => {
  let s = drafted();
  s.run.badges = 2;
  s = event(s, "trainer-theft", "steal");
  assert.equal(s.run.phase, "battle");
  assert.equal(s.run.eventFlags["theft-used"], true);
  assert.ok(!s.run.encounters.some((entry) => entry.theft));
  s.run.outcome = {
    winner: "Você",
    player: s.run.party.map((mon) => ({ ...mon, fainted: false })),
  };
  s.run.phase = "result";
  s = reducer(s, { type: "RESULT" });
  assert.equal(s.run.phase, "encounter");
  const index = s.run.eventEncounterIndex,
    balls = s.run.balls;
  s = reducer(s, { type: "CAPTURE", index });
  assert.equal(s.run.balls, balls - 1);
  assert.ok(s.run.party.some((mon) => mon.name === "Eevee"));
  assert.ok(s.run.collection.some((entry) => entry.kind === "theft"));
  const attempted = event(structuredClone(s), "trainer-theft", "steal");
  assert.equal(attempted.run.phase, "event");
  assert.equal(attempted.run.pendingEventReward, null);
});

test("Pokédex preserva Pokémon liberados e evoluções nos três slots", () => {
  const storage = memory();
  let first = drafted(10);
  first.run.moveLearningMode = "automatic";
  train(first.run, 6);
  writeSave(storage, first, 1);
  first.run.party = [];
  writeSave(storage, first, 1);
  const second = drafted(11);
  writeSave(storage, second, 2);
  const dex = readGlobalDex(storage);
  assert.ok(
    dex.some((entry) => entry.species === "Bulbasaur" && entry.slot === 1),
  );
  assert.ok(
    dex.some(
      (entry) => entry.species === "Ivysaur" && entry.kind === "evolution",
    ),
  );
  assert.ok(dex.some((entry) => entry.slot === 2 && entry.seed === 11));
  assert.equal(
    readGlobalDex(storage).length,
    loadSave(storage, 3).meta.dex.length,
  );
});

test("Correria compensa a semana a menos com +1 nível por treino, sem alterar o Clássico", () => {
  const normal = drafted(101),
    rush = structuredClone(normal);
  normal.run.moveLearningMode = rush.run.moveLearningMode = "automatic";
  normal.run.lastAmbush = rush.run.lastAmbush = 999;
  rush.run.mode = "rush";
  const a = reducer(normal, { type: "TRAIN" }),
    b = reducer(rush, { type: "TRAIN" });
  assert.equal(b.run.party[0].level, a.run.party[0].level + 1);
  assert.equal(b.run.spent, a.run.spent);
});

test("evolução adiada pode ser reaberta gratuitamente, inclusive no nível 100", () => {
  let s = drafted();
  s.run.moveLearningMode = "automatic";
  s.run.party = [makeMon("Eevee", 100, "eevee")];
  train(s.run, 0);
  s = reducer(s, { type: "EVOLUTION_CHOICE", monId: "eevee", defer: true });
  const week = s.run.week,
    rng = s.run.rng;
  s = reducer(s, { type: "EVOLUTION_REQUEST", monId: "eevee" });
  assert.equal(s.run.pendingEvolutionChoices.length, 1);
  assert.equal(s.run.week, week);
  assert.equal(s.run.rng, rng);
  s = reducer(s, { type: "EVOLUTION_CHOICE", monId: "eevee", name: "Sylveon" });
  assert.equal(s.run.party[0].name, "Sylveon");
});

test("Surf usa outra seleção e libera andar sobre a água, sem renovar capturas", () => {
  let s = drafted();
  s.run.badges = 5;
  createRoute(s.run);
  s = reducer(s, { type: "EXPLORE" });
  s.run.exploration.x = 8;
  s.run.exploration.y = 3;
  const expected = s.run.encounters[2].surfName;
  s = reducer(s, { type: "LAKE_ENCOUNTER", method: "surf" });
  assert.equal(s.run.encounters[2].name, expected);
  assert.ok(s.run.exploration.surfing);
  s = reducer(s, { type: "SKIP_ENCOUNTER" });
  s = reducer(s, { type: "MOVE_ROUTE", dx: 1, dy: 0 });
  assert.equal(s.run.exploration.x, 9);
  s = reducer(s, { type: "MOVE_ROUTE", dx: -1, dy: 0 });
  assert.equal(s.run.exploration.surfing, false);
  assert.equal(reducer(s, { type: "LAKE_ENCOUNTER", method: "surf" }), s);
});
