import test from "node:test";
import { reducer } from "../src/game/engine.js";
import { initialState } from "../src/game/engine.js";
import assert from "node:assert/strict";
import { SAVE_KEY } from "../src/game/engine.js";
import { loadSave } from "../src/game/engine.js";
import {
  SAVE_BACKUP_KEY,
  SAVE_VERSION,
} from "../src/game/persistence/constants.js";

test("mods permanecem trancados antes do título; save guarda e carrega a run", () => {
  const s = reducer(initialState(), {
    type: "NEW",
    mode: "nuzlocke",
    seed: 7,
  });
  assert.equal(s.run.mode, "normal");
  const disk = {
    getItem: (key) => (key === SAVE_KEY ? JSON.stringify(s) : null),
  };
  assert.deepEqual(loadSave(disk), s);
  assert.equal(
    loadSave({
      getItem: () => "{quebrou",
    }).run,
    null,
  );
});

test("save antigo migra sem apagar carreira e cria backup pré-migração", () => {
  const legacy = reducer(initialState(), {
    type: "NEW",
    name: "Legado",
    seed: 77,
  });
  legacy.version = 3;
  delete legacy.run.eventBoosts;
  delete legacy.run.eventFlags;
  legacy.meta.history = [
    {
      id: 12,
      name: "Arquivo",
      won: false,
      badges: 6,
      week: 19,
      opponent: "Sabrina",
      team: ["Pikachu", "Kadabra"],
    },
  ];
  const store = new Map([[SAVE_KEY, JSON.stringify(legacy)]]);
  const storage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, value) => store.set(key, value),
  };
  const loaded = loadSave(storage);
  assert.equal(loaded.version, SAVE_VERSION);
  assert.equal(loaded.meta.history[0].name, "Arquivo");
  assert.equal(loaded.meta.history[0].badges, 6);
  assert.equal(loaded.run.name, "Legado");
  assert.deepEqual(loaded.run.box, []);
  assert.deepEqual(loaded.run.pendingMoveChoices, []);
  assert.equal(loaded.run.pendingBattleKind, null);
  assert.deepEqual(loaded.run.eventBoosts, {
    capture: 0,
    training: 0,
    forage: 0,
    ambushShield: 0,
  });
  assert.equal(store.get(SAVE_BACKUP_KEY), JSON.stringify(legacy));
});

test("backup automático recupera progresso se a cópia principal corromper", () => {
  const legacy = {
    version: 3,
    meta: {
      runs: 4,
      wins: 1,
      best: 8,
      history: [
        {
          id: 4,
          name: "Campeão antigo",
          won: true,
          badges: 8,
          week: 28,
          opponent: "Blue",
          team: ["Venusaur"],
        },
      ],
    },
    run: null,
  };
  const disk = {
    getItem: (key) =>
      key === SAVE_KEY
        ? "{corrompido"
        : key === SAVE_BACKUP_KEY
          ? JSON.stringify(legacy)
          : null,
  };
  const loaded = loadSave(disk);
  assert.equal(loaded.meta.runs, 4);
  assert.equal(loaded.meta.wins, 1);
  assert.equal(loaded.meta.history[0].name, "Campeão antigo");
});
