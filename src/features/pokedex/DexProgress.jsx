import { regionProgress } from "./dexModel.js";

export function DexProgress({ index, region, onRegion }) {
  return (
    <details className="dex-progress">
      <summary>
        Progresso por região <span>Catálogo disponível no jogo</span>
      </summary>
      <div className="dex-region-grid">
        {regionProgress(index).map((item) => (
          <button
            key={item.name}
            type="button"
            aria-pressed={region === item.name}
            onClick={() => onRegion(region === item.name ? "all" : item.name)}
          >
            <span>
              <strong>{item.name}</strong>
              <b>
                {item.registered}
                <small>/{item.total}</small>
              </b>
            </span>
            <progress
              aria-label={
                item.name +
                ": " +
                item.registered +
                " de " +
                item.total +
                " registrados"
              }
              value={item.registered}
              max={item.total}
            />
            <small>
              {item.shiny
                ? "✦ " + item.shiny + " shiny" + (item.shiny > 1 ? "s" : "")
                : Math.round((item.registered / item.total) * 100) +
                  "% registrado"}
            </small>
          </button>
        ))}
      </div>
    </details>
  );
}
