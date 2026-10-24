import test from "node:test";
import assert from "node:assert/strict";
import { drafted } from "./helpers/campaign.js";
import { reducer } from "../src/game/engine.js";
import { makeMon } from "../src/game/pokemon.js";
import { startBattle } from "../src/game/battle/startBattle.js";
import { battleSnapshot } from "../src/game/battle/snapshot.js";
import { parseSaveBackup } from "../src/game/persistence/importSave.js";
import { equipmentCount } from "../src/game/equipment/equipment.js";
import { completeCapture } from "../src/game/world/completeCapture.js";
import { ELITES } from "../src/game/data/league/elites.js";
import { CHAMPIONS } from "../src/game/data/league/champions.js";
import { WEEK_EVENTS } from "../src/game/data/weekEvents.js";

function state() {
  const s = drafted(811);
  Object.assign(s.run, {
    phase: "market",
    position: 9,
    badges: 8,
    money: 3000,
    inLeague: false,
    league: [...ELITES.slice(0, 4), CHAMPIONS[0]],
    heldItems: { leftovers: 1 },
    party: [makeMon("Pikachu", 40, "p0"), makeMon("Blastoise", 40, "p1")],
    box: [makeMon("Arbok", 40, "b0")],
  });
  return s;
}
test("equipamentos exigem alvo/estoque/saldo/fase, transação atômica e estoque por jornada", () => {
  const s = state(),
    a = { type: "MARKET_BUY_ITEM", itemId: "choicescarf", monId: "b0" };
  assert.equal(reducer(s, { ...a, monId: "ausente" }), s);
  assert.equal(reducer(s, { ...a, itemId: "inválido" }), s);
  const poor = structuredClone(s);
  poor.run.money = 999;
  assert.equal(reducer(poor, a), poor);
  const next = reducer(s, a);
  assert.equal(next.run.money, 2000);
  assert.equal(next.run.box[0].item, "choicescarf");
  assert.deepEqual(next.run.marketPurchases, ["item:choicescarf"]);
  assert.deepEqual([next.run.week, next.run.rng], [s.run.week, s.run.rng]);
  assert.equal(
    reducer(next, { ...a, itemId: "Choice Scarf", monId: "p0" }),
    next,
  );
  next.run.phase = "battle";
  assert.equal(
    reducer(next, { type: "EQUIP_ITEM", itemId: "leftovers", monId: "p0" }),
    next,
  );
  next.run.phase = "career";
  next.run.inLeague = true;
  assert.equal(reducer(next, a), next);
});
test("trocar item devolve o anterior, remover não duplica e berries não viram equipamentos", () => {
  const s = state();
  s.run.party[0].item = "focussash";
  let next = reducer(s, {
    type: "EQUIP_ITEM",
    itemId: "leftovers",
    monId: "p0",
  });
  assert.equal(equipmentCount(next.run, "leftovers"), 0);
  assert.equal(equipmentCount(next.run, "focussash"), 1);
  next = reducer(next, { type: "UNEQUIP_ITEM", monId: "p0" });
  assert.equal(equipmentCount(next.run, "leftovers"), 1);
  assert.equal(reducer(next, { type: "UNEQUIP_ITEM", monId: "p0" }), next);
  next.run.party[0].item = "Sitrus Berry";
  next = reducer(next, { type: "UNEQUIP_ITEM", monId: "p0" });
  assert.equal(next.run.heldItems.sitrusberry, undefined);
  assert.deepEqual(
    parseSaveBackup(JSON.stringify(next)).run.heldItems,
    next.run.heldItems,
  );
});
test("preparar só ocupa vagas vazias; não gasta kit quando todos já têm item", () => {
  const s = state();
  s.run.phase = "career";
  s.run.spent = 0;
  s.run.position = 0;
  s.run.lastAmbush = 100;
  s.run.party[0].item = "leftovers";
  let next = reducer(s, { type: "PREPARE" });
  assert.equal(next.run.party[0].item, "leftovers");
  assert.equal(next.run.party[1].item, "Sitrus Berry");
  assert.equal(next.run.berries, s.run.berries - 1);
  assert.equal(reducer(next, { type: "PREPARE" }), next);
});
test("reserva conserva equipamentos e venda devolve sem inflar o preço", () => {
  const s = state();
  s.run.party[0].item = "leftovers";
  let next = reducer(s, { type: "BOX_TO_RESERVE", id: "p0" });
  assert.equal(next.run.box.find((m) => m.id === "p0").item, "leftovers");
  const before = equipmentCount(next.run, "leftovers");
  next = reducer(next, { type: "MARKET_SELL", monId: "p0" });
  assert.equal(equipmentCount(next.run, "leftovers"), before + 1);
  assert.equal(next.run.heroRecords.p0.status, "sold");
  assert.equal(reducer(next, { type: "MARKET_SELL", monId: "p0" }), next);
});
test("captura conserva equipamento na reserva e devolve ao liberar um integrante", () => {
  for (const full of [false, true]) {
    const s = state(),
      r = s.run;
    r.party = Array.from({ length: 6 }, (_, i) => ({
      ...makeMon("Pikachu", 40, `p${i}`),
      item: i ? "" : "leftovers",
    }));
    r.box = full
      ? Array.from({ length: 3 }, (_, i) => makeMon("Arbok", 40, `b${i}`))
      : [];
    r.encounters = [{ name: "Eevee", level: 20, used: true }];
    r.eventEncounterIndex = 0;
    const before = equipmentCount(r, "leftovers");
    completeCapture(r, {
      mon: makeMon("Eevee", 20, "new"),
      name: "Eevee",
      replaceId: "p0",
      index: 0,
    });
    if (full) {
      assert.equal(equipmentCount(r, "leftovers"), before + 1);
      assert.equal(r.heroRecords.p0.status, "released");
    } else assert.equal(r.box[0].item, "leftovers");
  }
});
test("Leftovers cura no motor real e Choice Scarf altera ordem e bloqueia golpes", () => {
  const build = (item) =>
    startBattle({
      name: "Teste",
      seed: [1, 2, 3, 4],
      player: [
        {
          ...makeMon("Pikachu", 50, "p0"),
          item,
          moves: ["splash", "tailwhip"],
        },
      ],
      enemy: [{ ...makeMon("Raichu", 50, "foe0"), moves: ["splash"] }],
      choices: [],
    });
  const berry = build("leftovers");
  try {
    berry.p1.active[0].hp = 50;
    berry.makeChoices("move 1", "move 1");
    assert.equal(
      berry.p1.active[0].hp,
      50 + Math.floor(berry.p1.active[0].maxhp / 16),
    );
  } finally {
    berry.destroy();
  }
  const normal = build(""),
    scarf = build("choicescarf");
  try {
    normal.makeChoices("move 1", "move 1");
    scarf.makeChoices("move 1", "move 1");
    assert.match(
      normal.log.find((line) => line.startsWith("|move|")),
      /p2a/,
    );
    assert.match(
      scarf.log.find((line) => line.startsWith("|move|")),
      /p1a/,
    );
    assert.equal(scarf.p1.activeRequest.active[0].moves[1].disabled, true);
  } finally {
    normal.destroy();
    scarf.destroy();
  }
});
test("Focus Sash real é consumido, deixa 1 HP e registra o feito só ao concluir", () => {
  const b = startBattle({
    name: "Teste",
    seed: [1, 2, 3, 4],
    player: [
      {
        ...makeMon("Rattata", 10, "p0"),
        item: "focussash",
        moves: ["endeavor", "quickattack"],
      },
    ],
    enemy: [{ ...makeMon("Machamp", 70, "foe0"), moves: ["closecombat"] }],
    choices: [],
  });
  try {
    b.makeChoices("move 1", "move 1");
    assert.equal(b.p1.active[0].hp, 1);
    assert.equal(b.p1.active[0].item, "");
    assert.equal(battleSnapshot(b).feats, undefined);
    b.makeChoices("move 2", "move 1");
    const snap = battleSnapshot(b);
    assert.equal(snap.winner, "Você");
    assert.equal(snap.feats.records.p0.clutch, true);
    assert.equal(snap.feats.records.p0.knockouts, 1);
  } finally {
    b.destroy();
  }
});

test("eventos de preparo preservam equipamentos e só preenchem espaços vazios", () => {
  const event = WEEK_EVENTS.find((entry) =>
    entry.choices.some((choice) => choice.effect?.prepared),
  );
  const choice = event.choices.find((entry) => entry.effect?.prepared);
  const s = state();
  Object.assign(s.run, {
    phase: "event",
    position: 0,
    spent: 0,
    lastAmbush: 100,
    berries: 10,
    weekEvent: { id: event.id, choices: [choice.id] },
  });
  s.run.party[0].item = "choicescarf";
  const next = reducer(s, { type: "EVENT_CHOICE", choiceId: choice.id });
  assert.equal(next.run.party[0].item, "choicescarf");
  assert.equal(next.run.party[1].item, "Sitrus Berry");
});

test("Knock Off e Trick reais seguem o resultado sem devolver ou duplicar o item perdido", () => {
  for (const move of ["knockoff", "trick"]) {
    const player = {
      ...makeMon("Pikachu", 50, "p0"),
      item: "leftovers",
      moves: ["quickattack"],
    };
    const enemy = {
      ...makeMon("Persian", 50, "foe0"),
      item: move === "trick" ? "choicescarf" : "",
      moves: [move],
    };
    const spec = {
      kind: "ambush",
      name: "Teste",
      seed: [1, 2, 3, 4],
      player: [player],
      enemy: [enemy],
      choices: [],
    };
    const b = startBattle(spec);
    try {
      b.makeChoices("move 1", "move 1");
      assert.equal(b.p1.active[0].item, move === "trick" ? "choicescarf" : "");
      b.p2.active[0].hp = 1;
      b.makeChoices("move 1", "move 1");
      const s = drafted(811);
      Object.assign(s.run, {
        phase: "result",
        party: [player],
        battle: spec,
        outcome: battleSnapshot(b),
        heldItems: {},
        spent: 0,
        lastAmbush: 100,
      });
      const next = reducer(s, { type: "RESULT" });
      assert.equal(
        next.run.party[0].item,
        move === "trick" ? "choicescarf" : "",
      );
      assert.equal(next.run.heldItems.leftovers, undefined);
      if (move === "knockoff")
        assert.match(
          s.run.outcome.log.join(" "),
          /perdeu Leftovers por Knock Off/,
        );
    } finally {
      b.destroy();
    }
  }
});
