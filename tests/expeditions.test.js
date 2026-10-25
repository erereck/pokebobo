import test from "node:test";
import assert from "node:assert/strict";
import { reducer } from "../src/game/engine.js";
import { availableExpeditions } from "../src/game/expeditions/expeditions.js";
import { EXPEDITION_LAYOUTS } from "../src/game/data/expeditions.js";
import { parseSaveBackup } from "../src/game/persistence/importSave.js";
import { migrateSave } from "../src/game/persistence/migrateSave.js";
import { makeMon } from "../src/game/pokemon.js";
import { restoreBattle } from "../src/game/battle/restore.js";
import { battleSnapshot } from "../src/game/battle/snapshot.js";
import { drafted, finishBattle } from "./helpers/campaign.js";
import {
  expeditionState,
  walkExpedition,
  toGuardian,
} from "./helpers/expeditions.js";

const act = (s, type, args = {}) => reducer(s, { type, ...args });
const record = (s) => s.run.expeditions[s.run.activeExpedition || "echo-cave"];
const reload = (s) => parseSaveBackup(JSON.stringify(s));

test("expedições desbloqueiam em 2/5 insígnias e fecham antes da Liga", () => {
  const s = drafted();
  for (const [badges, ids] of [
    [0, []],
    [2, ["echo-cave"]],
    [4, ["echo-cave"]],
    [5, ["echo-cave", "sunken-ruins"]],
    [7, ["echo-cave", "sunken-ruins"]],
    [8, []],
  ]) {
    s.run.badges = badges;
    assert.deepEqual(
      availableExpeditions(s.run).map((x) => x.id),
      ids,
    );
  }
  s.run.badges = 5;
  s.run.inLeague = true;
  assert.deepEqual(availableExpeditions(s.run), []);
});

test("entrada direta custa exatamente uma semana e preserva RNG", () => {
  const base = drafted(99);
  base.run.badges = 2;
  const s = act(base, "EXPEDITION_ENTER", { siteId: "echo-cave" });
  assert.equal(s.run.spent, base.run.spent + 1);
  assert.equal(s.run.week, base.run.week + 1);
  assert.equal(s.run.rng, base.run.rng);
  assert.equal(s.run.balls, base.run.balls);
  assert.equal(record(s).room, 0);
  assert.equal(act(s, "EXPEDITION_ENTER", { siteId: "echo-cave" }), s);
});

test("entrada pelo campo reutiliza a semana, exige proximidade e não rerrola encontros", () => {
  let s = drafted(99);
  s.run.badges = 2;
  s = act(s, "EXPLORE");
  const rng = s.run.rng,
    week = s.run.week,
    spent = s.run.spent;
  s.run.exploration.x = 4;
  assert.equal(act(s, "EXPEDITION_ENTER", { siteId: "echo-cave" }), s);
  s.run.exploration.x = 1;
  s = act(s, "EXPEDITION_ENTER", { siteId: "echo-cave" });
  assert.equal(s.run.week, week);
  assert.equal(s.run.spent, spent);
  assert.equal(s.run.rng, rng);
  assert.equal(s.run.exploration, null);
  assert.equal(s.run.phase, "expedition");
});

test("fase, janela, lugar inválido e orçamento esgotado bloqueiam entrada", () => {
  for (const [phase, badges, siteId, spent] of [
    ["career", 1, "echo-cave", 0],
    ["career", 8, "echo-cave", 0],
    ["market", 5, "echo-cave", 0],
    ["career", 2, "sunken-ruins", 0],
    ["career", 2, "inventada", 0],
    ["career", 2, "echo-cave", 3],
  ]) {
    const s = drafted();
    Object.assign(s.run, { phase, badges, spent });
    assert.equal(act(s, "EXPEDITION_ENTER", { siteId }), s);
  }
});

test("os três mapas têm baús/passagens alcançáveis e paredes sólidas", () => {
  let s = expeditionState();
  assert.equal(act(s, "EXPEDITION_MOVE", { dx: 0, dy: 1 }), s);
  assert.equal(act(s, "EXPEDITION_MOVE", { dx: 1, dy: 1 }), s);
  assert.equal(act(s, "EXPEDITION_COLLECT", { choice: "cache" }), s);
  assert.equal(act(s, "EXPEDITION_ADVANCE"), s);
  assert.equal(EXPEDITION_LAYOUTS.length, 3);
  s = toGuardian(s);
  assert.equal(record(s).room, 2);
  assert.deepEqual(record(s).collected, [0, 1]);
});

test("animação gravada bloqueia ações; recarga conclui apenas o passo escolhido", () => {
  const s = act(expeditionState(), "EXPEDITION_MOVE", {
    dx: 1,
    dy: 0,
    animate: true,
  });
  assert.ok(record(s).walk);
  for (const type of [
    "EXPEDITION_LEAVE",
    "EXPEDITION_ADVANCE",
    "EXPEDITION_CHALLENGE",
  ])
    assert.equal(act(s, type), s);
  const restored = reload(s),
    id = record(restored).walk.id;
  assert.equal(
    act(restored, "EXPEDITION_STEP_COMPLETE", { id: id + 1 }),
    restored,
  );
  const next = act(restored, "EXPEDITION_STEP_COMPLETE", { id });
  assert.equal(record(next).walk, null);
  assert.equal(record(next).steps, 1);
  assert.equal(act(next, "EXPEDITION_STEP_COMPLETE", { id }), next);
});

test("primeiro baú e escolha de suprimentos são atômicos e não duplicam após recarga", () => {
  let s = walkExpedition(expeditionState(), { x: 8, y: 3 });
  const balls = s.run.balls;
  s = act(s, "EXPEDITION_COLLECT", { choice: "cache" });
  assert.equal(s.run.money, 200);
  assert.equal(s.run.balls, balls + 2);
  s = reload(s);
  assert.equal(act(s, "EXPEDITION_COLLECT", { choice: "cache" }), s);
  s = walkExpedition(s, { x: 5, y: 1 });
  s = act(s, "EXPEDITION_ADVANCE");
  s = walkExpedition(s, { x: 8, y: 3 });
  assert.equal(act(s, "EXPEDITION_COLLECT", { choice: "money" }), s);
  s = act(s, "EXPEDITION_COLLECT", { choice: "balls" });
  assert.equal(s.run.balls, balls + 5);
  assert.equal(record(s).supply, "balls");
  s = reload(s);
  assert.equal(act(s, "EXPEDITION_COLLECT", { choice: "berries" }), s);
});

test("recuar em qualquer sala conserva só achados obtidos e encerra a visita", () => {
  for (const room of [0, 1, 2]) {
    let s = expeditionState();
    if (room === 1) {
      s = walkExpedition(s, { x: 8, y: 3 });
      s = act(s, "EXPEDITION_COLLECT", { choice: "cache" });
      s = walkExpedition(s, { x: 5, y: 1 });
      s = act(s, "EXPEDITION_ADVANCE");
    }
    if (room === 2) s = toGuardian(s);
    const resources = [
      s.run.money,
      s.run.balls,
      s.run.berries,
      s.run.week,
      s.run.spent,
    ];
    s = act(s, "EXPEDITION_LEAVE");
    assert.equal(s.run.phase, "career");
    assert.equal(record(s).status, "escaped");
    assert.deepEqual(
      [s.run.money, s.run.balls, s.run.berries, s.run.week, s.run.spent],
      resources,
    );
    s = reload(s);
    assert.equal(act(s, "EXPEDITION_ENTER", { siteId: "echo-cave" }), s);
    assert.equal(act(s, "EXPEDITION_LEAVE"), s);
  }
});

test("sair na última semana começa o ginásio uma vez, inclusive na Correria", () => {
  for (const mode of ["normal", "rush"]) {
    const base = drafted(99);
    Object.assign(base.run, {
      badges: 2,
      position: 4,
      spent: mode === "rush" ? 1 : 2,
      mode,
    });
    let s = act(base, "EXPEDITION_ENTER", { siteId: "echo-cave" });
    assert.equal(s.run.phase, "expedition");
    s = act(s, "EXPEDITION_LEAVE");
    assert.equal(s.run.phase, "battle");
    assert.equal(s.run.battle.kind, "gym");
    assert.equal(s.run.week, base.run.week + 1);
    assert.equal(act(s, "EXPEDITION_LEAVE"), s);
  }
});

test("guardião usa combate reproduzível, sem XP; prêmio exige escolha e não duplica", () => {
  for (const id of ["echo-cave", "sunken-ruins"]) {
    let s = toGuardian(expeditionState(id));
    s = act(s, "EXPEDITION_CHALLENGE");
    assert.equal(s.run.battle.kind, "expedition");
    const b = restoreBattle(s.run.battle),
      c = restoreBattle(reload(s).run.battle);
    assert.deepEqual(battleSnapshot(b), battleSnapshot(c));
    b.destroy();
    c.destroy();
    const week = s.run.week,
      spent = s.run.spent;
    s = finishBattle(s);
    assert.equal(s.run.phase, "expedition");
    assert.equal(record(s).status, "won");
    assert.equal(s.run.party[0].level, 80);
    assert.equal(s.run.week, week);
    assert.equal(s.run.spent, spent);
    assert.equal(act(s, "RESULT"), s);
    assert.equal(act(s, "EXPEDITION_LEAVE"), s);
    s = reload(s);
    assert.equal(act(s, "EXPEDITION_REWARD", { reward: "inventado" }), s);
    s = act(s, "EXPEDITION_REWARD", { reward: "leftovers" });
    assert.equal(s.run.heldItems.leftovers, 1);
    assert.equal(s.run.money, id === "echo-cave" ? 400 : 600);
    s = reload(s);
    assert.equal(act(s, "EXPEDITION_REWARD", { reward: "leftovers" }), s);
    assert.equal(record(s).status, "cleared");
    s = act(s, "EXPEDITION_LEAVE");
    assert.equal(s.run.phase, "career");
  }
});

test("derrota real termina a jornada; Nuzlocke remove baixas na vitória e registra feitos", () => {
  let loss = toGuardian(expeditionState());
  loss.run.party = [makeMon("Magikarp", 1, "mon0")];
  loss = finishBattle(act(loss, "EXPEDITION_CHALLENGE"));
  assert.equal(loss.run.phase, "ended");
  assert.equal(record(loss).status, "defeated");
  assert.equal(
    loss.meta.history[0].expeditions["echo-cave"].status,
    "defeated",
  );
  assert.equal(loss.run.heldItems?.leftovers, undefined);
  let win = toGuardian(expeditionState());
  win.run.mode = "nuzlocke";
  win.run.party.unshift(makeMon("Magikarp", 1, "sacrifice"));
  win = finishBattle(act(win, "EXPEDITION_CHALLENGE"));
  assert.equal(win.run.phase, "expedition");
  assert.equal(win.run.party.length, 1);
  assert.equal(win.run.heroRecords.sacrifice.status, "fallen");
  assert.equal(win.run.heroRecords.mon0.knockouts, 3);
});

test("backups rejeitam estados impossíveis, recompensas forjadas e passo atravessando parede", () => {
  const s = expeditionState();
  for (const mutate of [
    (r) => {
      r.activeExpedition = "inventada";
    },
    (r) => {
      r.expeditions["echo-cave"].room = 8;
    },
    (r) => {
      r.expeditions["echo-cave"].collected = [1];
    },
    (r) => {
      r.expeditions["echo-cave"].status = "won";
    },
    (r) => {
      r.expeditions["echo-cave"].reward = "leftovers";
    },
    (r) => {
      Object.assign(r.expeditions["echo-cave"], {
        steps: 1,
        walk: { id: 1, fromX: 0, fromY: 0 },
      });
    },
    (r) => {
      r.phase = "career";
    },
  ]) {
    const invalid = structuredClone(s);
    mutate(invalid.run);
    assert.throws(() => reload(invalid), /inválidos/);
  }
});

test("saves anteriores ganham só estado vazio; não inventam visitas ou recompensas", () => {
  const s = drafted();
  delete s.run.expeditions;
  delete s.run.activeExpedition;
  const restored = migrateSave(s);
  assert.deepEqual(restored.run.expeditions, {});
  assert.equal(restored.run.activeExpedition, null);
  assert.equal(restored.run.rng, s.run.rng);
  assert.deepEqual(restored.run.party, s.run.party);
});

test("caminhar nas salas não reutiliza o limite de 50 passos nem gasta semanas", () => {
  let s = expeditionState();
  const week = s.run.week;
  for (let i = 0; i < 120; i++)
    s = act(s, "EXPEDITION_MOVE", { dx: i % 2 ? -1 : 1, dy: 0 });
  assert.equal(record(s).steps, 120);
  assert.equal(s.run.phase, "expedition");
  assert.equal(s.run.week, week);
  assert.equal(record(reload(s)).steps, 120);
});

test("os dois lugares têm visitas independentes, sem repetição no retorno", () => {
  let s = act(expeditionState(), "EXPEDITION_LEAVE");
  s.run.badges = 5;
  s = act(s, "EXPEDITION_ENTER", { siteId: "sunken-ruins" });
  assert.equal(s.run.activeExpedition, "sunken-ruins");
  s = act(s, "EXPEDITION_LEAVE");
  assert.deepEqual(availableExpeditions(s.run), []);
});

test("resolver encontro na caminhada bloqueia combinar captura e expedição na mesma ação", () => {
  let s = drafted(99);
  s.run.badges = 2;
  s = act(s, "EXPLORE");
  s.run.exploration.activeIndex = 0;
  s.run.phase = "encounter";
  s = act(s, "SKIP_ENCOUNTER");
  assert.equal(s.run.encounters[0].used, true);
  assert.equal(
    act(reload(s), "EXPEDITION_ENTER", { siteId: "echo-cave" }).run.phase,
    "exploration",
  );
  s = act(s, "EXIT_ROUTE");
  s = act(s, "EXPLORE");
  const week = s.run.week;
  s = act(s, "EXPEDITION_ENTER", { siteId: "echo-cave" });
  assert.equal(s.run.phase, "expedition");
  assert.equal(s.run.week, week);
});

test("líder, reserva e equipamentos podem mudar na sala, mas ficam bloqueados no combate", () => {
  let s = toGuardian(expeditionState());
  s.run.party.push(makeMon("Blastoise", 45, "mon1"));
  s.run.box = [makeMon("Pikachu", 30, "box0")];
  s.run.heldItems = { leftovers: 1 };
  const week = s.run.week;
  s = act(s, "LEAD", { id: "mon1" });
  assert.equal(s.run.party[0].id, "mon1");
  s = act(s, "BOX_SWAP", { partyId: "mon1", boxId: "box0" });
  assert.equal(s.run.party[0].id, "box0");
  s = act(s, "EQUIP_ITEM", { monId: "box0", itemId: "leftovers" });
  assert.equal(s.run.party[0].item, "leftovers");
  s = act(s, "EXPEDITION_CHALLENGE");
  assert.equal(s.run.week, week);
  assert.equal(s.run.battle.player[0].id, "box0");
  assert.equal(s.run.battle.player[0].item, "leftovers");
  assert.equal(act(s, "LEAD", { id: "mon0" }), s);
  assert.equal(act(s, "UNEQUIP_ITEM", { monId: "box0" }), s);
});
