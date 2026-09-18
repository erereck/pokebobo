import { useState } from "react";
import { loadSave } from "../../game/persistence/loadSave.js";
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
]);

export function useGameSession() {
  const [state, setState] = useState(() => loadSave(localStorage));
  const [tab, setTab] = useState("journey");
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");
  const saving = useAutosave(state);
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
  const exportSave = () => downloadJson(state, "pokebobo-save.json");
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
  };
}
