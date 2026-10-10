import { useState } from "react";
import { ROUTE_COVERS } from "../../game/data/routeCovers.js";
import { RouteCover } from "../../components/scenery/RouteCover.jsx";

const covers = Object.values(ROUTE_COVERS);
const regions = [...new Set(covers.map((cover) => cover.region))];

export function CoverCredits() {
  const [region, setRegion] = useState("");
  return (
    <details className="cover-credits">
      <summary>Imagens das cidades e créditos ({covers.length})</summary>
      <p>
        Mapas, cenas e artes dos jogos correspondentes a cada lugar. As fichas
        abaixo registram a fonte e o responsável pelo upload nos Bulbagarden
        Archives.
      </p>
      <label className="cover-region-filter">
        Região
        <select
          value={region}
          onChange={(event) => setRegion(event.target.value)}
        >
          <option value="">Todas as regiões</option>
          {regions.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </label>
      <div className="cover-gallery">
        {covers
          .filter((cover) => !region || cover.region === region)
          .map((cover) => (
            <figure key={cover.id}>
              <RouteCover cover={cover} />
              <figcaption>
                <a href={cover.sourceUrl} target="_blank" rel="noreferrer">
                  {cover.name}
                </a>
                <span>{cover.game}</span>
                <small>Upload: {cover.credit}</small>
              </figcaption>
            </figure>
          ))}
      </div>
      <p>
        Gráficos: Game Freak / Nintendo / The Pokémon Company.{" "}
        <a
          href="https://archives.bulbagarden.net/wiki/Archives:Copyrights"
          target="_blank"
          rel="noreferrer"
        >
          Atribuição e informações da fonte
        </a>
        .
      </p>
    </details>
  );
}
