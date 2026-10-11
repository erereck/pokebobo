import test from "node:test";
import assert from "node:assert/strict";
import { presentationEvents } from "../src/game/battle/presentationEvents.js";
import {
  battleVisual,
  moveVisualProfile,
  EFFECT_PALETTES,
} from "../src/features/battle/visuals/moveVisualProfile.js";
import { drawBattleEffect } from "../src/features/battle/visuals/drawBattleEffect.js";
import { effectAnchor } from "../src/features/battle/visuals/effectAnchors.js";
import {
  battleEffect,
  battleEventDuration,
} from "../src/features/battle/turnPresentation.js";
import {
  readBattleSpeed,
  writeBattleSpeed,
} from "../src/app/preferences/battleSpeed.js";
import catalog from "../src/game/catalog.json" with { type: "json" };
import { startBattle } from "../src/game/battle/startBattle.js";
import { makeMon } from "../src/game/pokemon/createPokemon.js";

test("Protect e impedimentos reais são narrados sem fingir dano ou golpe lançado", () => {
  const spec = {
    name: "Protocolo",
    seed: [1, 2, 3, 4],
    player: [{ ...makeMon("Blastoise", 50, "mon0"), moves: ["tackle"] }],
    enemy: [{ ...makeMon("Lapras", 50, "foe0"), moves: ["protect"] }],
  };
  const battle = startBattle(spec);
  try {
    const hp = battle.p2.active[0].hp;
    battle.makeChoices("move 1", "move 1");
    const events = presentationEvents(battle.log);
    assert.equal(battle.p2.active[0].hp, hp);
    assert.equal(
      events.find((e) => e.type === "move" && e.side === "player").outcome,
      "blocked",
    );
    assert.ok(
      events.some((e) => e.text?.includes("bloqueou o golpe com Protect")),
    );
    assert.equal(
      events.filter((e) => e.type === "damage" && e.side === "enemy").length,
      0,
    );
  } finally {
    battle.destroy();
  }
  const sleeping = startBattle({
    ...spec,
    player: [{ ...makeMon("Alakazam", 50, "mon0"), moves: ["spore"] }],
    enemy: [{ ...makeMon("Lapras", 50, "foe0"), moves: ["splash"] }],
  });
  try {
    sleeping.makeChoices("move 1", "move 1");
    const events = presentationEvents(sleeping.log);
    assert.ok(
      events.some(
        (e) => e.side === "enemy" && e.text?.includes("está dormindo"),
      ),
    );
    assert.equal(
      events.filter((e) => e.type === "move" && e.side === "enemy").length,
      0,
    );
  } finally {
    sleeping.destroy();
  }
});

test("dano residual tem origem legível, HP real e não recebe evento de ataque inventado", () => {
  const events = presentationEvents([
    "|switch|p2a: foe0|Lapras, L50|100/100",
    "|-damage|p2a: foe0|94/100 brn|[from] brn",
  ]);
  assert.match(events[1].text, /queimadura/);
  assert.equal(events[1].health.hp, 94);
  assert.equal(events.filter((e) => e.type === "move").length, 0);
});

test("protocolo visual identifica fonte/alvo, erro, falha e preparação sem inventar dano", () => {
  const log = [
    "|move|p1a: mon0|Water Gun|p2a: foe0",
    "|-miss|p1a: mon0|p2a: foe0",
    "|move|p2a: foe0|Protect|p2a: foe0",
    "|-fail|p2a: foe0",
    "|move|p1a: mon0|Fly|p2a: foe0|[still]",
    "|-prepare|p1a: mon0|Fly|p2a: foe0",
  ];
  const before = structuredClone(log),
    events = presentationEvents(log);
  assert.deepEqual(log, before);
  const moves = events.filter((e) => e.type === "move");
  assert.equal(moves[0].side, "player");
  assert.equal(moves[0].targetSide, "enemy");
  assert.equal(moves[0].recipientId, "foe0");
  assert.equal(moves[0].outcome, "miss");
  assert.equal(moves[1].outcome, "fail");
  assert.equal(moves[1].targetSide, "enemy");
  assert.equal(moves[2].outcome, "prepare");
  assert.equal(battleVisual(moves[2]).shape, "charge");
  assert.equal(events.filter((e) => e.type === "damage").length, 0);
});

test("Future Sight imune não transforma o último Splash em golpe que falhou", () => {
  const events = presentationEvents([
    "|move|p1a: mon0|Splash|p1a: mon0",
    "|-end|p1a: mon0|move: Future Sight",
    "|-immune|p1a: mon0",
  ]);
  assert.equal(events[0].outcome, undefined);
  assert.equal(battleVisual(events[1]).shape, "arrival");
});

test("todos os golpes do catálogo têm perfil visual e as famílias preservam sua identidade", () => {
  for (const mon of Object.values(catalog))
    for (const move of mon.moves) {
      const profile = moveVisualProfile(move.name);
      assert.equal(profile.type, move.type, move.name);
      assert.equal(profile.category, move.category, move.name);
      assert.ok(profile.palette.length === 2 && profile.shape);
    }
  assert.equal(moveVisualProfile("Flamethrower").shape, "beam");
  assert.equal(moveVisualProfile("Protect").shape, "shield");
  assert.equal(moveVisualProfile("Recover").shape, "heal");
  assert.equal(moveVisualProfile("Future Sight").shape, "charge");
  assert.equal(moveVisualProfile("Splash").shape, "splash");
  assert.equal(moveVisualProfile("Unknown move").type, "Normal");
  assert.equal(
    battleEffect({ type: "move", side: "player", move: "Protect" }).type,
    "cast",
  );
  assert.equal(
    battleEffect({ type: "move", side: "player", move: "Tackle" }).type,
    "attack",
  );
});

function context() {
  const calls = [],
    state = { depth: 0 };
  const ctx = new Proxy(state, {
    get(target, key) {
      if (key === "save")
        return () => {
          target.depth++;
        };
      if (key === "restore")
        return () => {
          target.depth--;
        };
      if (key in target) return target[key];
      return (...args) => {
        for (const arg of args)
          if (typeof arg === "number")
            assert.ok(Number.isFinite(arg), `${key}: ${arg}`);
        calls.push([key, ...args]);
      };
    },
    set(target, key, value) {
      if (key === "globalAlpha") assert.ok(value >= 0 && value <= 1);
      target[key] = value;
      return true;
    },
  });
  return { ctx, calls, state };
}
test("efeitos dos 18 tipos e casos especiais são determinísticos, finitos e limitados por frame", () => {
  const anchors = {
    player: { x: 70, y: 120, size: 55 },
    enemy: { x: 270, y: 50, size: 40 },
  };
  const cases = [];
  for (const [type, palette] of Object.entries(EFFECT_PALETTES))
    for (const shape of ["projectile", "beam", "strike"])
      cases.push({ side: "player", targetSide: "enemy", type, palette, shape });
  for (const shape of [
    "shield",
    "heal",
    "boost",
    "unboost",
    "splash",
    "charge",
    "arrival",
    "aura",
    "impact",
    "status",
  ])
    cases.push({
      side: "enemy",
      targetSide: "enemy",
      type: "Psychic",
      palette: EFFECT_PALETTES.Psychic,
      shape,
      status: "slp",
    });
  for (const effect of cases)
    for (const progress of [0, 0.1, 0.4, 0.7, 0.99, 1]) {
      const a = context(),
        b = context();
      drawBattleEffect(a.ctx, effect, progress, anchors);
      drawBattleEffect(b.ctx, effect, progress, anchors);
      assert.deepEqual(a.calls, b.calls);
      assert.equal(a.state.depth, 0);
      assert.ok(
        a.calls.length < 220,
        `${effect.type}/${effect.shape}: ${a.calls.length}`,
      );
    }
  const empty = context();
  drawBattleEffect(empty.ctx, cases[0], 0.5, {});
  assert.equal(empty.calls.length, 0);
});

test("trajetória usa o corpo visível e o apoio, independentemente da margem transparente", () => {
  const box = { left: 100, bottom: 260, width: 160, height: 120 },
    arena = { left: 20, top: 40 };
  assert.deepEqual(effectAnchor(box, arena, 60, 20), {
    x: 160,
    y: 170,
    size: 60,
    width: 60,
  });
  assert.deepEqual(effectAnchor(box, arena, 60, 20, 0.5), {
    x: 80,
    y: 85,
    size: 30,
    width: 30,
  });
});

test("velocidade inválida/storage bloqueado não impede batalhar; rápido reduz todos os eventos", () => {
  const denied = {
    getItem() {
      throw Error("denied");
    },
    setItem() {
      throw Error("denied");
    },
  };
  assert.equal(readBattleSpeed(denied), "normal");
  assert.equal(writeBattleSpeed(denied, "fast"), false);
  assert.equal(readBattleSpeed({ getItem: () => "invalid" }), "normal");
  assert.equal(readBattleSpeed({ getItem: () => "fast" }), "fast");
  for (const type of ["move", "damage", "heal", "faint", "switch", "futurehit"])
    assert.ok(battleEventDuration(type, "fast") < battleEventDuration(type));
});
