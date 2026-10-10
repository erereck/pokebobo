import test from "node:test";
import assert from "node:assert/strict";
import { makeMon } from "../src/game/pokemon/createPokemon.js";
import { startBattle } from "../src/game/battle/startBattle.js";
import { restoreBattle } from "../src/game/battle/restore.js";
import { battleSnapshot } from "../src/game/battle/snapshot.js";
import {
  applyBattleEvent,
  newBattleEvents,
} from "../src/features/battle/turnPresentation.js";

const mon = (name, id, moves) => ({ ...makeMon(name, 50, id), moves });
function spec() {
  return {
    name: "Verificação",
    seed: [1, 2, 3, 4],
    choices: [],
    player: [
      mon("Alakazam", "mon0", ["futuresight", "splash"]),
      mon("Blastoise", "mon1", ["splash"]),
    ],
    enemy: [
      mon("Lapras", "foe0", ["splash"]),
      mon("Slowbro", "foe1", ["splash"]),
    ],
  };
}
function snapshot(choices, base = spec()) {
  const b = restoreBattle({ ...base, choices });
  try {
    return battleSnapshot(b);
  } finally {
    b.destroy();
  }
}

test("Future Sight cobra PP ao preparar e causa dano só no fim do terceiro turno", () => {
  const before = snapshot([]),
    prepared = snapshot(["move 1"]),
    waiting = snapshot(["move 1", "move 2"]),
    hit = snapshot(["move 1", "move 2", "move 2"]);
  assert.equal(prepared.foe.hp, before.foe.hp);
  assert.equal(waiting.foe.hp, before.foe.hp);
  assert.equal(
    prepared.request.active[0].moves[0].pp,
    before.request.active[0].moves[0].pp - 1,
  );
  assert.deepEqual(prepared.futureMoves, [
    { side: "enemy", move: "Future Sight", turnsRemaining: 2 },
  ]);
  assert.equal(waiting.futureMoves[0].turnsRemaining, 1);
  assert.equal(hit.turn, 4);
  assert.ok(hit.foe.hp > 0 && hit.foe.hp < before.foe.hp);
  assert.deepEqual(hit.futureMoves, []);
  const events = newBattleEvents(waiting, hit);
  assert.equal(events.filter((e) => e.type === "damage").length, 1);
  const arrival = events.find((e) => e.type === "futurehit"),
    damage = events.find((e) => e.type === "damage");
  assert.equal(arrival.targetId, "foe0");
  assert.ok(arrival.index < damage.index);
  const visual = applyBattleEvent(waiting, arrival, hit);
  assert.equal(visual.foe.hp, waiting.foe.hp);
  assert.deepEqual(visual.futureMoves, []);
  assert.equal(applyBattleEvent(visual, damage, hit).foe.hp, hit.foe.hp);
});

test("Future Sight atinge o ocupante do lado após troca, mesmo com o lançador fora", () => {
  const b = startBattle(spec());
  try {
    b.makeChoices("move 1", "move 1");
    const laprasHP = b.p2.pokemon.find((p) => p.name === "foe0").hp;
    b.makeChoices("switch 2", "switch 2");
    const hp = b.p2.active[0].hp;
    b.makeChoices("move 1", "move 1");
    assert.equal(b.p1.active[0].species.name, "Blastoise");
    assert.equal(b.p2.active[0].species.name, "Slowbro");
    assert.ok(b.p2.active[0].hp < hp);
    assert.equal(b.p2.pokemon.find((p) => p.name === "foe0").hp, laprasHP);
    const hit = battleSnapshot(b).events.find((e) => e.type === "futurehit");
    assert.equal(hit.targetId, "foe1");
    assert.match(hit.text, /Slowbro/);
  } finally {
    b.destroy();
  }
});

test("Future Sight respeita imunidade Dark no impacto e não vira dano fantasma", () => {
  const base = spec();
  base.enemy = [mon("Umbreon", "foe0", ["splash"])];
  const before = snapshot([], base),
    after = snapshot(["move 1", "move 2", "move 2"], base);
  assert.equal(after.foe.hp, before.foe.hp);
  assert.equal(after.events.filter((e) => e.type === "damage").length, 0);
  assert.ok(after.log.includes("Não teve efeito."));
  assert.deepEqual(after.futureMoves, []);
});

test("Future Sight atravessa Protect no turno de chegada", () => {
  const base = spec();
  base.enemy = [mon("Lapras", "foe0", ["protect", "splash"])];
  const b = startBattle(base);
  try {
    b.makeChoices("move 1", "move 1");
    b.makeChoices("move 2", "move 2");
    const hp = b.p2.active[0].hp;
    b.makeChoices("move 2", "move 1");
    assert.ok(
      b.log.some((l) => l.startsWith("|-singleturn|p2a: foe0|Protect")),
    );
    assert.ok(b.p2.active[0].hp < hp);
  } finally {
    b.destroy();
  }
});

test("nova tentativa não empilha nem adia Future Sight já preparado", () => {
  const after = snapshot(["move 1", "move 1"]),
    hit = snapshot(["move 1", "move 1", "move 2"]);
  assert.equal(after.events.filter((e) => e.type === "futurestart").length, 1);
  assert.ok(after.log.some((l) => l.includes("Já existe um ataque preparado")));
  assert.equal(after.futureMoves[0].turnsRemaining, 1);
  assert.ok(hit.foe.hp < hit.foe.maxhp);
  assert.equal(hit.events.filter((e) => e.type === "futurehit").length, 1);
});

test("save/reload preserva Future Sight pendente, alvo e dano sem novo sorteio", () => {
  const base = spec();
  base.choices = ["move 1", "move 2"];
  const original = restoreBattle(base),
    restored = restoreBattle(JSON.parse(JSON.stringify(base)));
  try {
    assert.deepEqual(battleSnapshot(original), battleSnapshot(restored));
    original.makeChoices("move 2", "move 1");
    restored.makeChoices("move 2", "move 1");
    assert.deepEqual(battleSnapshot(original), battleSnapshot(restored));
  } finally {
    original.destroy();
    restored.destroy();
  }
});

test("Future Sight adversário sinaliza e atinge o lado do jogador", () => {
  const base = spec();
  base.enemy = [mon("Alakazam", "foe0", ["futuresight", "splash"])];
  base.player = [mon("Lapras", "mon0", ["splash"])];
  const waiting = snapshot(["move 1", "move 1"], base),
    hit = snapshot(["move 1", "move 1", "move 1"], base);
  assert.equal(waiting.futureMoves[0].side, "player");
  assert.equal(waiting.active.hp, waiting.active.maxhp);
  assert.ok(hit.active.hp < hit.active.maxhp);
  assert.equal(hit.events.find((e) => e.type === "futurehit").side, "player");
  assert.deepEqual(hit.futureMoves, []);
});
