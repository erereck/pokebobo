import test from "node:test";
import assert from "node:assert/strict";
import { initialState } from "../src/game/state/initialState.js";
import { loadSave } from "../src/game/persistence/loadSave.js";
import { writeSave } from "../src/game/persistence/writeSave.js";
import {
  ACTIVE_SAVE_SLOT_KEY,
  GLOBAL_HALL_KEY,
  SAVE_KEY,
  saveKey,
} from "../src/game/persistence/constants.js";
import {
  loadActiveSaveSlot,
  writeActiveSaveSlot,
} from "../src/game/persistence/slots.js";

function storage() {
  const store = new Map();
  return {
    store,
    getItem: (key) => store.get(key) || null,
    setItem: (key, value) => store.set(key, value),
  };
}

function stateFor(name, runs, wins, id) {
  const state = initialState();
  state.meta.runs = runs;
  state.meta.wins = wins;
  state.meta.best = wins ? 8 : 4;
  state.meta.history = [{
    id,
    name,
    won: Boolean(wins),
    badges: wins ? 8 : 4,
    week: 20 + id,
    seed: 1000 + id,
    team: [],
  }];
  return state;
}

test("três slots mantêm carreira separada e Hall global", () => {
  const disk = storage();
  writeSave(disk, stateFor("Erick", 3, 1, 3), 1);
  writeSave(disk, stateFor("Convidado", 1, 0, 1), 2);

  const one = loadSave(disk, 1);
  const two = loadSave(disk, 2);

  assert.equal(one.meta.runs, 3);
  assert.equal(one.meta.wins, 1);
  assert.equal(two.meta.runs, 1);
  assert.equal(two.meta.wins, 0);
  assert.equal(one.meta.history.length, 2);
  assert.equal(two.meta.history.length, 2);
  assert.deepEqual(
    new Set(one.meta.history.map((entry) => entry.slot)),
    new Set([1, 2]),
  );
  assert.ok(disk.store.has(GLOBAL_HALL_KEY));
  assert.ok(disk.store.has(SAVE_KEY));
  assert.ok(disk.store.has(saveKey(2)));
});

test("zerar um slot não apaga o Hall geral nem restaura recordes do slot", () => {
  const disk = storage();
  writeSave(disk, stateFor("Erick", 2, 1, 2), 1);
  writeSave(disk, stateFor("Convidado", 1, 0, 1), 2);

  const blank = initialState();
  blank.meta.history = loadSave(disk, 1).meta.history;
  writeSave(disk, blank, 1);

  const reloaded = loadSave(disk, 1);
  assert.equal(reloaded.meta.runs, 0);
  assert.equal(reloaded.meta.wins, 0);
  assert.equal(reloaded.meta.history.length, 2);
});

test("save antigo continua sendo Slot 1 e slot ativo persiste", () => {
  const disk = storage();
  const legacy = stateFor("Legado", 4, 1, 4);
  disk.setItem(SAVE_KEY, JSON.stringify(legacy));

  const loaded = loadSave(disk, 1);
  assert.equal(loaded.meta.runs, 4);
  assert.equal(loaded.meta.history[0].name, "Legado");

  assert.equal(loadActiveSaveSlot(disk), 1);
  assert.equal(writeActiveSaveSlot(disk, 3), 3);
  assert.equal(disk.getItem(ACTIVE_SAVE_SLOT_KEY), "3");
  assert.equal(loadActiveSaveSlot(disk), 3);
});
