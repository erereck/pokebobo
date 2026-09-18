import test from "node:test";
import assert from "node:assert/strict";
import catalog from "../src/game/catalog.json" with { type: "json" };
import { makeMon } from "../src/game/pokemon/createPokemon.js";
import { growWithLearning } from "../src/game/pokemon/moveLearning.js";
import { train } from "../src/game/career/training.js";
import { reducer } from "../src/game/state/reducer.js";
import { drafted } from "./helpers/campaign.js";

test("subir de nível enfileira golpes novos em vez de trocar moveset sozinho", () => {
  const data = catalog.Bulbasaur;
  const candidate = data.moves.find((move) => move.level > 1 && move.level < 16);
  assert.ok(candidate, "Bulbasaur precisa ter ao menos um golpe de nível antes da evolução");
  const mon = makeMon("Bulbasaur", Math.max(1, candidate.level - 1), "learn");
  const originalMoves = [...mon.moves];
  const run = { pendingMoveChoices: [], pendingBattleKind: null };
  const next = growWithLearning(run, mon, 1);
  assert.deepEqual(next.moves, originalMoves);
  assert.ok(run.pendingMoveChoices.some((choice) => choice.monId === "learn"));
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
