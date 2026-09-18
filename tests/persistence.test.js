import test from "node:test";
import { reducer } from "../src/game/engine.js";
import { initialState } from "../src/game/engine.js";
import assert from "node:assert/strict";
import { SAVE_KEY } from "../src/game/engine.js";
import { loadSave } from "../src/game/engine.js";
import { SAVE_BACKUP_KEY, SAVE_VERSION } from "../src/game/persistence/constants.js";

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


test("save v3 migra para o schema atual sem apagar run nem histórico antigo", () => {
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
      opponent: "Líder",
      team: ["Bulbasaur"],
    },
  ];
  delete old.run.eventBoosts;
  delete old.run.eventFlags;
  delete old.run.eventHistory;

  const store = new Map([[SAVE_KEY, JSON.stringify(old)]]);
  const disk = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, value) => store.set(key, value),
  };
  const loaded = loadSave(disk);

  assert.equal(loaded.version, SAVE_VERSION);
  assert.equal(loaded.run.name, "Legado");
  assert.equal(loaded.run.seed, 99);
  assert.deepEqual(loaded.meta.history[0].team, ["Bulbasaur"]);
  assert.equal(loaded.meta.history[0].won, false);
  assert.deepEqual(loaded.run.eventFlags, {});
  assert.equal(loaded.run.eventBoosts.capture, 0);
  assert.equal(store.get(SAVE_BACKUP_KEY), JSON.stringify(old));
});

test("save corrompido ganha cópia de recuperação antes do fallback", () => {
  const store = new Map([[SAVE_KEY, "{quebrou"]]);
  const disk = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, value) => store.set(key, value),
  };
  const loaded = loadSave(disk);
  assert.equal(loaded.run, null);
  assert.equal(store.get(SAVE_BACKUP_KEY), "{quebrou");
});
