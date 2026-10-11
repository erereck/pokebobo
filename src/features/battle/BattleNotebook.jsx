import { useState } from "react";
import { Modal } from "../../components/ui/Modal.jsx";
import { TypeTag } from "../../components/pokemon/TypeTag.jsx";
import { moveGuide, STAT_LABELS, STATUS_LABELS } from "./moveGuide.js";

export function BattleNotebook({ snap, onClose }) {
  const [page, setPage] = useState("log");
  const moves = snap.request?.active?.[0]?.moves || [];
  return (
    <Modal
      title="Caderno de batalha"
      onClose={onClose}
      className="battle-notebook"
    >
      <nav className="notebook-pages" aria-label="Páginas do caderno">
        {[
          ["log", "Registro"],
          ["moves", "Seus golpes"],
          ["field", "Em campo"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            aria-pressed={page === id}
          >
            {label}
          </button>
        ))}
      </nav>
      {page === "log" && (
        <div className="turn-history">
          {snap.log.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
      {page === "moves" && (
        <div className="notebook-moves">
          <p className="notebook-caption">
            Precisão e poder básicos. Habilidades, itens e condições da batalha
            podem mudar o efeito.
          </p>
          {moves.length ? (
            moves.map((slot, index) => {
              const info = moveGuide(slot.id);
              if (!info) return null;
              return (
                <details key={slot.id} open={index === 0}>
                  <summary>
                    <strong>{info.name}</strong>
                    <TypeTag type={info.type} />
                    <span>
                      {slot.pp}/{slot.maxpp} PP
                    </span>
                  </summary>
                  <dl className="move-facts">
                    {[
                      ["Categoria", info.category],
                      ["Poder", info.power],
                      ["Precisão", info.accuracy],
                      ["Prioridade", info.priority],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <ul>
                    {info.notes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                  {info.contact && (
                    <p className="notebook-caption">Faz contato com o alvo.</p>
                  )}
                  {slot.disabled && (
                    <p className="notebook-unavailable">
                      Indisponível neste turno.
                    </p>
                  )}
                  {!slot.pp && <p className="notebook-unavailable">Sem PP.</p>}
                </details>
              );
            })
          ) : (
            <p>Escolha quem entra em campo para consultar seus golpes.</p>
          )}
        </div>
      )}
      {page === "field" && (
        <div className="notebook-field">
          {[snap.active, snap.foe].map((mon, index) => (
            <section key={mon.id}>
              <span className="section-label">
                {index === 0 ? "SEU POKÉMON" : "ADVERSÁRIO"}
              </span>
              <h3>
                {mon.name} <small>NV. {mon.level}</small>
              </h3>
              <div className="types">
                {mon.types?.map((type) => (
                  <TypeTag key={type} type={type} />
                ))}
              </div>
              <p>
                {mon.hp}/{mon.maxhp} HP ·{" "}
                {STATUS_LABELS[mon.status] || "Sem condição de status"}
              </p>
              <dl className="field-stages">
                {Object.entries(STAT_LABELS).map(([stat, label]) => {
                  const stage = mon.boosts?.[stat] || 0;
                  return (
                    <div key={stat}>
                      <dt>{label}</dt>
                      <dd
                        className={
                          stage > 0 ? "stage-up" : stage < 0 ? "stage-down" : ""
                        }
                      >
                        {stage > 0 ? "+" : ""}
                        {stage}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          ))}
          <p className="notebook-caption">
            Os estágios mudam seus atributos durante a luta. Ao trocar,
            normalmente voltam a zero.
          </p>
        </div>
      )}
    </Modal>
  );
}
