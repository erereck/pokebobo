import { Modal } from "../../components/ui/Modal.jsx";
import { InvitationInput } from "./InvitationInput.jsx";
import { SaveSlots } from "../settings/SaveSlots.jsx";
import { parseInvitation } from "../../shared/regionInvitation.js";

export function ChallengeDialog({
  state,
  activeSlot,
  saveSlots,
  switchSaveSlot,
  value,
  onChange,
  name,
  setName,
  onStart,
  onClose,
}) {
  let valid = false;
  try {
    valid = Boolean(parseInvitation(value));
  } catch {}
  const occupied = state.run && state.run.phase !== "ended";
  return (
    <Modal
      title="Desafio de um amigo"
      onClose={onClose}
      className="challenge-dialog"
    >
      <p>
        Uma região compartilhada, uma nova história. Escolha onde guardar sua
        aventura.
      </p>
      <SaveSlots
        activeSlot={activeSlot}
        slots={saveSlots}
        onSwitch={switchSaveSlot}
      />
      {occupied && (
        <p className="notice">
          O Slot {activeSlot} tem uma jornada em andamento. Escolha um slot
          vazio ou conclua a jornada atual para começar o desafio.
        </p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid && !occupied) onStart();
        }}
      >
        <label htmlFor="challenge-trainer">NOME DO TREINADOR</label>
        <input
          id="challenge-trainer"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          placeholder="Seu nome de treinador"
          autoComplete="nickname"
        />
        <InvitationInput expanded value={value} onChange={onChange} />
        <button
          type="submit"
          className="button primary full"
          disabled={!valid || Boolean(occupied)}
        >
          Começar no Slot {activeSlot}
        </button>
      </form>
    </Modal>
  );
}
