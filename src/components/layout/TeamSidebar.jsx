import { useRef, useState } from "react";
import { Sprite } from "../pokemon/Sprite.jsx";
import { BadgeStrip } from "../progress/BadgeStrip.jsx";
import { ChevronRight, GripVertical, Radio } from "lucide-react";

export function TeamSidebar({
  run,
  onTeam,
  onReorder,
  battle = null,
  onBattleSwitch,
}) {
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [dragState, setDragState] = useState(null);
  const battleSnap = battle?.snap || null;
  const activeBattleId = battleSnap?.active?.id || null;
  const inBattle = run.phase === "battle" && Boolean(battleSnap);
  const canReorder = run.phase === "career" && run.party.length > 1;

  const liveMon = (id) =>
    battleSnap?.player?.find((candidate) => candidate.id === id) || null;

  const canBattleSwitch = (id) => {
    if (!inBattle || battle.locked) return false;
    if (battle.trapped && !battle.forced) return false;
    const mon = liveMon(id);
    return Boolean(mon && !mon.fainted && !mon.active);
  };

  const startDrag = (event, sourceId) => {
    const mode = canReorder
      ? "reorder"
      : canBattleSwitch(sourceId)
        ? "battle-switch"
        : null;
    if (!mode) return;

    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = { sourceId, targetId: null, mode };
    setDragState({ sourceId, targetId: null, mode });
  };

  const moveDrag = (event) => {
    const active = dragRef.current;
    if (!active) return;
    event.preventDefault();
    const target = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest?.("[data-party-id]")?.dataset?.partyId;

    const targetId =
      active.mode === "battle-switch"
        ? target === activeBattleId
          ? target
          : null
        : target || null;

    if (targetId === active.targetId) return;
    active.targetId = targetId;
    setDragState({ ...active });
  };

  const finishDrag = (event) => {
    const active = dragRef.current;
    if (!active) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = null;
    setDragState(null);

    if (
      active.mode === "reorder" &&
      active.targetId &&
      active.sourceId !== active.targetId
    )
      onReorder(active.sourceId, active.targetId);

    if (
      active.mode === "battle-switch" &&
      active.targetId === activeBattleId
    )
      onBattleSwitch?.(active.sourceId);

    setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const battleHint = battle?.locked
    ? "Turno em andamento…"
    : battle?.trapped && !battle?.forced
      ? "Troca bloqueada: o Pokémon em campo está preso."
      : battle?.forced
        ? "Arraste um Pokémon apto para o slot que caiu."
        : "Arraste um Pokémon da equipe para o que está em campo.";

  return (
    <aside className="dex-companion">
      <div className="companion-label">
        <Radio size={16} /> EQUIPE CONECTADA <span>{run.party.length}/6</span>
      </div>
      <div className="companion-party">
        {run.party.map((m, i) => {
          const live = liveMon(m.id);
          const hpPercent = live?.maxhp
            ? Math.max(0, Math.min(100, (live.hp / live.maxhp) * 100))
            : 100;
          const draggable = canReorder || canBattleSwitch(m.id);
          const classes = [
            dragState?.sourceId === m.id ? "is-dragging" : "",
            dragState?.targetId === m.id ? "is-drag-target" : "",
            live?.active ? "is-battle-active" : "",
            live?.fainted ? "is-battle-fainted" : "",
            inBattle ? "has-battle-hp" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={m.id}
              data-party-id={m.id}
              className={classes}
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
                className={"party-drag-handle" + (draggable ? " can-drag" : "")}
                title={
                  inBattle
                    ? canBattleSwitch(m.id)
                      ? "Arraste para o Pokémon em campo para trocar"
                      : live?.active
                        ? "Pokémon em campo"
                        : live?.fainted
                          ? "Fora de combate"
                          : "Troca indisponível agora"
                    : canReorder
                      ? "Arraste para mudar a ordem"
                      : "Reordene entre batalhas"
                }
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
                  {inBattle && live
                    ? live.fainted
                      ? "FORA DE COMBATE"
                      : live.active
                        ? "EM CAMPO"
                        : "PRONTO PARA TROCA"
                    : i === 0
                      ? "Abre a batalha"
                      : "Pronto para a jornada"}
                </small>
              </span>
              <b>Lv.{live?.level || m.level}</b>
              {inBattle && live && (
                <div className="companion-hp-row">
                  <span
                    className={
                      "companion-mini-hp" + (hpPercent <= 25 ? " low" : "")
                    }
                    aria-label={`${live.hp} de ${live.maxhp} HP`}
                  >
                    <i style={{ width: hpPercent + "%" }} />
                  </span>
                  <small>
                    {live.hp}/{live.maxhp} HP
                  </small>
                </div>
              )}
            </button>
          );
        })}
        {Array.from({ length: 6 - run.party.length }, (_, i) => (
          <div key={i} className="companion-empty">
            <span>0{run.party.length + i + 1}</span>
            <span>AGUARDANDO POKÉMON</span>
          </div>
        ))}
      </div>
      <p className="companion-drag-hint">
        {inBattle
          ? battleHint
          : canReorder
            ? "Arraste ⋮⋮ para reorganizar a ordem."
            : "A ordem pode ser alterada entre batalhas."}
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
