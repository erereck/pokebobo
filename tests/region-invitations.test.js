import test from "node:test";
import assert from "node:assert/strict";
import { initialState, reducer } from "../src/game/engine.js";
import {
  regionChallengeOf,
  validateRegionChallenge,
  challengeRoute,
} from "../src/game/world/regionChallenge.js";
import {
  encodeInvitation,
  parseInvitation,
  invitationLink,
  invitationFromLocation,
} from "../src/shared/regionInvitation.js";
import { migrateSave } from "../src/game/persistence/migrateSave.js";
import { finishRun } from "../src/game/career/finishRun.js";
import { restoreBattle } from "../src/game/battle.js";

function ready(seed = 1234, mode = "normal", runs = 0) {
  const initial = initialState();
  initial.meta.runs = runs;
  initial.meta.wins = mode === "normal" ? 0 : 1;
  let state = reducer(initial, { type: "NEW", seed, mode });
  state = reducer(state, { type: "ORIGIN", id: state.run.offers[0] });
  state = reducer(state, {
    type: "STARTER",
    name: state.run.route[0].starters[0],
  });
  while (state.run.phase === "draft")
    state = reducer(state, { type: "DRAFT", id: state.run.offers[0] });
  return state;
}

test("convite leva as dez cidades, modo, seed e RNG inicial; sem equipe ou recursos", () => {
  let source = ready(0xffffffff, "rush", 9);
  source = reducer(source, { type: "BEGIN" });
  const challenge = regionChallengeOf(source.run);
  assert.equal(challenge.cities.length, 10);
  const parsed = parseInvitation(invitationLink(challenge));
  assert.deepEqual(parsed.challenge, challenge);
  assert.deepEqual(parseInvitation(encodeInvitation(challenge)), parsed);
  assert.equal(
    invitationFromLocation({ hash: "#desafio=" + encodeInvitation(challenge) }),
    encodeInvitation(challenge),
  );
  assert.deepEqual(Object.keys(challenge).sort(), [
    "cities",
    "format",
    "mode",
    "rng",
    "seed",
  ]);
  assert.ok(
    invitationLink(challenge).startsWith(
      "https://erereck.github.io/pokebobo/#desafio=PB1.",
    ),
  );
});

test("amigo de outro slot escolhe inicial e recebe a mesma região e sorteios, mesmo sem títulos", () => {
  for (const mode of ["normal", "rush", "nuzlocke"]) {
    let source = ready(811, mode, 7);
    source = reducer(source, { type: "BEGIN" });
    const challenge = regionChallengeOf(source.run);
    let invited = reducer(initialState(), {
      type: "NEW",
      challenge,
      name: "Amigo",
      moveLearningMode: "automatic",
    });
    assert.equal(invited.run.phase, "starter");
    assert.equal(invited.run.mode, mode);
    assert.equal(invited.meta.wins, 0);
    const starter = invited.run.route[0].starters[1];
    invited = reducer(invited, { type: "STARTER", name: starter });
    assert.equal(invited.run.phase, "ready");
    assert.equal(invited.run.party[0].name, starter);
    invited = reducer(invited, { type: "BEGIN" });
    assert.deepEqual(invited.run.route, source.run.route);
    assert.equal(invited.run.rng, source.run.rng);
    assert.deepEqual(invited.run.currentRoute, source.run.currentRoute);
    assert.deepEqual(invited.run.encounters, source.run.encounters);
    assert.deepEqual(invited.run.seenFamilies, source.run.seenFamilies);
    assert.equal(invited.run.seed, source.run.seed);
    assert.equal(invited.run.shinyRng, source.run.shinyRng);
    // Convite não desbloqueia os modos permanentemente.
    const next = reducer(invited, { type: "NEW", seed: 1234, mode: "rush" });
    assert.equal(next.run.mode, "normal");
  }
});

test("save/reload antes do inicial, depois do início e Hall preservam o convite", () => {
  const source = reducer(ready(), { type: "BEGIN" });
  const challenge = regionChallengeOf(source.run);
  let invited = reducer(initialState(), { type: "NEW", challenge });
  invited = migrateSave(JSON.parse(JSON.stringify(invited)));
  invited = reducer(invited, {
    type: "STARTER",
    name: invited.run.route[0].starters[0],
  });
  invited = reducer(invited, { type: "BEGIN" });
  invited = migrateSave(JSON.parse(JSON.stringify(invited)));
  assert.deepEqual(regionChallengeOf(invited.run), challenge);
  finishRun(invited, false, "abandoned");
  assert.deepEqual(regionChallengeOf(invited.meta.history[0]), challenge);
});

test("convite rejeita cidades desconhecidas, repetidas, fora da ordem, modos e números inválidos", () => {
  const challenge = regionChallengeOf(reducer(ready(), { type: "BEGIN" }).run);
  for (const invalid of [
    { ...challenge, seed: 0 },
    { ...challenge, seed: 2 ** 32 },
    { ...challenge, rng: 1.5 },
    { ...challenge, mode: "admin" },
    { ...challenge, format: "PB2" },
    { ...challenge, cities: challenge.cities.slice(0, 9) },
    { ...challenge, cities: ["unknown", ...challenge.cities.slice(1)] },
    {
      ...challenge,
      cities: [
        challenge.cities[0],
        challenge.cities[0],
        ...challenge.cities.slice(2),
      ],
    },
    {
      ...challenge,
      cities: [
        ...challenge.cities.slice(0, 2),
        challenge.cities[3],
        challenge.cities[2],
        ...challenge.cities.slice(4),
      ],
    },
  ]) {
    assert.equal(validateRegionChallenge(invalid), null);
    assert.deepEqual(challengeRoute(invalid), []);
    const state = initialState();
    assert.equal(reducer(state, { type: "NEW", challenge: invalid }), state);
  }
  for (const text of [
    "PB2.x.c.x.y",
    "PB1.-1.c.1.x",
    "PB1.1.c.1",
    "0",
    "4294967296",
    "1.2",
    "https://example.com/",
    "x".repeat(1801),
  ])
    assert.throws(() => parseInvitation(text));
  assert.equal(parseInvitation(""), null);
  assert.deepEqual(parseInvitation("000123"), { seed: 123, challenge: null });
  assert.deepEqual(parseInvitation("4294967295"), {
    seed: 0xffffffff,
    challenge: null,
  });
});

test("Hall antigo compartilha cidades e seed sem inventar o RNG anterior", () => {
  const source = ready();
  const legacy = { seed: 1234, mode: "normal", route: source.run.route };
  const challenge = regionChallengeOf(legacy);
  assert.equal(challenge.rng, legacy.seed);
  assert.equal(Object.hasOwn(legacy, "challengeStartRng"), false);
  assert.equal(regionChallengeOf({ seed: 1234, route: [] }), null);
});

test("seed digitada repete as ofertas e o draft entre slots com históricos diferentes", () => {
  let first = initialState(),
    second = initialState();
  second.meta.runs = 17;
  first = reducer(first, { type: "NEW", seed: 811, fixedSeedDraft: true });
  second = reducer(second, { type: "NEW", seed: 811, fixedSeedDraft: true });
  assert.deepEqual(first.run.offers, second.run.offers);
  const actBoth = (action) => {
    first = reducer(first, action);
    second = reducer(second, action);
  };
  actBoth({ type: "ORIGIN", id: first.run.offers[0] });
  actBoth({ type: "STARTER", name: first.run.route[0].starters[0] });
  while (first.run.phase === "draft") {
    assert.deepEqual(first.run.offers, second.run.offers);
    actBoth({ type: "DRAFT", id: first.run.offers[0] });
  }
  actBoth({ type: "BEGIN" });
  assert.deepEqual(first.run.route, second.run.route);
  assert.deepEqual(first.run.encounters, second.run.encounters);
  assert.equal(first.run.rng, second.run.rng);
});

test("jornada recebida chega ao primeiro ginásio, executa um turno real e restaura a batalha", () => {
  const challenge = regionChallengeOf(reducer(ready(), { type: "BEGIN" }).run);
  let state = reducer(initialState(), {
    type: "NEW",
    challenge,
    moveLearningMode: "automatic",
  });
  state = reducer(state, { type: "STARTER", name: "Squirtle" });
  state = reducer(state, { type: "BEGIN" });
  state = reducer(state, { type: "CHALLENGE" });
  state = reducer(state, { type: "CHALLENGE" });
  assert.equal(state.run.position, 2);
  state = reducer(state, { type: "CHALLENGE" });
  assert.equal(state.run.phase, "battle");
  const first = restoreBattle(state.run.battle);
  const move =
    first.p1.activeRequest.active[0].moves.findIndex(
      (move) => !move.disabled && move.pp > 0,
    ) + 1;
  first.destroy();
  state = reducer(state, { type: "BATTLE_CHOICE", choice: `move ${move}` });
  assert.equal(state.run.battle.choices.length, 1);
  const loaded = migrateSave(JSON.parse(JSON.stringify(state)));
  const before = restoreBattle(state.run.battle);
  const after = restoreBattle(loaded.run.battle);
  assert.deepEqual(after.log, before.log);
  assert.equal(after.turn, before.turn);
  assert.deepEqual(
    after.p1.pokemon.map((mon) => mon.hp),
    before.p1.pokemon.map((mon) => mon.hp),
  );
  before.destroy();
  after.destroy();
});
