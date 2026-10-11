import { useId } from "react";
import { Compass, X } from "lucide-react";
import { parseInvitation } from "../../shared/regionInvitation.js";
import {
  MODE_LABELS,
  challengeRoute,
} from "../../game/world/regionChallenge.js";

export function InvitationInput({ value, onChange, expanded = false }) {
  const id = useId();
  let invitation, error;
  try {
    invitation = parseInvitation(value);
  } catch (e) {
    error = e.message;
  }
  const route = invitation?.challenge
    ? challengeRoute(invitation.challenge)
    : [];
  return (
    <details
      className="invitation-input"
      open={expanded || Boolean(value) || undefined}
    >
      <summary>
        <Compass size={17} /> Jogar um desafio ou usar uma seed
      </summary>
      <label htmlFor={id}>LINK, CÓDIGO OU SEED DO AMIGO</label>
      <div className="invitation-field">
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cole o convite ou digite uma seed"
          maxLength={1800}
          spellCheck="false"
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-status`}
        />
        {value && (
          <button
            type="button"
            className="icon-button"
            aria-label="Remover desafio"
            onClick={() => onChange("")}
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div
        id={`${id}-status`}
        className={error ? "invitation-error" : "invitation-status"}
        aria-live="polite"
      >
        {error ||
          (route.length ? (
            <>
              <strong>{route[0].name} → oito ginásios → Liga</strong>
              <span>
                {MODE_LABELS[invitation.challenge.mode]} · seed{" "}
                {invitation.seed}
              </span>
              <span>
                A região já está montada. Você escolhe seu inicial e escreve sua
                história.
              </span>
            </>
          ) : invitation ? (
            `Seed ${invitation.seed}. Você ainda escolhe as cidades no draft.`
          ) : (
            "Deixe vazio para uma aventura nova. Um convite traz a região completa; uma seed repete os sorteios conforme suas escolhas."
          ))}
      </div>
    </details>
  );
}
