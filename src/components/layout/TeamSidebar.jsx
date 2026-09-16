import { Sprite } from "../pokemon/Sprite.jsx";
import { BadgeStrip } from "../progress/BadgeStrip.jsx";
import { ChevronRight, Radio } from "lucide-react";
export function TeamSidebar({ run, onTeam }) {
  return (
    <aside className="dex-companion">
      <div className="companion-label">
        <Radio size={16} /> EQUIPE CONECTADA <span>{run.party.length}/6</span>
      </div>
      <div className="companion-party">
        {run.party.map((m, i) => (
          <button key={m.id} onClick={() => onTeam(m.id)}>
            <span className="slot-number">0{i + 1}</span>
            <Sprite name={m.name} />
            <span>
              <strong>{m.name}</strong>
              <small>
                {i === 0 ? "Abre a batalha" : "Pronto para a jornada"}
              </small>
            </span>
            <b>Lv.{m.level}</b>
          </button>
        ))}
        {Array.from({ length: 6 - run.party.length }, (_, i) => (
          <div key={i} className="companion-empty">
            <span>0{run.party.length + i + 1}</span>
            <span>AGUARDANDO POKÉMON</span>
          </div>
        ))}
      </div>
      <button className="companion-link" onClick={() => onTeam()}>
        Consultar equipe e golpes <ChevronRight size={16} />
      </button>
      <div className="badge-console">
        <div className="section-head">
          <span>INSÍGNIAS</span>
          <b>{run.badges}/8</b>
        </div>
        <BadgeStrip count={run.badges} />
      </div>
      <div className="trainer-display">
        <small>TREINADOR / RUN {String(run.number).padStart(3, "0")}</small>
        <strong>{run.name}</strong>
        <span>
          {run.mode === "rush"
            ? "Correria"
            : run.mode === "nuzlocke"
              ? "Nuzlocke"
              : "Clássico"}
        </span>
      </div>
      <div className="speaker-grille" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
    </aside>
  );
}
