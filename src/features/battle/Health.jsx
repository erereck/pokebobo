export function Health({ mon: m }) {
  const ratio = Math.max(0, Math.min(1, m.hp / m.maxhp));
  return (
    <div className="health-card">
      <div>
        <strong>{m.name}</strong>
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
    </div>
  );
}
