import { useState } from "react";
import { browserStorage } from "../../shared/browserStorage.js";
import { restoreSaveSlot } from "../../game/persistence/importSave.js";
import { loadSave } from "../../game/persistence/loadSave.js";
import { writeSave } from "../../game/persistence/writeSave.js";
import {
  allSaveSlotSummaries,
  loadActiveSaveSlot,
  writeActiveSaveSlot,
} from "../../game/persistence/slots.js";
import { normalizeSaveSlot } from "../../game/persistence/constants.js";
import { useAutosave } from "./useAutosave.js";
import { downloadJson } from "../../shared/downloadJson.js";
import { reducer } from "../../game/state/reducer.js";
import {
  mergeDex,
  stateCollection,
} from "../../game/persistence/dexStorage.js";

const KEEP_TAB_ACTIONS = new Set([
  "LEAD",
  "BOX_TO_RESERVE",
  "BOX_TO_PARTY",
  "BOX_SWAP",
  "REORDER_PARTY",
  "MOVE_CHOICE",
  "EVOLUTION_CHOICE",
  "EVOLUTION_REQUEST",
  "BATTLE_CHOICE",
  "MOVE_ROUTE",
  "ROUTE_STEP_COMPLETE",
  "EQUIP_ITEM",
  "UNEQUIP_ITEM",
  "POKEMON_NICKNAME",
]);

export function useGameSession({ onActionCommitted, onSessionChange } = {}) {
  const [activeSlot, setActiveSlot] = useState(() =>
    loadActiveSaveSlot(browserStorage),
  );
  const [state, setState] = useState(() =>
    loadSave(browserStorage, activeSlot),
  );
  const [tab, setTab] = useState("journey");
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");
  const { saving, persistNow } = useAutosave(state, activeSlot);
  const [name, setName] = useState("");
  const [mode, setMode] = useState("normal");
  const [moveLearningMode, setMoveLearningMode] = useState(
    () => state.meta.moveLearningMode || "manual",
  );
  const run = state.run;

  const act = (action) => {
    try {
      const next = reducer(state, action);
      if (next !== state)
        next.meta.dex = mergeDex(
          stateCollection(state, activeSlot),
          stateCollection(next, activeSlot),
        );
      setState(next);
      // O progresso de uma ação válida é gravado antes de um possível
      // pagehide/reload; a effect evita gravar essa mesma referência de novo.
      if (next !== state) persistNow(next);
      if (next !== state) onActionCommitted?.(state, next, action);
      setError("");
      if (!KEEP_TAB_ACTIONS.has(action.type)) {
        setTab("journey");
        window.scrollTo({
          top: 0,
          behavior: "instant",
        });
      }
      return next !== state;
    } catch (e) {
      setError(e.message);
      return false;
    }
  };

  const switchSaveSlot = (slot) => {
    const nextSlot = normalizeSaveSlot(slot);
    if (nextSlot === activeSlot) return false;
    try {
      writeSave(browserStorage, state, activeSlot);
      writeActiveSaveSlot(browserStorage, nextSlot);
      const nextState = loadSave(browserStorage, nextSlot);
      setActiveSlot(nextSlot);
      setState(nextState);
      onSessionChange?.();
      setTab("journey");
      setError("");
      setName("");
      setMode("normal");
      setMoveLearningMode(nextState.meta.moveLearningMode || "manual");
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  };

  const saveSlots = allSaveSlotSummaries(browserStorage, activeSlot, state);
  const exportSave = () =>
    downloadJson(state, `pokebobo-slot-${activeSlot}-save.json`);
  const exportSaveSlot = (slot) =>
    downloadJson(
      slot === activeSlot ? state : loadSave(browserStorage, slot),
      `pokebobo-slot-${slot}-save.json`,
    );
  const importSave = (incoming, slot) => {
    const nextSlot = normalizeSaveSlot(slot);
    restoreSaveSlot(browserStorage, incoming, nextSlot);
    const next = loadSave(browserStorage, nextSlot);
    setActiveSlot(nextSlot);
    setState(next);
    onSessionChange?.();
    setTab("journey");
    setError("");
    setSelectedPreferences(next);
    return true;
  };
  const setSelectedPreferences = (next) => {
    setName("");
    setMode("normal");
    setMoveLearningMode(next.meta.moveLearningMode || "manual");
  };

  return {
    state,
    setState,
    tab,
    setTab,
    modal,
    setModal,
    error,
    setError,
    saving,
    name,
    setName,
    mode,
    setMode,
    moveLearningMode,
    setMoveLearningMode,
    run,
    act,
    exportSave,
    exportSaveSlot,
    importSave,
    activeSlot,
    saveSlots,
    switchSaveSlot,
  };
}
