import { useId, useState } from "react";
import { Modal } from "../../components/ui/Modal.jsx";
import { nicknameOf } from "../../game/heroes/heroes.js";
import { HERO_RULES } from "../../game/config/heroes.js";

export function NicknameDialog({ mon, act, onClose }) {
  const [value, setValue] = useState(mon.nickname || "");
  const id = useId(),
    nickname = nicknameOf(value);
  return (
    <Modal
      title={`Apelido de ${mon.name}`}
      className="nickname-dialog"
      onClose={onClose}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (act({ type: "POKEMON_NICKNAME", monId: mon.id, nickname }))
            onClose();
        }}
      >
        <label htmlFor={id}>Como você chama esse parceiro?</label>
        <input
          id={id}
          autoComplete="off"
          value={value}
          maxLength={HERO_RULES.nicknameCharacters * 2}
          onChange={(event) =>
            setValue(
              [...event.target.value]
                .slice(0, HERO_RULES.nicknameCharacters)
                .join(""),
            )
          }
          placeholder={mon.name}
          aria-describedby={`${id}-hint`}
        />
        <p id={`${id}-hint`} className="muted small">
          Até {HERO_RULES.nicknameCharacters} caracteres. Deixe vazio para usar
          o nome da espécie. A espécie e os atributos continuam os mesmos.
        </p>
        <footer className="market-confirm">
          <button
            type="submit"
            className="button primary full"
            disabled={nickname === (mon.nickname || "")}
          >
            Salvar apelido
          </button>
          <button type="button" className="text-button" onClick={onClose}>
            Cancelar
          </button>
        </footer>
      </form>
    </Modal>
  );
}
