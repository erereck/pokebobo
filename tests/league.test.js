import test from "node:test";
import { drafted } from "./helpers/campaign.js";
import { makeMon } from "../src/game/pokemon.js";
import { reducer } from "../src/game/engine.js";
import { finishBattle } from "./helpers/campaign.js";
import assert from "node:assert/strict";
import { weekLimit } from "../src/game/engine.js";

test("campanha completa: 8 ginásios, 4 Elite, campeão e modos desbloqueados", () => {
  let s = drafted(811);
  s.run.party = [
    "Venusaur",
    "Charizard",
    "Blastoise",
    "Alakazam",
    "Gengar",
    "Dragonite",
  ].map((n, i) => makeMon(n, 100, `mon${i}`));
  s.run.position = 2;
  for (let i = 0; i < 8; i++) {
    s = reducer(s, {
      type: "CHALLENGE",
    });
    s = finishBattle(s);
    assert.equal(s.run.badges, i + 1);
  }
  assert.equal(s.run.inLeague, true);
  assert.equal(s.run.league.length, 5);
  for (let i = 0; i < 5; i++) {
    s = reducer(s, {
      type: "CHALLENGE",
    });
    s = finishBattle(s);
  }
  assert.equal(s.run.phase, "ended");
  assert.equal(s.run.won, true);
  assert.equal(s.meta.wins, 1);
  const next = reducer(s, {
    type: "NEW",
    mode: "rush",
    seed: 3,
  });
  assert.equal(weekLimit(next.run), 2);
  assert.equal(s.meta.history[0].won, true);
  assert.equal(typeof s.meta.history[0].team[0], "object");
  assert.equal(s.meta.history[0].team[0].level, 100);
  assert.equal(s.meta.history[0].route.length, 10);
  assert.equal(s.meta.history[0].reason, "champion");
});
