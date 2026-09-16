import { ROUTE_COVERS } from "../../game/data/routeCovers.js";
import { RouteCover } from "../../components/scenery/RouteCover.jsx";

export function CoverCredits() {
  return (
    <details className="cover-credits">
      <summary>Ver as seis paisagens e os créditos</summary>
      <p>
        Referências de Hoenn para ambientar as rotas. As cidades do seu draft
        continuam as escolhidas por você. Mapas de Pokémon Emerald, via The
        Spriters Resource.
      </p>
      <div className="cover-gallery">
        {Object.values(ROUTE_COVERS).map((cover) => (
          <figure key={cover.id}>
            <RouteCover cover={cover} />
            <figcaption>
              <a href={cover.sourceUrl} target="_blank" rel="noreferrer">
                {cover.name}
              </a>
              <span>Extração: {cover.credit}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p>
        Gráficos: Game Freak / Nintendo / The Pokémon Company. Piloto local não
        comercial.{" "}
        <a
          href="https://www.spriters-resource.com/page/tou/"
          target="_blank"
          rel="noreferrer"
        >
          Termos da fonte
        </a>
        .
      </p>
    </details>
  );
}
