import { VERSION, RELEASE_NAME } from "../../app/version.js";
import { Modal } from "../../components/ui/Modal.jsx";
import { Download, Trophy } from "lucide-react";

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
      <button className="button secondary full" onClick={() => setModal("hall")}>
        <Trophy size={18} />
        Abrir Hall da Fama · {state.meta.history.length} registros
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
        Zerar progresso de teste…
      </button>
      <p className="muted small">
        v{VERSION} · {RELEASE_NAME}
      </p>
    </Modal>
  );
}
