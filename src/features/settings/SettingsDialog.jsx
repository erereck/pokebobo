import { VERSION, RELEASE_NAME } from "../../app/version.js";
import { Modal } from "../../components/ui/Modal.jsx";
import { Download, Trophy } from "lucide-react";
import { SaveSlots } from "./SaveSlots.jsx";

export function SettingsDialog({
  setModal,
  exportSave,
  state,
  playing,
  activeSlot,
  saveSlots,
  switchSaveSlot,
}) {
  return (
    <Modal title="Opções e progresso" onClose={() => setModal(null)}>
      <SaveSlots
        activeSlot={activeSlot}
        slots={saveSlots}
        onSwitch={switchSaveSlot}
      />
      <p>
        O Slot {activeSlot} fica salvo neste navegador, inclusive no meio de uma
        batalha.
      </p>
      <button className="button secondary full" onClick={exportSave}>
        <Download size={18} />
        Exportar Slot {activeSlot}
      </button>
      <div className="record-grid">
        <div>
          <strong>{state.meta.runs}</strong>
          <span>runs neste slot</span>
        </div>
        <div>
          <strong>{state.meta.wins}</strong>
          <span>títulos neste slot</span>
        </div>
        <div>
          <strong>{state.meta.best}/8</strong>
          <span>melhor deste slot</span>
        </div>
      </div>
      <button className="button secondary full" onClick={() => setModal("hall")}>
        <Trophy size={18} />
        Hall geral do aparelho · {state.meta.history.length} registros
      </button>
      {playing && (
        <button
          className="button danger full"
          onClick={() => setModal("abandon")}
        >
          Encerrar esta run
        </button>
      )}
      {state.run?.seed && (
        <p className="muted small">
          Seed desta run: <strong>{state.run.seed}</strong>
        </p>
      )}
      <button
        className="button secondary full"
        onClick={() => setModal("reset")}
      >
        Zerar apenas o Slot {activeSlot}…
      </button>
      <p className="muted small">
        v{VERSION} · {RELEASE_NAME}
      </p>
    </Modal>
  );
}
