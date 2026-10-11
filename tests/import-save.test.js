import test from "node:test";
import assert from "node:assert/strict";
import {
  parseSaveBackup,
  restoreSaveSlot,
} from "../src/game/persistence/importSave.js";
import { drafted } from "./helpers/campaign.js";
import { initialState } from "../src/game/state/initialState.js";
import { reducer } from "../src/game/state/reducer.js";
import { writeSave } from "../src/game/persistence/writeSave.js";
import { loadSave } from "../src/game/persistence/loadSave.js";
import {
  saveKey,
  saveBackupKey,
  ACTIVE_SAVE_SLOT_KEY,
} from "../src/game/persistence/constants.js";

function store() {
  const data = new Map();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => data.set(k, v),
    removeItem: (k) => data.delete(k),
  };
}
test("backups de configuração, carreira, exploração, captura e batalha preservam estado/RNG", () => {
  const career = drafted(1234),
    exploration = reducer(career, { type: "EXPLORE" });
  const encounter = structuredClone(exploration);
  encounter.run.phase = "encounter";
  encounter.run.exploration.activeIndex = 0;
  const capture = reducer(encounter, {
    type: "CAPTURE",
    index: 0,
    animate: true,
  });
  const battle = structuredClone(career);
  battle.run.position = 2;
  const fighting = reducer(battle, { type: "CHALLENGE" });
  const cases = [
    initialState(),
    reducer(initialState(), { type: "NEW", seed: 100 }),
    career,
    exploration,
    capture,
    fighting,
  ];
  for (const original of cases) {
    const serialized = JSON.stringify(original),
      parsed = parseSaveBackup(serialized);
    assert.equal(JSON.stringify(original), serialized);
    assert.equal(parsed.run?.rng, original.run?.rng);
    assert.deepEqual(parsed.run?.party, original.run?.party);
    assert.deepEqual(parsed.run?.captureAttempt, original.run?.captureAttempt);
    assert.deepEqual(
      parsed.run?.battle?.choices,
      original.run?.battle?.choices,
    );
  }
});
test("restaurar em outro slot preserva slot original/preferências e mantém cópia do destino anterior", () => {
  const storage = store(),
    original = drafted(1111),
    previous = drafted(2222),
    incoming = drafted(3333);
  writeSave(storage, original, 1);
  writeSave(storage, previous, 2);
  storage.setItem("pokebobo:battle-sprites", "2d");
  const first = storage.getItem(saveKey(1)),
    second = storage.getItem(saveKey(2));
  restoreSaveSlot(storage, incoming, 2);
  assert.equal(storage.getItem(saveKey(1)), first);
  assert.equal(storage.getItem(saveBackupKey(2)), second);
  assert.equal(storage.getItem("pokebobo:battle-sprites"), "2d");
  assert.equal(storage.getItem(ACTIVE_SAVE_SLOT_KEY), "2");
  assert.equal(loadSave(storage, 2).run.seed, 3333);
});
test("arquivo inválido/futuro/fora do tamanho ou slot inválido é rejeitado antes de substituir", () => {
  const source = drafted(),
    storage = store();
  writeSave(storage, source);
  const before = new Map(storage.data);
  for (const value of [
    "not-json",
    JSON.stringify({}),
    JSON.stringify({ ...source, version: 999 }),
    " ".repeat(8 * 1024 * 1024 + 1),
  ])
    assert.throws(() => parseSaveBackup(value));
  for (const mutate of [
    (s) => (s.run.party[0].name = "Missing"),
    (s) => (s.run.party[0].moves = ["unknown"]),
    (s) => (s.run.route[0].id = "missing"),
    (s) => (s.run.phase = "missing"),
    (s) => (s.run = 42),
    (s) => (s.run = {}),
    (s) => (s.run.rng = 0),
    (s) =>
      (s.run.box = Array.from({ length: 4 }, (_, i) => ({
        ...s.run.party[0],
        id: `box${i}`,
      }))),
  ]) {
    const invalid = structuredClone(source);
    mutate(invalid);
    assert.throws(() => restoreSaveSlot(storage, invalid, 1));
    assert.deepEqual(storage.data, before);
  }
  assert.throws(() => restoreSaveSlot(storage, source, 4));
  assert.deepEqual(storage.data, before);
});
test("falha de quota durante restauração reverte chaves e não muda o progresso aberto", () => {
  const storage = store(),
    original = drafted(4444),
    incoming = drafted(5555);
  writeSave(storage, original);
  const before = new Map(storage.data),
    set = storage.setItem;
  let writes = 0;
  storage.setItem = (k, v) => {
    if (++writes === 3) throw Error("QuotaExceededError");
    set(k, v);
  };
  assert.throws(
    () => restoreSaveSlot(storage, incoming, 1),
    /Não foi possível/,
  );
  assert.deepEqual(storage.data, before);
  assert.equal(original.run.seed, 4444);
});
