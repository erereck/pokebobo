import { cx } from "../../shared/classNames.js";
import { Check } from "lucide-react";
import { Trophy } from "lucide-react";
import { Tag } from "../../components/ui/Tag.jsx";

export function LeagueLineup({ r }) {
  return (
    <div className="league-lineup">
      {r.league.map((t, i) => (
        <div
          key={i}
          className={cx(
            i < r.leagueIndex && "beaten",
            i === r.leagueIndex && "current",
          )}
        >
          <span>
            {i < r.leagueIndex ? (
              <Check size={18} />
            ) : i === 4 ? (
              <Trophy size={18} />
            ) : (
              String(i + 1).padStart(2, "0")
            )}
          </span>
          <div>
            <strong>{t.name}</strong>
            <small>
              {t.region} · {i === 4 ? "Campeão" : "Elite Four"}
            </small>
          </div>
          {i === r.leagueIndex && <Tag>AGORA</Tag>}
        </div>
      ))}
    </div>
  );
}
