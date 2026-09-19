import test from "node:test";
import assert from "node:assert/strict";
import catalog from "../src/game/catalog.json" with { type: "json" };
import { makeMon } from "../src/game/pokemon/createPokemon.js";
import { growWithLearning } from "../src/game/pokemon/moveLearning.js";
import { movesFor } from "../src/game/pokemon/moves.js";
import { train } from "../src/game/career/training.js";
import { reducer } from "../src/game/state/reducer.js";
import { drafted } from "./helpers/campaign.js";

test("golpe novo aprende direto quando existe slot livre", () => {
  const data = catalog.Bulbasaur;
  const candidate = data.moves.find((move) => move.level > 1 && move.level < 16);
  assert.ok(candidate, "Bulbasaur precisa ter ao menos um golpe de nível antes da evolução");
  const mon = makeMon("Bulbasaur", Math.max(1, candidate.level - 1), "learn");
  mon.moves = data.moves
    .filter((move) => move.level <= mon.level && move.id !== candidate.id)
    .slice(0, 3)
    .map((move) => move.id);
  if (!mon.moves.length) mon.moves = ["tackle"];
  const run = { pendingMoveChoices: [], pendingBattleKind: null };
  const next = growWithLearning(run, mon, 1);
  assert.equal(next.moves.includes(candidate.id), true);
  assert.equal(run.pendingMoveChoices.length, 0);
});

test("golpe novo só vira decisão quando os quatro slots estão ocupados", () => {
  const data = catalog.Bulbasaur;
  const candidate = data.moves.find((move) => move.level > 1 && move.level < 16);
  assert.ok(candidate);
  const mon = makeMon("Bulbasaur", Math.max(1, candidate.level - 1), "full");
  mon.moves = ["slot1", "slot2", "slot3", "slot4"];
  const run = { pendingMoveChoices: [], pendingBattleKind: null };
  const next = growWithLearning(run, mon, 1);
  assert.deepEqual(next.moves, mon.moves);
  assert.equal(run.pendingMoveChoices.length, 1);
  assert.equal(run.pendingMoveChoices[0].moveId, candidate.id);
});

test("modo automático recalcula o moveset sozinho e nunca abre decisão", () => {
  const mon = makeMon("Bulbasaur", 14, "auto");
  mon.moves = ["slot1", "slot2", "slot3", "slot4"];
  const run = {
    moveLearningMode: "automatic",
    pendingMoveChoices: [],
    pendingBattleKind: null,
  };
  const next = growWithLearning(run, mon, 1);
  assert.deepEqual(next.moves, movesFor(next.name, next.level));
  assert.equal(run.pendingMoveChoices.length, 0);
});

test("reserva de três slots acompanha os níveis da equipe", () => {
  const run = {
    party: [makeMon("Bulbasaur", 10, "party")],
    box: [makeMon("Pikachu", 20, "box")],
    pendingMoveChoices: [],
    pendingBattleKind: null,
  };
  train(run, 2);
  assert.equal(run.party[0].level, 12);
  assert.equal(run.box[0].level, 22);
});

test("equipe pode mandar, trazer e trocar Pokémon com a reserva sem gastar semana", () => {
  let s = drafted(606);
  s.run.party.push(makeMon("Pidgey", 12, "extra"));
  const week = s.run.week;
  s = reducer(s, { type: "BOX_TO_RESERVE", id: "extra" });
  assert.equal(s.run.box.length, 1);
  assert.equal(s.run.week, week);
  assert.equal(s.run.party.some((mon) => mon.id === "extra"), false);
  s = reducer(s, { type: "BOX_TO_PARTY", id: "extra" });
  assert.equal(s.run.box.length, 0);
  assert.equal(s.run.party.some((mon) => mon.id === "extra"), true);
});

test("reordenar a equipe muda inclusive quem abre a batalha", () => {
  let s = drafted(607);
  s.run.party.push(makeMon("Pidgey", 12, "extra"));
  const oldLead = s.run.party[0].id;
  s = reducer(s, {
    type: "REORDER_PARTY",
    sourceId: "extra",
    targetId: oldLead,
  });
  assert.equal(s.run.party[0].id, "extra");
});

test("escolha de golpe substitui exatamente o golpe selecionado", () => {
  let s = drafted(608);
  const mon = s.run.party[0];
  assert.equal(mon.moves.length > 0, true);
  while (mon.moves.length < 4) mon.moves.push(`placeholder${mon.moves.length}`);
  const learned = catalog[mon.name].moves.find((move) => !mon.moves.includes(move.id));
  assert.ok(learned);
  const forgotten = mon.moves[0];
  s.run.pendingMoveChoices = [
    { monId: mon.id, species: mon.name, moveId: learned.id, level: mon.level },
  ];
  s = reducer(s, {
    type: "MOVE_CHOICE",
    monId: mon.id,
    forgetMoveId: forgotten,
  });
  assert.equal(s.run.party[0].moves.includes(learned.id), true);
  assert.equal(s.run.party[0].moves.includes(forgotten), false);
  assert.equal(s.run.pendingMoveChoices.length, 0);
});
