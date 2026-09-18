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


test("update de schema migra save antigo sem apagar run nem histórico e guarda backup", () => {
  const old = reducer(initialState(), {
    type: "NEW",
    name: "Legado",
    seed: 99,
  });
  old.version = 3;
  old.meta.history = [
    {
      id: 7,
      name: "Antigo",
      won: false,
      badges: 5,
      week: 19,
      opponent: "Rival",
      team: ["Pikachu", "Ivysaur"],
    },
  ];
  delete old.run.eventHistory;
  delete old.run.eventSeen;
  delete old.run.eventFlags;
  delete old.run.eventBoosts;
  delete old.run.weeklyEvents;

  const raw = JSON.stringify(old);
  const disk = new Map([[SAVE_KEY, raw]]);
  const storage = {
    getItem: (key) => disk.get(key) ?? null,
    setItem: (key, value) => disk.set(key, value),
  };

  const loaded = loadSave(storage);

  assert.equal(loaded.version, SAVE_VERSION);
  assert.equal(loaded.run.name, "Legado");
  assert.equal(loaded.run.seed, old.run.seed);
  assert.equal(loaded.meta.history.length, 1);
  assert.equal(loaded.meta.history[0].won, false);
  assert.equal(loaded.meta.history[0].badges, 5);
  assert.deepEqual(loaded.meta.history[0].team, ["Pikachu", "Ivysaur"]);
  assert.deepEqual(loaded.run.eventHistory, []);
  assert.equal(loaded.run.weeklyEvents, true);
  assert.equal(storage.getItem(SAVE_BACKUP_KEY), raw);
});

test("histórico antigo é preservado mesmo se a run ativa estiver incompleta", () => {
  const raw = JSON.stringify({
    version: 2,
    meta: {
      runs: 3,
      wins: 1,
      best: 8,
      history: [
        {
          id: 3,
          name: "Arquivo",
          won: true,
          badges: 8,
          week: 28,
          team: ["Blastoise"],
        },
      ],
    },
    run: { name: "quebrada" },
  });
  const storage = {
    getItem: (key) => (key === SAVE_KEY ? raw : null),
    setItem: () => {},
  };
  const loaded = loadSave(storage);
  assert.equal(loaded.run, null);
  assert.equal(loaded.meta.history.length, 1);
  assert.equal(loaded.meta.wins, 1);
  assert.equal(loaded.meta.best, 8);
});
