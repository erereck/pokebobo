import { useRef, useState } from "react";
import { Sprite } from "../pokemon/Sprite.jsx";
import { BadgeStrip } from "../progress/BadgeStrip.jsx";
import { ChevronRight, GripVertical, Radio } from "lucide-react";

export function TeamSidebar({ run, onTeam, onReorder }) {
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [dragState, setDragState] = useState(null);
  const canReorder = run.phase === "career" && run.party.length > 1;

  const startDrag = (event, sourceId) => {
    if (!canReorder) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = { sourceId, targetId: sourceId };
    setDragState({ sourceId, targetId: sourceId });
  };

  const moveDrag = (event) => {
    const active = dragRef.current;
    if (!active) return;
    event.preventDefault();
    const target = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest?.("[data-party-id]")?.dataset?.partyId;
    if (!target || target === active.targetId) return;
    active.targetId = target;
    setDragState({ ...active });
  };

  const finishDrag = (event) => {
    const active = dragRef.current;
    if (!active) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = null;
    setDragState(null);
    if (active.sourceId !== active.targetId)
      onReorder(active.sourceId, active.targetId);
    setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  return (
    <aside className="dex-companion">
      <div className="companion-label">
        <Radio size={16} /> EQUIPE CONECTADA <span>{run.party.length}/6</span>
      </div>
      <div className="companion-party">
        {run.party.map((m, i) => (
          <button
            key={m.id}
            data-party-id={m.id}
            className={
              dragState?.sourceId === m.id
                ? "is-dragging"
                : dragState?.targetId === m.id
                  ? "is-drag-target"
                  : ""
            }
            onClick={(event) => {
              if (suppressClickRef.current) {
                event.preventDefault();
                suppressClickRef.current = false;
                return;
              }
              onTeam(m.id);
            }}
          >
            <span className="slot-number">0{i + 1}</span>
            <span
              className={"party-drag-handle" + (canReorder ? " can-drag" : "")}
              title={canReorder ? "Arraste para mudar a ordem" : "Reordene entre batalhas"}
              onPointerDown={(event) => startDrag(event, m.id)}
              onPointerMove={moveDrag}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
            >
              <GripVertical size={15} />
            </span>
            <Sprite name={m.name} />
            <span>
              <strong>{m.name}</strong>
              <small>
                {i === 0 ? "Abre a batalha" : "Pronto para a jornada"}
              </small>
            </span>
            <b>Lv.{m.level}</b>
          </button>
        ))}
        {Array.from({ length: 6 - run.party.length }, (_, i) => (
          <div key={i} className="companion-empty">
            <span>0{run.party.length + i + 1}</span>
            <span>AGUARDANDO POKÉMON</span>
          </div>
        ))}
      </div>
      <p className="companion-drag-hint">
        {canReorder ? "Arraste ⋮⋮ para reorganizar a ordem." : "A ordem pode ser alterada entre batalhas."}
      </p>
      <button className="companion-link" onClick={() => onTeam()}>
        Consultar equipe, reserva e golpes <ChevronRight size={16} />
      </button>
      <div className="badge-console">
        <div className="section-head">
          <span>INSÍGNIAS</span>
          <b>{run.badges}/8</b>
        </div>
        <BadgeStrip count={run.badges} />
      </div>
      <div className="trainer-display">
        <small>TREINADOR / RUN {String(run.number).padStart(3, "0")}</small>
        <strong>{run.name}</strong>
        <span>
          {run.mode === "rush"
            ? "Correria"
            : run.mode === "nuzlocke"
              ? "Nuzlocke"
              : "Clássico"}
        </span>
      </div>
      <div className="speaker-grille" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
    </aside>
  );
}
