import { useState } from "react";
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

const KEEP_TAB_ACTIONS = new Set([
  "LEAD",
  "BOX_TO_RESERVE",
  "BOX_TO_PARTY",
  "BOX_SWAP",
  "REORDER_PARTY",
  "MOVE_CHOICE",
  "BATTLE_CHOICE",
]);

export function useGameSession() {
  const [activeSlot, setActiveSlot] = useState(() =>
    loadActiveSaveSlot(localStorage),
  );
  const [state, setState] = useState(() => loadSave(localStorage, activeSlot));
  const [tab, setTab] = useState("journey");
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");
  const saving = useAutosave(state, activeSlot);
  const [name, setName] = useState("");
  const [mode, setMode] = useState("normal");
  const run = state.run;

  const act = (action) => {
    try {
      const next = reducer(state, action);
      setState(next);
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
      writeSave(localStorage, state, activeSlot);
      writeActiveSaveSlot(localStorage, nextSlot);
      const nextState = loadSave(localStorage, nextSlot);
      setActiveSlot(nextSlot);
      setState(nextState);
      setTab("journey");
      setError("");
      setName("");
      setMode("normal");
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  };

  const saveSlots = allSaveSlotSummaries(localStorage, activeSlot, state);
  const exportSave = () =>
    downloadJson(state, `pokebobo-slot-${activeSlot}-save.json`);

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
    run,
    act,
    exportSave,
    activeSlot,
    saveSlots,
    switchSaveSlot,
  };
}
