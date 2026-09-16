import { Check, Trophy, MapPin } from "lucide-react";
export function RegionMap({ run }) {
  const nodes = [
    ...run.route,
    { id: "league", name: "Liga Pokémon", region: "Desafio final" },
  ].map((n, i) => {
    const row = Math.floor(i / 3),
      column = row % 2 ? 2 - (i % 3) : i % 3;
    return { ...n, index: i, x: 16 + column * 34, y: 11 + row * 25 };
  });
  const current = run.inLeague ? 10 : run.position;
  return (
    <div className="region-map" aria-label="Percurso da região">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline
          points={nodes.map((n) => n.x + "," + n.y).join(" ")}
          className="map-path"
        />
        <polyline
          points={nodes
            .filter((n) => n.index <= current)
            .map((n) => n.x + "," + n.y)
            .join(" ")}
          className="map-path completed"
        />
      </svg>
      {nodes.map((n) => (
        <div
          key={n.id}
          className={
            "map-node " +
            (n.index === current
              ? "current"
              : n.index < current
                ? "visited"
                : "")
          }
          style={{ left: n.x + "%", top: n.y + "%" }}
          aria-current={n.index === current ? "step" : undefined}
        >
          <span className="map-node-marker">
            {n.index < current ? (
              <Check size={14} />
            ) : n.index === 10 ? (
              <Trophy size={14} />
            ) : n.index === current ? (
              <MapPin size={14} />
            ) : (
              String(n.index + 1).padStart(2, "0")
            )}
          </span>
          <strong>{n.name}</strong>
          <small>
            {n.index === current
              ? "VOCÊ ESTÁ AQUI"
              : n.index < current
                ? "CONCLUÍDO"
                : n.region}
          </small>
        </div>
      ))}
    </div>
  );
}
