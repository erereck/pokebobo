import { MapPin, Sprout, Award } from "lucide-react";
import { Ball } from "../icons/Ball.jsx";
import { city } from "../../game/selectors/city.js";
export function MissionHUD({ run, saving }) {
  return (
    <div className="mission-hud">
      <div className="mission-place">
        <MapPin size={16} />
        <strong>{run.inLeague ? "Liga Pokémon" : city(run).name}</strong>
        <span className="hud-week">SEM. {run.week}</span>
      </div>
      <div className="mission-stock">
        <span
          className="hud-badges"
          aria-label={run.badges + " de 8 insígnias"}
        >
          <Award size={15} />
          <b>{run.badges}/8</b>
        </span>
        <span title="Poké Bolas" aria-label={run.balls + " Poké Bolas"}>
          <Ball size={16} />
          <b>{run.balls}</b>
        </span>
        <span
          title="Kits de berries"
          aria-label={run.berries + " kits de berries"}
        >
          <Sprout size={16} />
          <b>{run.berries}</b>
        </span>
        <i
          className={saving ? "save-light" : "save-light failed"}
          title={saving ? "Progresso salvo" : "Save indisponível"}
          aria-label={saving ? "Progresso salvo" : "Save indisponível"}
        />
      </div>
    </div>
  );
}
