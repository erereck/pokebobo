import { cx } from "../../shared/classNames.js";
import { Check } from "lucide-react";
import { MapPin } from "lucide-react";
import { Trophy } from "lucide-react";

export function RouteList({ run: r, compact = false }) {
  let nodes = r.route.map((c, i) => ({
    ...c,
    index: i,
  }));
  if (compact) {
    nodes = nodes.filter(
      (n) =>
        n.index >= Math.max(0, r.position - 1) && n.index <= r.position + 3,
    );
  }
  return (
    <div className={cx("route-list", compact && "compact")}>
      {nodes.map((c) => (
        <div
          className={cx(
            "route-stop",
            r.phase !== "ready" && c.index === r.position && "current",
            c.index < r.position && "visited",
          )}
          key={c.id}
        >
          <span className="route-marker">
            {c.index < r.position ? (
              <Check size={12} />
            ) : c.kind === "gym" ? (
              <span className="tiny-diamond" />
            ) : (
              <MapPin size={12} />
            )}
          </span>
          <div>
            <strong>{c.name}</strong>
            <small>
              {c.region}
              {!compact
                ? ` · ${c.kind === "gym" ? "Ginásio" : c.kind === "origin" ? "Início" : "Passagem"}`
                : ""}
            </small>
          </div>
          {c.index === r.position && r.phase !== "ready" && (
            <span className="you-label">VOCÊ</span>
          )}
        </div>
      ))}
      {(!compact || r.position >= 6) && (
        <div className={cx("route-stop", r.inLeague && "current")}>
          <span className="route-marker">
            <Trophy size={14} />
          </span>
          <div>
            <strong>Liga Pokémon</strong>
            <small>Elite Four + Campeão</small>
          </div>
        </div>
      )}
    </div>
  );
}
