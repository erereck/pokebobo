import { Ball } from "../../components/icons/Ball.jsx";
export function BattleBench({ snap }) {
  return (
    <div className="battle-bench">
      {[
        [snap.player, "Sua equipe"],
        [snap.enemy, "Equipe rival"],
      ].map(([party, label]) => (
        <div key={label} aria-label={label}>
          {party.map((p, i) => (
            <span
              key={i}
              className={p.fainted ? "fainted" : p.active ? "active" : ""}
              title={p.name + (p.fainted ? " · fora de combate" : "")}
            >
              <Ball size={12} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
