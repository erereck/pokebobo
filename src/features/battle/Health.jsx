import { ShinyMark } from "../../components/pokemon/ShinyMark.jsx";
import { Hourglass } from "lucide-react";

export function Health({ mon: m, future }) {
  const ratio = Math.max(0, Math.min(1, m.hp / m.maxhp));
  return (
    <div className="health-card">
      <div>
        <strong>
          {m.name} <ShinyMark shiny={m.shiny} />
        </strong>
        <span>NV. {m.level}</span>
      </div>
      <div className="hp-line">
        <span>HP</span>
        <div
          className={"hp-meter" + (ratio < 0.25 ? " low" : "")}
          role="progressbar"
          aria-label={"HP de " + m.name}
          aria-valuemin="0"
          aria-valuemax={m.maxhp}
          aria-valuenow={m.hp}
        >
          <span style={{ width: `${ratio * 100}%` }} />
        </div>
      </div>
      <small>
        {m.status && <b>{m.status.toUpperCase()} · </b>}
        {m.hp} / {m.maxhp}
      </small>
      {future && (
        <span
          className="future-marker"
          title={`${future.move} chega em ${future.turnsRemaining} ${future.turnsRemaining === 1 ? "turno" : "turnos"}`}
        >
          <Hourglass size={11} aria-hidden="true" />
          {future.move} · {future.turnsRemaining}
        </span>
      )}
    </div>
  );
}
