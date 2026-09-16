import { Modal } from "../../components/ui/Modal.jsx";
export function ResetDialog({ onClose, onReset }) {
  return (
    <Modal title="Começar os testes do zero?" onClose={onClose}>
      <p>
        Isso apaga a run, os recordes e os modos desbloqueados deste navegador.
      </p>
      <button className="button danger full" onClick={onReset}>
        Zerar meu progresso
      </button>
      <button className="button secondary full" onClick={onClose}>
        Continuar com meu save
      </button>
    </Modal>
  );
}
