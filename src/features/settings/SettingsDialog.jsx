import { VERSION, RELEASE_NAME } from "../../app/version.js";
import { Modal } from "../../components/ui/Modal.jsx";
import { Download } from "lucide-react";
import { HallOfFame } from "../ending/HallOfFame.jsx";

export function SettingsDialog({ setModal, exportSave, state, playing }) {
  return (
    <Modal title="Opções e progresso" onClose={() => setModal(null)}>
      <p>O save fica neste navegador, inclusive no meio de uma batalha.</p>
      <button className="button secondary full" onClick={exportSave}>
        <Download size={18} />
        Exportar progresso
      </button>
      <div className="record-grid">
        <div>
          <strong>{state.meta.runs}</strong>
          <span>runs iniciadas</span>
        </div>
        <div>
          <strong>{state.meta.wins}</strong>
          <span>títulos da Liga</span>
        </div>
        <div>
          <strong>{state.meta.best}/8</strong>
          <span>melhor marca</span>
        </div>
      </div>
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
      {state.meta.history.length > 0 && (
        <details className="run-history">
          <summary>Hall da Fama e carreiras</summary>
          <HallOfFame history={state.meta.history} compact />
        </details>
      )}
      <button
        className="button secondary full"
        onClick={() => setModal("reset")}
      >
        Zerar progresso de teste…
      </button>
      <p className="muted small">
        v{VERSION} · {RELEASE_NAME}
      </p>
    </Modal>
  );
}
