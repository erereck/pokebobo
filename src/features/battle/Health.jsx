export function Health({ mon: m }) {
  return (
    <div className="health-card">
      <div>
        <strong>{m.name}</strong>
        <span>NV. {m.level}</span>
      </div>
      <div className="hp-line">
        <span>HP</span>
        <progress
          aria-label={"HP de " + m.name}
          max={m.maxhp}
          value={m.hp}
          className={m.hp / m.maxhp < 0.25 ? "low" : ""}
        />
      </div>
      <small>
        {m.status && <b>{m.status.toUpperCase()} · </b>}
        {m.hp} / {m.maxhp}
      </small>
    </div>
  );
}
