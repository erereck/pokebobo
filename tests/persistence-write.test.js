import test from "node:test";
import assert from "node:assert/strict";
import { writeSave } from "../src/game/persistence/writeSave.js";
import { loadSave } from "../src/game/persistence/loadSave.js";
import { SAVE_KEY } from "../src/game/persistence/constants.js";
import { drafted } from "./helpers/campaign.js";
test("persistência modular mantém o save e propaga falta de espaço", () => {
  const store = new Map(),
    storage = {
      setItem: (k, v) => store.set(k, v),
      getItem: (k) => store.get(k),
    };
  const state = drafted();
  writeSave(storage, state);
  assert.ok(store.has(SAVE_KEY));
  assert.deepEqual(loadSave(storage), state);
  assert.throws(
    () =>
      writeSave(
        {
          setItem() {
            throw Error("quota");
          },
        },
        state,
      ),
    /quota/,
  );
});
