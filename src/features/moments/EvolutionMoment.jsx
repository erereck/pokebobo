import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Modal } from "../../components/ui/Modal.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { ShinyMark } from "../../components/pokemon/ShinyMark.jsx";
import { TypeTag } from "../../components/pokemon/TypeTag.jsx";
import { MomentProgress } from "./MomentProgress.jsx";
import catalog from "../../game/catalog.json" with { type: "json" };

export function EvolutionMoment({ moment, remaining, onClose, onSkipAll }) {
  const [loaded, setLoaded] = useState({});
  const ready = loaded.before && loaded.after;
  return (
    <Modal title="Uma nova forma" className="evolution-moment" onClose={onClose}>
      <div className={`evolution-stage${ready ? " is-ready" : ""}`} aria-hidden="true">
        <div className="evolution-orbit" />
        <div className="evolution-orbit orbit-inner" />
        <Sprite
          name={moment.from}
          shiny={moment.shiny}
          className="evolution-before"
          onLoad={() => setLoaded((current) => ({ ...current, before: true }))}
        />
        <Sprite
          name={moment.to}
          shiny={moment.shiny}
          className="evolution-after"
          onLoad={() => setLoaded((current) => ({ ...current, after: true }))}
        />
      </div>
      <div className="evolution-announcement">
        <span className="eyebrow">
          EVOLUÇÃO · NÍVEL {moment.level}
          {moment.total > 1 ? ` · ${moment.index}/${moment.total}` : ""}
        </span>
        <p>{moment.from} evoluiu para</p>
        <h3>{moment.to} <ShinyMark shiny={moment.shiny} /></h3>
        <div className="types">
          {catalog[moment.to]?.types.map((type) => (
            <TypeTag key={type} type={type} />
          ))}
        </div>
      </div>
      <div className={`moment-actions${remaining > 1 ? " can-skip" : ""}`}>
        <button className="button primary full" onClick={onClose} autoFocus>
          Continuar <ArrowRight size={18} />
        </button>
        {remaining > 1 && (
          <button className="button secondary" onClick={onSkipAll}>Pular demais</button>
        )}
        <MomentProgress onComplete={onClose} />
      </div>
    </Modal>
  );
}
