import { useMemo, useState, useEffect } from "react";
import { BookOpen, Gauge, RotateCcw } from "lucide-react";
import { restoreBattle } from "../../game/battle/restore.js";
import { battleSnapshot } from "../../game/battle/snapshot.js";
import { useBattleKeys } from "./useBattleKeys.js";
import { useBattlePresentation } from "./useBattlePresentation.js";
import { battleSwitchChoice } from "./sidebarBattle.js";
import catalog from "../../game/catalog.json" with { type: "json" };
import { BattleArena } from "./BattleArena.jsx";
import { BattleBench } from "./BattleBench.jsx";
import { MoveOptions } from "./MoveOptions.jsx";
import { SwitchOptions } from "./SwitchOptions.jsx";
import { Modal } from "../../components/ui/Modal.jsx";

export function BattleScreen({
  run: r,
  act,
  battleControlRef,
  onSidebarState,
}) {
  const snap = useMemo(() => {
    const battle = restoreBattle(r.battle);
    try {
      return battleSnapshot(battle);
    } finally {
      battle.destroy();
    }
  }, [r.battle]);
  const [switching, setSwitching] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const {
    displaySnap,
    message,
    effect,
    locked,
    speed,
    toggleSpeed,
    move,
  } = useBattlePresentation({ battleSpec: r.battle, snap, act });
  const forced = Boolean(displaySnap.request?.forceSwitch);
  const trapped = Boolean(displaySnap.request?.active?.[0]?.trapped);
  const current = displaySnap.active;
  const battleKey = r.battle.seed.join("-");

  const switchTo = (monId) => {
    const choice = battleSwitchChoice(displaySnap, monId, { locked });
    if (!choice) return false;
    move(choice);
    return true;
  };

  if (battleControlRef) battleControlRef.current = { switchTo };

  useEffect(() => {
    onSidebarState?.({
      key: battleKey,
      snap: displaySnap,
      locked,
      forced,
      trapped,
    });
  }, [battleKey, displaySnap, locked, forced, trapped, onSidebarState]);

  useEffect(
    () => () => {
      if (battleControlRef) battleControlRef.current = null;
      onSidebarState?.(null);
    },
    [battleControlRef, onSidebarState],
  );

  useEffect(() => {
    setSwitching(false);
  }, [r.battle.choices.length]);

  useBattleKeys(!locked && !switching && !forced && !logOpen);

  return (
    <section className="battle-screen" aria-label="Batalha">
      <header className="battle-topline">
        <div>
          <span className="section-label">
            {r.battle.kind === "gym"
              ? "GINÁSIO"
              : r.battle.kind === "league"
                ? "LIGA"
                : "NO CAMINHO"}
            {r.battle.boost ? " · LÍDER +" + r.battle.boost : ""}
          </span>
          <h1>
            {r.battle.name}
            <span> vs. você</span>
          </h1>
        </div>
        <div className="turn-marker">
          <span>TURNO</span>
          <strong>{String(displaySnap.turn).padStart(2, "0")}</strong>
        </div>
      </header>
      <div className="battle-field">
        <BattleArena r={r} snap={displaySnap} current={current} effect={effect} />
        <BattleBench snap={displaySnap} />
      </div>
      <div className="battle-comment" role="status" aria-live="polite">
        <p>{message}</p>
      </div>
      <section className="battle-controls" aria-label="Decisão do turno">
        <div className="battle-control-heading">
          <h2>
            {locked
              ? "Turno em andamento…"
              : forced
                ? "Quem continua?"
                : switching
                  ? "Quem entra?"
                  : current.name + " vai…"}
          </h2>
          <div className="battle-tools">
            <button
              className="text-button battle-speed"
              disabled={locked}
              onClick={toggleSpeed}
              aria-label={
                "Velocidade da animação: " +
                (speed === "fast" ? "rápida" : "normal")
              }
              title="Velocidade da animação"
            >
              <Gauge size={15} />
              {speed === "fast" ? "2×" : "1×"}
            </button>
            {!forced && (
              <button
                className="text-button"
                disabled={locked || trapped}
                onClick={() => setSwitching(!switching)}
              >
                <RotateCcw size={15} />
                {switching ? "Golpes" : "Trocar"}
              </button>
            )}
            <button
              className="icon-button"
              aria-label="Ver registro da batalha"
              title="Registro da batalha"
              disabled={locked}
              onClick={() => setLogOpen(true)}
            >
              <BookOpen size={18} />
            </button>
          </div>
        </div>
        {forced || switching ? (
          <SwitchOptions snap={displaySnap} locked={locked} move={move} />
        ) : (
          <MoveOptions
            available={displaySnap.request?.active?.[0]?.moves || []}
            currentMon={catalog[current.name]}
            locked={locked}
            move={move}
          />
        )}
      </section>
      {logOpen && (
        <Modal title="Registro da batalha" onClose={() => setLogOpen(false)}>
          <div className="turn-history">
            {snap.log.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </Modal>
      )}
    </section>
  );
}
