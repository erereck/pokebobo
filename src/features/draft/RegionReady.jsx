import { RouteList } from "../region/RouteList.jsx";
import { Landscape } from "../../components/scenery/Landscape.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { ArrowRight } from "lucide-react";

export function RegionReady({ r, act }) {
  return (
    <div className="ready-grid">
      <div className="ready-map">
        <RouteList run={r} />
      </div>
      <div className="departure-card">
        <Landscape biome={r.route[0].biome} />
        <div>
          <span className="section-label">PRONTO PARA PARTIR</span>
          <h2>
            {r.name} &<br />
            {r.party[0].name}.
          </h2>
          <Sprite name={r.party[0].name} />
          <p>
            Dez cidades, oito insígnias e uma Liga.
            <br />
            Tudo o que acontecer começa aqui.
          </p>
          <button
            className="button primary full"
            onClick={() =>
              act({
                type: "BEGIN",
              })
            }
          >
            Colocar o pé na estrada
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
