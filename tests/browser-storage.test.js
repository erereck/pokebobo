import test from "node:test";
import assert from "node:assert/strict";
import { createBrowserStorage } from "../src/shared/browserStorage.js";
import { loadSave } from "../src/game/persistence/loadSave.js";
import { writeSave } from "../src/game/persistence/writeSave.js";
import {
  loadActiveSaveSlot,
  allSaveSlotSummaries,
} from "../src/game/persistence/slots.js";
import { readBattleSpriteStyle } from "../src/app/preferences/battleSprites.js";
import { readBattleSpeed } from "../src/app/preferences/battleSpeed.js";
import { readAudioPreferences } from "../src/features/audio/audioPreferences.js";

test("bloqueio do getter de storage permite sessão em memória e nunca informa save gravado", () => {
  const environment = {
    get localStorage() {
      throw Error("SecurityError");
    },
  };
  const storage = createBrowserStorage(environment);
  const state = loadSave(storage);
  assert.equal(state.run, null);
  assert.equal(loadActiveSaveSlot(storage), 1);
  assert.equal(allSaveSlotSummaries(storage, 1, state).length, 3);
  assert.equal(readBattleSpriteStyle(storage), "3d");
  assert.equal(readBattleSpeed(storage), "normal");
  assert.equal(readAudioPreferences(storage, []).muted, false);
  assert.throws(() => writeSave(storage, state), /SecurityError/);
  assert.doesNotThrow(() => JSON.stringify(state));
});
