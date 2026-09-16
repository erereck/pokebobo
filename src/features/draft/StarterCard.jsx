import { cx } from "../../shared/classNames.js";
import catalog from "../../game/catalog.json" with { type: "json" };
import { Check } from "lucide-react";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { TypeTag } from "../../components/pokemon/TypeTag.jsx";
import { STARTER_NOTES } from "../../game/data/starterNotes.js";

export function StarterCard({ n, selected, setSelected }) {
  return (
    <button
      key={n}
      className={cx("starter-card", selected === n && "selected")}
      aria-pressed={selected === n}
      onClick={() => setSelected(n)}
    >
      <span className="starter-top">
        <span className="mono">
          Nº {String(catalog[n].num).padStart(3, "0")}
        </span>
        <span className="selection-circle">
          {selected === n && <Check size={15} />}
        </span>
      </span>
      <div className="starter-portrait">
        <Sprite name={n} />
      </div>
      <h2>{n}</h2>
      <div className="types">
        {catalog[n].types.map((t) => (
          <TypeTag key={t} type={t} />
        ))}
      </div>
      <p>
        {STARTER_NOTES[n] || "Todo grande time começa com um bom parceiro."}
      </p>
      <span className="starter-stats">
        NV. 10 <span>•</span> {catalog[n].ability}
      </span>
    </button>
  );
}
