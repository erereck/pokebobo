import { useState } from "react";
import { useGameSession } from "./hooks/useGameSession.js";
import { AppHeader } from "../components/layout/AppHeader.jsx";
import { X } from "lucide-react";
import { Welcome } from "../features/onboarding/Welcome.jsx";
import { Setup } from "../features/draft/Setup.jsx";
import { Ending } from "../features/ending/Ending.jsx";
import { MissionHUD } from "../components/layout/MissionHUD.jsx";
import { RunContent } from "./RunContent.jsx";
import { TeamSidebar } from "../components/layout/TeamSidebar.jsx";
import { GameNavigation } from "../components/layout/GameNavigation.jsx";
import { HelpDialog } from "../features/settings/HelpDialog.jsx";
import { SettingsDialog } from "../features/settings/SettingsDialog.jsx";
import { AbandonDialog } from "../features/settings/AbandonDialog.jsx";
import { HallOfFameDialog } from "../features/history/HallOfFameDialog.jsx";
import { MoveLearnDialog } from "../features/team/MoveLearnDialog.jsx";
import { ResetDialog } from "../features/settings/ResetDialog.jsx";
import { initialState } from "../game/state/initialState.js";

export function App() {
  const [selectedMonId, setSelectedMonId] = useState(null);
  const {
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
  } = useGameSession();
  const setup =
    run && ["origin", "starter", "draft", "ready"].includes(run.phase);
  const playing = run && !setup && run.phase !== "ended";
  return (
    <div
      className={
        playing
          ? "app-shell is-playing" +
            (tab === "journey" && run.phase === "battle" ? " is-battle" : "")
          : "app-shell"
      }
    >
      <AppHeader setModal={setModal} />
      {error && (
        <div className="error-banner" role="alert">
          {error}
          <button onClick={() => setError("")} aria-label="Dispensar erro">
            <X size={16} />
          </button>
        </div>
      )}
      {!saving && (
        <div className="error-banner" role="alert">
          O navegador não conseguiu salvar. Exporte seu progresso em Opções
          antes de fechar.
        </div>
      )}
      {!run ? (
        <Welcome
          name={name}
          setName={setName}
          mode={mode}
          setMode={setMode}
          meta={state.meta}
          onStart={() =>
            act({
              type: "NEW",
              name,
              mode,
            })
          }
        />
      ) : setup ? (
        <Setup run={run} act={act} />
      ) : run.phase === "ended" ? (
        <Ending
          run={run}
          meta={state.meta}
          onNew={() => {
            setName(run.name);
            setState((s) => ({
              ...s,
              run: null,
            }));
          }}
        />
      ) : (
        <div className="game-shell">
          <div className="dex-main-panel">
            <MissionHUD run={run} saving={saving} />
            <RunContent
              tab={tab}
              run={run}
              act={act}
              selectedMonId={selectedMonId}
            />
          </div>
          <div className="dex-hinge" aria-hidden="true" />
          <TeamSidebar
            run={run}
            onTeam={(id) => {
              setSelectedMonId(id || null);
              setTab("team");
            }}
            onReorder={(sourceId, targetId) =>
              act({ type: "REORDER_PARTY", sourceId, targetId })
            }
          />
        </div>
      )}
      {playing && <GameNavigation tab={tab} setTab={setTab} run={run} />}
      {run?.pendingMoveChoices?.length > 0 && (
        <MoveLearnDialog run={run} act={act} />
      )}
      {modal === "hall" && (
        <HallOfFameDialog
          history={state.meta.history}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "help" && <HelpDialog setModal={setModal} />}
      {modal === "settings" && (
        <SettingsDialog
          setModal={setModal}
          exportSave={exportSave}
          state={state}
          playing={playing}
        />
      )}
      {modal === "abandon" && <AbandonDialog setModal={setModal} act={act} />}
      {modal === "reset" && (
        <ResetDialog
          onClose={() => setModal("settings")}
          onReset={() => {
            setState(initialState());
            setTab("journey");
            setModal(null);
            setError("");
          }}
        />
      )}
    </div>
  );
}
