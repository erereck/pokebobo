import { Tag } from "../../components/ui/Tag.jsx";
import { RouteCover } from "../../components/scenery/RouteCover.jsx";
import { MapPin } from "lucide-react";
import { gymChallenge } from "../../game/selectors/gymChallenge.js";

export function CityHero({ inLeague, c, r, next }) {
  const challenge = !inLeague && c.kind === "gym" ? gymChallenge(r, c) : null;
  return (
    <section className="city-hero">
      <div className="city-hero-copy">
        <Tag>
          {inLeague
            ? "DESAFIO DA LIGA"
            : c.kind === "gym"
              ? "GINÁSIO"
              : "PONTO DE APOIO"}
        </Tag>
        <h1>
          {inLeague ? "Liga Pokémon" : c.name}
          <span>.</span>
        </h1>
        <p>
          {inLeague
            ? `${r.leagueIndex < 4 ? "Elite Four" : "Campeão"} · ${next.name} espera por você.`
            : c.kind === "origin"
              ? "A mochila está pronta. O resto você descobre no caminho."
              : c.kind === "town"
                ? "Respire. Prepare a equipe. A Liga ainda está longe."
                : "Prepare seu time antes de desafiar o líder."}
        </p>
        {challenge && (
          <div className="gym-readiness">
            <span>
              Desafio{" "}
              <strong>
                nv. {Math.min(...challenge.levels)}–{challenge.ace}
              </strong>
            </span>
            <span>
              Seu mais forte{" "}
              <strong>nv. {Math.max(...r.party.map((p) => p.level))}</strong>
            </span>
            {challenge.boost > 0 && (
              <span title="Todos os Pokémon do líder receberam este bônus de nível">
                Líder +{challenge.boost}
              </span>
            )}
          </div>
        )}
      </div>
      <RouteCover place={inLeague ? { biome: "mountain" } : c} />
      <div className="location-label">
        <MapPin size={12} />
        {inLeague ? "PLANALTO DA LIGA" : c.name.toUpperCase()}
      </div>
    </section>
  );
}
