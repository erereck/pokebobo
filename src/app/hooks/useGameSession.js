import { useState } from "react";
import { loadSave } from "../../game/persistence/loadSave.js";
import { useAutosave } from "./useAutosave.js";
import { downloadJson } from "../../shared/downloadJson.js";
import { reducer } from "../../game/state/reducer.js";

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
      if (action.type !== "LEAD") {
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
