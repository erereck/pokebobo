import { Archive, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { CAMPAIGN_RULES } from "../../game/config/campaign.js";
export function ReservePanel({ run, mon, act, onSelect }) {
  const box = run.box || [];
  const canManage = run.phase === "career";
  const canSendSelected =
    canManage &&
    mon &&
    run.party.length > 1 &&
    box.length < CAMPAIGN_RULES.boxSize;
  return (
    <section className="reserve-panel" aria-label="Reserva Pokémon">
      <div className="section-head reserve-head">
        <div>
          <Archive size={18} />
          <h3>Reserva</h3>
        </div>
        <span className="mono">
          {box.length}/{CAMPAIGN_RULES.boxSize}
        </span>
      </div>
      <p className="muted small">A reserva acompanha os níveis da equipe.</p>

      {mon && (
        <button
          className="button secondary full reserve-main-action"
          disabled={!canSendSelected}
          onClick={() => {
            const next = run.party.find((candidate) => candidate.id !== mon.id);
            if (act({ type: "BOX_TO_RESERVE", id: mon.id }))
              onSelect(next?.id || null);
          }}
        >
          <ArrowDownToLine size={17} />
          {box.length >= CAMPAIGN_RULES.boxSize
            ? "Reserva lotada"
            : run.party.length <= 1
              ? "O último Pokémon precisa ficar na equipe"
              : !canManage
                ? "Mexa na reserva entre batalhas"
                : `Mandar ${mon.name} para a reserva`}
        </button>
      )}

      <div className="reserve-grid">
        {box.map((reserveMon) => (
          <article className="reserve-card" key={reserveMon.id}>
            <Sprite name={reserveMon.name} />
            <div>
              <strong>{reserveMon.name}</strong>
              <small>Lv. {reserveMon.level}</small>
            </div>
            <button
              className="button secondary"
              disabled={
                !canManage ||
                (!mon && run.party.length >= CAMPAIGN_RULES.partySize)
              }
              onClick={() => {
                const action =
                  run.party.length < CAMPAIGN_RULES.partySize
                    ? { type: "BOX_TO_PARTY", id: reserveMon.id }
                    : {
                        type: "BOX_SWAP",
                        partyId: mon?.id,
                        boxId: reserveMon.id,
                      };
                if (act(action)) onSelect(reserveMon.id);
              }}
            >
              <ArrowUpFromLine size={15} />
              {run.party.length < CAMPAIGN_RULES.partySize
                ? "Trazer"
                : mon
                  ? `Trocar por ${mon.name}`
                  : "Selecione alguém"}
            </button>
          </article>
        ))}
        {Array.from(
          { length: CAMPAIGN_RULES.boxSize - box.length },
          (_, index) => (
            <div className="reserve-empty" key={index}>
              <span>R{box.length + index + 1}</span>
              <small>VAGA LIVRE</small>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
