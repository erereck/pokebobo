import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import catalog from "../../game/catalog.json" with { type: "json" };
import { Modal } from "../../components/ui/Modal.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { TypeTag } from "../../components/pokemon/TypeTag.jsx";

function findMon(run, id) {
  return run.party.find((mon) => mon.id === id) || run.box?.find((mon) => mon.id === id);
}

function moveInfo(species, id) {
  return catalog[species]?.moves.find((move) => move.id === id) || null;
}

export function MoveLearnDialog({ run, act }) {
  const pending = run.pendingMoveChoices?.[0];
  const mon = pending && findMon(run, pending.monId);
  const freeSlot = Boolean(mon && (mon.moves?.length || 0) < 4);

  useEffect(() => {
    if (!pending) return;
    if (!mon) {
      act({ type: "MOVE_CHOICE", monId: pending.monId, skip: true });
      return;
    }
    // Compatibilidade com saves da 0.6/0.7 que ficaram parados numa decisão
    // criada antes da regra de aprendizado automático em vagas livres.
    if (freeSlot)
      act({ type: "MOVE_CHOICE", monId: pending.monId });
  }, [pending?.monId, pending?.moveId, mon, freeSlot, act]);

  if (!pending || !mon || freeSlot) return null;

  const learned = moveInfo(pending.species || mon.name, pending.moveId);
  const currentData = catalog[mon.name];
  const remaining = run.pendingMoveChoices.length;

  return (
    <Modal
      className="move-learn-dialog"
      title="Novo golpe"
      onClose={() => {}}
      dismissible={false}
    >
      <section className="move-learn-hero">
        <Sprite name={mon.name} />
        <div>
          <span className="section-label">
            APRENDIZADO · {remaining} {remaining === 1 ? "DECISÃO" : "DECISÕES"}
          </span>
          <h3>{mon.name} quer aprender {learned?.name || pending.moveId}.</h3>
          <p>
            Os quatro slots estão ocupados. Escolha um golpe para esquecer ou
            ignore o novo.
          </p>
        </div>
      </section>

      <div className="new-move-card">
        <div>
          <Sparkles size={18} />
          <strong>{learned?.name || pending.moveId}</strong>
          {learned?.type && <TypeTag type={learned.type} />}
        </div>
        <small>
          {learned?.category === "Status"
            ? "Status"
            : `Poder ${learned?.power || "—"}`} · {learned?.accuracy === true ? "não erra" : `${learned?.accuracy || "—"}% precisão`}
        </small>
      </div>

      <div className="forget-move-list">
        <span className="section-label">QUAL GOLPE SAI?</span>
        {mon.moves.map((id) => {
          const move = currentData?.moves.find((candidate) => candidate.id === id);
          return (
            <button
              className="forget-move-button"
              key={id}
              onClick={() =>
                act({
                  type: "MOVE_CHOICE",
                  monId: mon.id,
                  forgetMoveId: id,
                })
              }
            >
              <span>
                <strong>{move?.name || id}</strong>
                {move?.type && <TypeTag type={move.type} />}
              </span>
              <small>Esquecer este e aprender {learned?.name || pending.moveId}</small>
            </button>
          );
        })}
      </div>

      <button
        className="button secondary full"
        onClick={() => act({ type: "MOVE_CHOICE", monId: mon.id, skip: true })}
      >
        Não aprender {learned?.name || pending.moveId}
      </button>
    </Modal>
  );
}
