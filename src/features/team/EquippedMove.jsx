import { ChevronDown } from "lucide-react";
import { TypeTag } from "../../components/pokemon/TypeTag.jsx";
import { moveGuide } from "../battle/moveGuide.js";

export function EquippedMove({ id }) {
  const info = moveGuide(id);
  if (!info) return <div><strong>{id}</strong></div>;
  return (
    <div className="equipped-move">
      <details>
        <summary>
          <span className="equipped-move-title">
            <strong>{info.name}</strong>
            <TypeTag type={info.type} />
            <ChevronDown size={14} aria-hidden="true" />
          </span>
          <small>
            {info.category} · Poder {info.power} · {info.accuracy === "Sem teste"
              ? "Sem teste de precisão" : `${info.accuracy} precisão`}
          </small>
        </summary>
        <div className="equipped-move-description">
          <span className="section-label">
            Prioridade {info.priority}{info.contact ? " · Faz contato" : ""}
          </span>
          <ul>
            {info.notes.map((note, index) => <li key={index}>{note}</li>)}
          </ul>
        </div>
      </details>
    </div>
  );
}
