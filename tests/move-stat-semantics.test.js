import test from "node:test";
import assert from "node:assert/strict";
import { restoreBattle } from "../src/game/battle/restore.js";
import { makeMon } from "../src/game/pokemon/createPokemon.js";

function damage(move, change) {
  const battle = restoreBattle({
    seed: [1, 2, 3, 4],
    choices: [],
    player: [{ ...makeMon("Slowbro", 50, "user"), moves: [move] }],
    enemy: [{ ...makeMon("Slowbro", 50, "target"), moves: ["splash"] }],
  });
  try {
    const user = battle.p1.active[0];
    const target = battle.p2.active[0];
    for (const mon of [user, target])
      Object.assign(mon.storedStats, { atk: 50, def: 100, spa: 100, spd: 100, spe: 100 });
    change?.(user, target);
    return battle.actions.getDamage(user, target, move);
  } finally {
    battle.destroy();
  }
}

test("Body Press usa Defesa do usuário, Foul Play Ataque do alvo e Psyshock Defesa do alvo no motor real", () => {
  const press = damage("bodypress");
  assert.equal(damage("bodypress", user => { user.storedStats.atk = 300; }), press);
  assert.ok(damage("bodypress", user => { user.storedStats.def = 300; }) > press * 2);
  assert.ok(damage("bodypress", user => { user.boosts.def = 2; }) > press);

  const foul = damage("foulplay");
  assert.equal(damage("foulplay", user => { user.storedStats.atk = 300; }), foul);
  assert.ok(damage("foulplay", (_, target) => { target.storedStats.atk = 300; }) > foul * 2);
  assert.ok(damage("foulplay", (_, target) => { target.boosts.atk = 2; }) > foul);

  const shock = damage("psyshock");
  assert.equal(damage("psyshock", (_, target) => { target.storedStats.spd = 300; }), shock);
  assert.ok(damage("psyshock", (_, target) => { target.storedStats.def = 300; }) < shock / 2);
});
