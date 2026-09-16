import { Modal } from "../../components/ui/Modal.jsx";

export function AbandonDialog({ setModal, act }) {
  return (
    <Modal title="Guardar a mochila?" onClose={() => setModal(null)}>
      <p>
        Esta run será encerrada e registrada no histórico. Seu recorde e os
        modos desbloqueados continuam salvos.
      </p>
      <div className="button-row">
        <button className="button secondary" onClick={() => setModal(null)}>
          Continuar jogando
        </button>
        <button
          className="button danger"
          onClick={() => {
            act({
              type: "ABANDON",
            });
            setModal(null);
          }}
        >
          Encerrar run
        </button>
      </div>
    </Modal>
  );
}
