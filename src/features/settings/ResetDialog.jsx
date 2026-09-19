import { Modal } from "../../components/ui/Modal.jsx";

export function ResetDialog({ onClose, onReset }) {
  return (
    <Modal title="Começar este slot do zero?" onClose={onClose}>
      <p>
        Isso apaga a run, os recordes e os modos desbloqueados deste slot. O Hall
        da Fama geral do aparelho continua intacto.
      </p>
      <button className="button danger full" onClick={onReset}>
        Zerar este slot
      </button>
      <button className="button secondary full" onClick={onClose}>
        Continuar com meu save
      </button>
    </Modal>
  );
}
