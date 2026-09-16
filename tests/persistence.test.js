import test from "node:test";
import { reducer } from "../src/game/engine.js";
import { initialState } from "../src/game/engine.js";
import assert from "node:assert/strict";
import { SAVE_KEY } from "../src/game/engine.js";
import { loadSave } from "../src/game/engine.js";

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
