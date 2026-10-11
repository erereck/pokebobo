import { useState } from "react";
import { Sprite } from "../../components/pokemon/Sprite.jsx";

export function DexVariants({ name, normal, shiny, preferShiny, onVariant }) {
  const [view, setView] = useState(
    (preferShiny && shiny) || (!normal && shiny) ? "shiny" : "normal",
  );
  const choose = (value) => {
    setView(value);
    onVariant(value === "compare" ? "all" : value);
  };
  return (
    <div className="dex-variants">
      <div className="dex-variant-controls" aria-label="Visualizar variantes">
        <button
          aria-pressed={view === "normal"}
          onClick={() => choose("normal")}
        >
          Normal{normal ? " ✓" : ""}
        </button>
        <button
          disabled={!shiny}
          aria-pressed={view === "shiny"}
          onClick={() => choose("shiny")}
        >
          ✦ Shiny{shiny ? " ✓" : ""}
        </button>
        {normal && shiny && (
          <button
            aria-pressed={view === "compare"}
            onClick={() => choose("compare")}
          >
            Comparar
          </button>
        )}
      </div>
      <div
        className={
          "dex-variant-stage" + (view === "compare" ? " is-comparison" : "")
        }
      >
        {(view === "compare" ? [false, true] : [view === "shiny"]).map(
          (isShiny) => (
            <figure key={String(isShiny)} className={isShiny ? "is-shiny" : ""}>
              <Sprite name={name} shiny={isShiny} battleStyle="2d" />
              <figcaption>
                {isShiny
                  ? "✦ Shiny registrado"
                  : normal
                    ? "Normal registrado"
                    : "Normal · ainda não registrado"}
              </figcaption>
            </figure>
          ),
        )}
      </div>
      {!shiny && (
        <p className="fine-print">
          A variante shiny aparece aqui quando você registrar uma. Chance de
          1/1024 por Pokémon novo.
        </p>
      )}
    </div>
  );
}
