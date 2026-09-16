import test from "node:test";
import { drafted } from "./helpers/campaign.js";
import { makeMon } from "../src/game/pokemon.js";
import { reducer } from "../src/game/engine.js";
import { finishBattle } from "./helpers/campaign.js";
import assert from "node:assert/strict";
import { startBattle } from "../src/game/battle/startBattle.js";
import { battleSnapshot } from "../src/game/battle/snapshot.js";
import { battleVictory } from "../src/game/selectors/battleVictory.js";

test("Nuzlocke remove Pokémon caído após uma vitória", () => {
  let s = drafted();
  s.run.mode = "nuzlocke";
  s.run.position = 2;
  s.run.party = [
    makeMon("Magikarp", 1, "mon0"),
    makeMon("Blastoise", 100, "mon1"),
  ];
  s = reducer(s, {
    type: "CHALLENGE",
  });
  s = finishBattle(s);
  assert.equal(s.run.phase, "career");
  assert.equal(s.run.party.length, 1);
  assert.equal(s.run.party[0].id, "mon1");
  assert.equal(s.run.badges, 1);
});

test("último Pokémon cai por recoil: Nuzlocke termina mesmo com vitória do motor", () => {
  const state = drafted();
  state.run.mode = "nuzlocke";
  const spec = {
    name: "Teste",
    seed: [1, 2, 3, 4],
    player: [{ ...makeMon("Incineroar", 100, "mon0"), moves: ["flareblitz"] }],
    enemy: [{ ...makeMon("Caterpie", 1, "foe0"), moves: ["tackle"] }],
    choices: [],
    kind: "gym",
  };
  const battle = startBattle(spec);
  battle.p1.active[0].hp = 1;
  battle.makeChoices("move 1", "move 1");
  const outcome = battleSnapshot(battle);
  assert.equal(outcome.winner, "Você");
  assert.equal(outcome.player[0].fainted, true);
  battle.destroy();
  state.run.party = spec.player;
  state.run.battle = spec;
  state.run.outcome = outcome;
  state.run.phase = "result";
  assert.equal(battleVictory(state.run), false);
  const ended = reducer(state, { type: "RESULT" });
  assert.equal(ended.run.phase, "ended");
  assert.equal(ended.run.won, false);
  assert.equal(ended.run.badges, 0);
  assert.match(ended.run.notice, /sem sobreviventes/);
  state.run.mode = "normal";
  assert.equal(battleVictory(state.run), true);
});
