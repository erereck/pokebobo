import { reducer } from "../../src/game/engine.js";
import { initialState } from "../../src/game/engine.js";
import { Dex } from "@pkmn/sim";
import { restoreBattle } from "../../src/game/battle.js";
import assert from "node:assert/strict";

export function drafted(seed = 1234) {
  let s = reducer(initialState(), {
    type: "NEW",
    name: "Teste",
    seed,
  });
  s = reducer(s, {
    type: "ORIGIN",
    id: "pallet",
  });
  s = reducer(s, {
    type: "STARTER",
    name: "Bulbasaur",
  });
  while (s.run.phase === "draft")
    s = reducer(s, {
      type: "DRAFT",
      id: s.run.offers[0],
    });
  return reducer(s, {
    type: "BEGIN",
  });
}
export function best(b) {
  const r = b.p1.activeRequest;
  if (r.forceSwitch)
    return `switch ${b.p1.pokemon.findIndex((m) => !m.fainted && !m.isActive) + 1}`;
  const target = b.p2.active[0];
  const moves = r.active[0].moves
    .map((m, i) => {
      const d = Dex.moves.get(m.id);
      return {
        i,
        valid: !m.disabled && m.pp > 0,
        score:
          (d.basePower || 0) *
          (Dex.getImmunity(d.type, target)
            ? 2 ** Dex.getEffectiveness(d.type, target)
            : 0) *
          (b.p1.active[0].types.includes(d.type) ? 1.5 : 1),
      };
    })
    .filter((m) => m.valid)
    .sort((a, b) => b.score - a.score);
  return `move ${(moves[0]?.i || 0) + 1}`;
}
export function finishBattle(s) {
  let n = 0;
  while (s.run.phase === "battle" && n++ < 250) {
    const b = restoreBattle(s.run.battle);
    const choice = best(b);
    b.destroy();
    s = reducer(s, {
      type: "BATTLE_CHOICE",
      choice,
    });
  }
  assert.equal(s.run.phase, "result");
  return reducer(s, {
    type: "RESULT",
  });
}
