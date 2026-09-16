import { RouteCover } from "../../components/scenery/RouteCover.jsx";
import { BIOMES } from "../../game/data/biomes.js";
import { ArrowUpRight } from "lucide-react";

export function CityChoice({ c, act, origin, i }) {
  return (
    <button
      key={c.id}
      className="city-choice"
      onClick={() =>
        act({
          type: origin ? "ORIGIN" : "DRAFT",
          id: c.id,
        })
      }
    >
      <div className="city-image">
        <RouteCover place={c} />
        <span className="city-region">{c.region.toUpperCase()}</span>
        <span className="city-pick-number">0{i + 1}</span>
      </div>
      <div className="city-choice-text">
        <div>
          <span className="section-label">
            {origin
              ? "CIDADE INICIAL"
              : c.kind === "town"
                ? "CIDADE DE PASSAGEM"
                : c.order + "º GINÁSIO"}
          </span>
          <h2>{c.name}</h2>
          <p>{c.flavor || BIOMES[c.biome]}</p>
        </div>
        <span className="choice-arrow">
          <ArrowUpRight size={21} />
        </span>
      </div>
    </button>
  );
}
