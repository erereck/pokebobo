import test from "node:test";
import assert from "node:assert/strict";
import { battleSwitchChoice } from "../src/features/battle/sidebarBattle.js";
import { combatantSpriteVisible } from "../src/features/battle/combatantVisibility.js";

const snap = {
  player: [
    { id: "mon0", active: true, fainted: false },
    { id: "mon1", active: false, fainted: false },
    { id: "mon2", active: false, fainted: true },
  ],
  request: { active: [{ trapped: false }] },
};

test("Equipe Conectada converte reserva apta em escolha de switch", () => {
  assert.equal(battleSwitchChoice(snap, "mon1"), "switch 2");
  assert.equal(battleSwitchChoice(snap, "mon0"), null);
  assert.equal(battleSwitchChoice(snap, "mon2"), null);
  assert.equal(battleSwitchChoice(snap, "mon1", { locked: true }), null);
});

test("aprisionamento bloqueia troca normal mas não a troca forçada", () => {
  const trapped = structuredClone(snap);
  trapped.request.active[0].trapped = true;
  assert.equal(battleSwitchChoice(trapped, "mon1"), null);
  trapped.request.forceSwitch = [true];
  assert.equal(battleSwitchChoice(trapped, "mon1"), "switch 2");
});

test("sprite desmaiado só permanece durante a animação de queda", () => {
  const fainted = { fainted: true };
  assert.equal(
    combatantSpriteVisible(fainted, { type: "faint", side: "enemy" }, "enemy"),
    true,
  );
  assert.equal(combatantSpriteVisible(fainted, null, "enemy"), false);
  assert.equal(
    combatantSpriteVisible(fainted, { type: "message", side: "enemy" }, "enemy"),
    false,
  );
  assert.equal(combatantSpriteVisible({ fainted: false }, null, "enemy"), true);
});
