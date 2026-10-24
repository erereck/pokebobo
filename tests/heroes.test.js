import test from "node:test";
import assert from "node:assert/strict";
import { drafted, finishBattle } from "./helpers/campaign.js";
import { reducer } from "../src/game/engine.js";
import { makeMon } from "../src/game/pokemon.js";
import { grow } from "../src/game/pokemon/evolution.js";
import { battleFeats } from "../src/game/heroes/battleFeats.js";
import { journeyLegacy, nicknameOf } from "../src/game/heroes/heroes.js";
import { parseSaveBackup } from "../src/game/persistence/importSave.js";
import { battleSnapshot } from "../src/game/battle/snapshot.js";
import { restoreBattle } from "../src/game/battle/restore.js";
import { CHAMPIONS } from "../src/game/data/league/champions.js";

test("apelido conserva espécie/ID, limita caracteres e não muda atributos ou RNG", () => {
  const s = drafted(234),
    mon = s.run.party[0];
  const next = reducer(s, {
    type: "POKEMON_NICKNAME",
    monId: mon.id,
    nickname: "  Broto\u0000   bravo  ",
  });
  assert.equal(next.run.party[0].nickname, "Broto bravo");
  assert.equal(next.run.party[0].id, mon.id);
  assert.equal(next.run.party[0].name, mon.name);
  assert.equal(next.run.rng, s.run.rng);
  assert.equal(next.run.week, s.run.week);
  assert.equal([...nicknameOf("🦊".repeat(25))].length, 18);
  assert.equal(grow(next.run.party[0], 30).nickname, "Broto bravo");
  assert.equal(
    parseSaveBackup(JSON.stringify(next)).run.party[0].nickname,
    "Broto bravo",
  );
  next.run.phase = "battle";
  assert.equal(
    reducer(next, {
      type: "POKEMON_NICKNAME",
      monId: mon.id,
      nickname: "Outro",
    }),
    next,
  );
});
test("protocolo completo conta um nocaute direto, não dano residual, recoil ou linhas públicas duplicadas", () => {
  const battle = {
    winner: "Você",
    p1: { pokemon: [{ name: "p0", fainted: false }] },
    log: [
      "|switch|p1a: p0|Pikachu, L50|100/100",
      "|move|p1a: p0|Thunderbolt|p2a: foe0",
      "|split|p2",
      "|-damage|p2a: foe0|0 fnt",
      "|-damage|p2a: foe0|0 fnt",
      "|faint|p2a: foe0",
      ...Array(150).fill("|upkeep|"),
      "|switch|p2a: foe1|Raichu, L50|10/100",
      "|move|p1a: p0|Thunderbolt|p2a: foe1",
      "|-damage|p2a: foe1|5/100",
      "|upkeep|",
      "|-damage|p2a: foe1|0 fnt|[from] psn",
      "|faint|p2a: foe1",
    ],
  };
  const feats = battleFeats(battle);
  assert.equal(feats.records.p0.knockouts, 1);
  assert.equal(feats.lastFinisher, null);
  assert.equal(feats.records.p0.participated, true);
});
test("resultado salvo conta feitos uma vez, conserva apelido em batalha/Hall e registra vendidos", () => {
  let s = drafted(555);
  s.run.party = [
    { ...makeMon("Garchomp", 100, "p0"), nickname: "Guardião" },
    makeMon("Magikarp", 10, "bench"),
  ];
  s.run.moveLearningMode = "automatic";
  s.run.badges = 2;
  s = reducer(s, { type: "RIVAL_CHALLENGE" });
  const b = restoreBattle(s.run.battle);
  try {
    assert.equal(battleSnapshot(b).active.nickname, "Guardião");
  } finally {
    b.destroy();
  }
  s = finishBattle(s);
  assert.equal(s.run.heroRecords.p0.battles, 1);
  assert.equal(s.run.heroRecords.bench.battles, 0);
  assert.equal(s.run.heroRecords.p0.knockouts, 2);
  assert.equal(reducer(s, { type: "RESULT" }), s);
  const reloaded = parseSaveBackup(JSON.stringify(s));
  assert.deepEqual(reloaded.run.heroRecords, s.run.heroRecords);
  s = reducer(reloaded, { type: "ABANDON" });
  assert.equal(s.meta.history[0].hero.nickname, "Guardião");
  assert.equal(s.meta.history[0].heroes[0].knockouts, 2);
  assert.equal(s.meta.history[0].team[0].nickname, "Guardião");
});
test("memorial preserva quem caiu e desempate do destaque é determinístico", () => {
  const s = drafted();
  s.run.heroRecords = {
    dead: {
      id: "dead",
      name: "Pikachu",
      nickname: "Faísca",
      shiny: false,
      level: 20,
      battles: 3,
      wins: 2,
      knockouts: 5,
      clutches: 1,
      status: "fallen",
      championFinisher: false,
    },
  };
  const legacy = journeyLegacy(s.run);
  assert.equal(legacy.hero.id, "dead");
  assert.equal(legacy.hero.epithet, "Por um fio");
  assert.equal(legacy.heroes.find((r) => r.id === "dead").status, "fallen");
});
test("backup rejeita equipamentos, apelidos, feitos e rival malformados", () => {
  const s = drafted();
  for (const mutate of [
    (r) => (r.heldItems = { leftovers: -1 }),
    (r) => (r.heldItems = { inexistente: 1 }),
    (r) => (r.party[0].nickname = "x".repeat(19)),
    (r) => (r.rival.victories = [2, 2]),
    (r) => (r.rival.profile = "ausente"),
    (r) =>
      (r.heroRecords = {
        x: { id: "x", name: "Pikachu", level: 10, nickname: "", battles: -1 },
      }),
  ]) {
    const broken = structuredClone(s);
    mutate(broken.run);
    assert.throws(() => parseSaveBackup(JSON.stringify(broken)), /inválidos/);
  }
});

test("vitória real em Nuzlocke arquiva quem caiu e devolve equipamento restante", () => {
  let s = drafted(99);
  Object.assign(s.run, {
    mode: "nuzlocke",
    badges: 2,
    moveLearningMode: "automatic",
    party: [
      {
        ...makeMon("Rattata", 1, "fallen"),
        nickname: "Valente",
        item: "leftovers",
      },
      makeMon("Garchomp", 100, "survivor"),
    ],
  });
  s = reducer(s, { type: "RIVAL_CHALLENGE" });
  s = finishBattle(s);
  assert.equal(s.run.phase, "career");
  assert.equal(s.run.party.length, 1);
  assert.equal(s.run.heroRecords.fallen.status, "fallen");
  assert.equal(s.run.heldItems.leftovers, 2);
  s = reducer(s, { type: "ABANDON" });
  assert.equal(
    s.meta.history[0].heroes.find((r) => r.id === "fallen").nickname,
    "Valente",
  );
  assert.equal(
    s.meta.history[0].heroes.find((r) => r.id === "fallen").status,
    "fallen",
  );
});

test("golpe final contra campeão recebe epíteto e resultado pode ser recarregado sem duplicação", () => {
  let s = drafted(77);
  Object.assign(s.run, {
    inLeague: true,
    leagueIndex: 4,
    league: [...Array(4).fill(CHAMPIONS[0]), CHAMPIONS[0]],
    party: [makeMon("Garchomp", 100, "ace")],
    moveLearningMode: "automatic",
  });
  s = reducer(s, { type: "CHALLENGE" });
  s = finishBattle(s);
  assert.equal(s.run.phase, "ended");
  assert.equal(s.meta.history[0].hero.championFinisher, true);
  assert.equal(s.meta.history[0].hero.epithet, "Fecha a Liga");
  const loaded = parseSaveBackup(JSON.stringify(s));
  assert.equal(loaded.meta.history[0].hero.knockouts, 6);
  assert.equal(reducer(loaded, { type: "RESULT" }), loaded);
});
