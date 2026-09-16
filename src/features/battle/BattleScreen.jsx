import { useMemo, useState, useEffect } from "react";
import { BookOpen, RotateCcw } from "lucide-react";
import { restoreBattle } from "../../game/battle/restore.js";
import { battleSnapshot } from "../../game/battle/snapshot.js";
import { useBattleKeys } from "./useBattleKeys.js";
import catalog from "../../game/catalog.json" with { type: "json" };
import { BattleArena } from "./BattleArena.jsx";
import { BattleBench } from "./BattleBench.jsx";
import { MoveOptions } from "./MoveOptions.jsx";
import { SwitchOptions } from "./SwitchOptions.jsx";
import { Modal } from "../../components/ui/Modal.jsx";

export function BattleScreen({ run: r, act }) {
  const snap = useMemo(() => {
    const battle = restoreBattle(r.battle);
    try {
      return battleSnapshot(battle);
    } finally {
      battle.destroy();
    }
  }, [r.battle]);
  const [switching, setSwitching] = useState(false),
    [logOpen, setLogOpen] = useState(false),
    [locked, setLocked] = useState(false);
  const forced = Boolean(snap.request?.forceSwitch),
    current = snap.active;
  useEffect(() => {
    setLocked(false);
    setSwitching(false);
  }, [r.battle.choices.length]);
  const move = (choice) => {
    if (locked) return;
    setLocked(true);
    if (act({ type: "BATTLE_CHOICE", choice }) === false) setLocked(false);
  };
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
          <strong>{String(snap.turn).padStart(2, "0")}</strong>
        </div>
      </header>
      <div className="battle-field">
        <BattleArena r={r} snap={snap} current={current} />
        <BattleBench snap={snap} />
      </div>
      <div className="battle-comment" role="status" aria-live="polite">
        <p>{snap.log.slice(-2).join(" ") || "Escolha seu primeiro golpe."}</p>
      </div>
      <section className="battle-controls" aria-label="Decisão do turno">
        <div className="battle-control-heading">
          <h2>
            {forced
              ? "Quem continua?"
              : switching
                ? "Quem entra?"
                : current.name + " vai…"}
          </h2>
          <div className="battle-tools">
            {!forced && (
              <button
                className="text-button"
                disabled={locked || snap.request?.active?.[0]?.trapped}
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
              onClick={() => setLogOpen(true)}
            >
              <BookOpen size={18} />
            </button>
          </div>
        </div>
        {forced || switching ? (
          <SwitchOptions snap={snap} locked={locked} move={move} />
        ) : (
          <MoveOptions
            available={snap.request?.active?.[0]?.moves || []}
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
