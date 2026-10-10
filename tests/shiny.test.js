import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { SHINY_RULES } from "../src/game/config/shiny.js";
import { rollShiny, shinyFromRoll } from "../src/game/pokemon/shiny.js";
import { drafted } from "./helpers/campaign.js";
import { reducer } from "../src/game/state/reducer.js";
import { createRoute } from "../src/game/world/createRoute.js";
import { applyWeekEventEffect } from "../src/game/career/weekEvents.js";
import { makeMon } from "../src/game/pokemon/createPokemon.js";
import { train } from "../src/game/career/training.js";
import { finishRun } from "../src/game/career/finishRun.js";
import { writeSave } from "../src/game/persistence/writeSave.js";
import { loadSave } from "../src/game/persistence/loadSave.js";
import { stateCollection } from "../src/game/persistence/dexStorage.js";
import { restoreBattle } from "../src/game/battle/restore.js";
import { battleSnapshot } from "../src/game/battle/snapshot.js";
import { battleSpriteSources } from "../src/components/pokemon/battleSpriteSources.js";
import catalog from "../src/game/catalog.json" with { type: "json" };

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("shiny: exatamente um dos 1024 intervalos; limite exclusivo e sem bônus", () => {
  assert.equal(SHINY_RULES.denominator, 1024);
  assert.equal(shinyFromRoll(0), true);
  assert.equal(shinyFromRoll(1 / 1024 - Number.EPSILON), true);
  assert.equal(shinyFromRoll(1 / 1024), false);
  assert.equal(
    Array.from({ length: 1024 }, (_, i) =>
      shinyFromRoll((i + 0.5) / 1024),
    ).filter(Boolean).length,
    1,
  );
});

test("shiny: fluxo determinístico separado não consome o RNG da campanha", () => {
  const a = { seed: 1234, rng: 456 },
    b = structuredClone(a),
    results = [];
  for (let i = 0; i < 4096; i++) {
    const x = rollShiny(a);
    results.push(x);
    assert.equal(x, rollShiny(b));
  }
  assert.equal(a.rng, 456);
  assert.ok(results.includes(true));
  assert.ok(results.includes(false));
  const resumed = JSON.parse(JSON.stringify(a));
  assert.equal(rollShiny(a), rollShiny(resumed));
  assert.equal(a.shinyRng, resumed.shinyRng);
});

test("iniciais, novas rotas e eventos recebem shiny uma vez, mantendo resultados de gameplay", () => {
  // Primeiro valor xorshift de 1 é 0.00006295, abaixo de 1/1024.
  const seed = (1 ^ 0x9e3779b9) >>> 0,
    s = drafted(seed);
  assert.equal(s.run.party[0].shiny, true);
  const a = drafted(1234).run,
    b = structuredClone(a);
  b.shinyRng = 1;
  createRoute(a);
  createRoute(b);
  assert.equal(b.encounters[0].shiny, true);
  assert.equal(a.rng, b.rng);
  assert.deepEqual(
    a.encounters.map(({ shiny, ...rest }) => rest),
    b.encounters.map(({ shiny, ...rest }) => rest),
  );
  b.shinyRng = 1;
  const rng = b.rng;
  applyWeekEventEffect(b, {
    specialEncounter: { name: "Eevee", level: 20, theft: true },
  });
  assert.equal(b.encounters.at(-1).shiny, true);
  assert.equal(b.rng, rng);
});

test("falha, reload e nova bola preservam o shiny; captura animada retoma sem duplicação", () => {
  let s = drafted(1234);
  s.run.phase = "encounter";
  s.run.encounters = [{ name: "Eevee", level: 12, used: false, shiny: true }];
  s.run.rng = 12345;
  s.run.balls = 3;
  const shinyRng = s.run.shinyRng;
  s = reducer(s, { type: "CAPTURE", index: 0, animate: true });
  assert.equal(s.run.captureAttempt.success, false);
  const disk = storage();
  writeSave(disk, s);
  s = loadSave(disk);
  assert.equal(s.run.captureAttempt.shiny, true);
  s = reducer(s, { type: "CAPTURE_FINISH", id: s.run.captureAttempt.id });
  assert.equal(s.run.encounters[0].shiny, true);
  assert.equal(s.run.phase, "encounter");
  s.run.rng = 1;
  s = reducer(s, { type: "CAPTURE", index: 0, animate: true });
  assert.equal(s.run.captureAttempt.success, true);
  const id = s.run.captureAttempt.id;
  writeSave(disk, s);
  s = loadSave(disk);
  s = reducer(s, { type: "CAPTURE_FINISH", id });
  assert.equal(s.run.party.at(-1).shiny, true);
  assert.equal(s.run.shinyRng, shinyRng);
  assert.ok(s.run.collection.some((m) => m.species === "Eevee" && m.shiny));
  assert.equal(reducer(s, { type: "CAPTURE_FINISH", id }), s);
});

test("evolução ramificada na reserva, save, Hall e Pokédex conservam shiny", () => {
  let s = drafted(2);
  s.run.moveLearningMode = "automatic";
  s.run.box = [makeMon("Eevee", 29, "rare", true)];
  train(s.run, 1);
  s = reducer(s, { type: "EVOLUTION_CHOICE", monId: "rare", name: "Umbreon" });
  assert.equal(s.run.box[0].name, "Umbreon");
  assert.equal(s.run.box[0].shiny, true);
  finishRun(s, false);
  const disk = storage();
  writeSave(disk, s);
  s = loadSave(disk);
  assert.equal(s.meta.history[0].box[0].shiny, true);
  assert.ok(stateCollection(s).some((m) => m.species === "Umbreon" && m.shiny));
});

test("save antigo continua normal, sem rolar shinies retroativamente", () => {
  const s = drafted(1234);
  delete s.run.shinyRng;
  delete s.run.party[0].shiny;
  s.run.encounters = [{ name: "Pidgey", level: 8, used: false }];
  s.run.phase = "encounter";
  s.run.rng = 1;
  const disk = storage();
  writeSave(disk, s);
  const loaded = loadSave(disk);
  const next = reducer(loaded, { type: "CAPTURE", index: 0 });
  assert.equal(next.run.party.at(-1).shiny, false);
  assert.equal(next.run.shinyRng, undefined);
});

test("batalha real e replay mantêm shiny sem mudar dano, stats ou turnos", () => {
  const normal = {
    name: "Teste",
    seed: [1, 2, 3, 4],
    choices: ["move 1"],
    player: [makeMon("Pikachu", 30, "p")],
    enemy: [makeMon("Lapras", 30, "f")],
  };
  const rare = structuredClone(normal);
  rare.player[0].shiny = true;
  const a = restoreBattle(normal),
    b = restoreBattle(rare);
  try {
    const sa = battleSnapshot(a),
      sb = battleSnapshot(b);
    assert.equal(sb.active.shiny, true);
    assert.deepEqual(
      [sa.active.hp, sa.foe.hp, sa.turn],
      [sb.active.hp, sb.foe.hp, sb.turn],
    );
    assert.equal(sa.active.shiny, false);
  } finally {
    a.destroy();
    b.destroy();
  }
});

test("todas as formas têm frente e costas shiny locais e fallback conserva a cor", () => {
  for (const name of Object.keys(catalog))
    for (const back of [true, false]) {
      const sources = battleSpriteSources(name, back, "/pokebobo/", true);
      assert.ok(sources.length, name);
      assert.ok(
        sources.every((url) => url.includes("-shiny/")),
        name,
      );
      assert.notEqual(
        sources[0],
        battleSpriteSources(name, back, "/pokebobo/")[0],
      );
    }
});

test("970 sprites shiny de batalha e 776 estáticos correspondem aos manifestos", async () => {
  const manifest = JSON.parse(
    await readFile(
      new URL("../public/battle-sprites/manifest.json", import.meta.url),
    ),
  );
  const entries = Object.values(manifest).flatMap((mon) => [
    mon.shinyFront,
    mon.shinyBack,
  ]);
  assert.equal(entries.length, 970);
  const staticEntries = JSON.parse(
    await readFile(
      new URL("../public/sprites/shiny-manifest.json", import.meta.url),
    ),
  );
  assert.equal(staticEntries.length, 776);
  for (const [folder, records] of [
    ["battle-sprites", entries],
    ["sprites", staticEntries],
  ])
    for (const record of records) {
      const data = await readFile(
        new URL(`../public/${folder}/${record.file}`, import.meta.url),
      );
      assert.equal(data.length, record.bytes);
      assert.equal(
        createHash("sha256").update(data).digest("hex"),
        record.sha256,
      );
    }
});
