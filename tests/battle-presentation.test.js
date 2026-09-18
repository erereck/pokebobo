import test from "node:test";
import assert from "node:assert/strict";
import { presentationEvents } from "../src/game/battle/presentationEvents.js";
import {
  applyBattleEvent,
  newBattleEvents,
} from "../src/features/battle/turnPresentation.js";

test("eventos de apresentação preservam ordem, lado e HP do protocolo", () => {
  const events = presentationEvents([
    "|switch|p1a: mon0|Bulbasaur, L10|30/30",
    "|switch|p2a: foe0|Charmander, L10|28/28",
    "|move|p1a: mon0|Tackle|p2a: foe0",
    "|-damage|p2a: foe0|17/28",
    "|-status|p2a: foe0|par",
    "|faint|p2a: foe0",
  ]);
  assert.deepEqual(
    events.map((event) => event.type),
    ["switch", "switch", "move", "damage", "status", "faint"],
  );
  assert.equal(events[2].text, "Seu Bulbasaur usou Tackle.");
  assert.equal(events[3].side, "enemy");
  assert.equal(events[3].health.hp, 17);
  assert.equal(events[4].status, "par");
  assert.equal(events[5].text, "Charmander rival caiu!");
});

test("split usa apenas a leitura privada de HP e não duplica dano", () => {
  const events = presentationEvents([
    "|switch|p1a: mon0|Squirtle, L10|30/30",
    "|split|p1",
    "|-damage|p1a: mon0|11/30",
    "|-damage|p1a: mon0|37%",
    "|move|p1a: mon0|Tackle|p2a: foe0",
  ]);
  const damage = events.filter((event) => event.type === "damage");
  assert.equal(damage.length, 1);
  assert.equal(damage[0].health.hp, 11);
  assert.equal(events.at(-1).type, "move");
});

test("aplicação visual altera HP, status, queda e troca sem tocar no snapshot original", () => {
  const before = {
    active: {
      id: "mon0",
      name: "Bulbasaur",
      hp: 30,
      maxhp: 30,
      status: "",
      fainted: false,
      active: true,
    },
    foe: {
      id: "foe0",
      name: "Charmander",
      hp: 28,
      maxhp: 28,
      status: "",
      fainted: false,
      active: true,
    },
    player: [],
    enemy: [
      {
        id: "foe0",
        name: "Charmander",
        hp: 28,
        maxhp: 28,
        status: "",
        fainted: false,
        active: true,
      },
      {
        id: "foe1",
        name: "Pidgey",
        hp: 25,
        maxhp: 25,
        status: "",
        fainted: false,
        active: false,
      },
    ],
  };
  const finalSnapshot = {
    ...structuredClone(before),
    foe: {
      id: "foe1",
      name: "Pidgey",
      hp: 25,
      maxhp: 25,
      status: "",
      fainted: false,
      active: true,
    },
    enemy: before.enemy.map((mon) => ({
      ...mon,
      active: mon.id === "foe1",
    })),
  };
  let shown = applyBattleEvent(
    before,
    {
      type: "damage",
      side: "enemy",
      targetId: "foe0",
      health: { hp: 4, maxhp: 28, status: "" },
    },
    finalSnapshot,
  );
  shown = applyBattleEvent(
    shown,
    {
      type: "status",
      side: "enemy",
      targetId: "foe0",
      status: "par",
    },
    finalSnapshot,
  );
  shown = applyBattleEvent(
    shown,
    { type: "faint", side: "enemy", targetId: "foe0" },
    finalSnapshot,
  );
  shown = applyBattleEvent(
    shown,
    {
      type: "switch",
      side: "enemy",
      targetId: "foe1",
      name: "Pidgey",
      health: { hp: 25, maxhp: 25, status: "" },
    },
    finalSnapshot,
  );
  assert.equal(before.foe.hp, 28);
  assert.equal(shown.enemy[0].hp, 0);
  assert.equal(shown.enemy[0].status, "par");
  assert.equal(shown.foe.name, "Pidgey");
  assert.equal(shown.foe.active, true);
});

test("somente eventos posteriores ao snapshot atual entram na animação", () => {
  const before = { events: [{ index: 4 }, { index: 7 }] };
  const after = {
    events: [{ index: 4 }, { index: 7 }, { index: 8 }, { index: 12 }],
  };
  assert.deepEqual(
    newBattleEvents(before, after).map((event) => event.index),
    [8, 12],
  );
});
