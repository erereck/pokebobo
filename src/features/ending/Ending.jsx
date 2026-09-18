import { cx } from "../../shared/classNames.js";
import { Trophy } from "lucide-react";
import { Flag } from "lucide-react";
import { Brand } from "../../components/brand/Brand.jsx";
import { BadgeStrip } from "../../components/progress/BadgeStrip.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { Lock } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Medal } from "lucide-react";

export function Ending({ run: r, meta, onNew, onHall }) {
  return (
    <main className="ending">
      <div className={cx("result-emblem", !r.won && "lost")}>
        {r.won ? <Trophy size={43} /> : <Flag size={43} />}
      </div>
      <span className="eyebrow">
        RUN {String(r.number).padStart(3, "0")} · PÁGINA ENCERRADA
      </span>
      <h1>
        {r.won ? "Pode chamar de campeão." : "Toda run deixa uma história."}
      </h1>
      <p>
        {r.won
          ? `${r.name}, você fez a sua região e conquistou a Liga.`
          : "Você pode perder a equipe. O que aprendeu vem com você."}
      </p>
      <div className="ending-passport">
        <div>
          <Brand />
          <span className="mono">
            {r.won ? "CAMPEÃO DA LIGA" : "CADERNO DE CAMPO"}
          </span>
        </div>
        <h2>{r.name}</h2>
        <BadgeStrip count={r.badges} />
        <div className="record-grid">
          <div>
            <strong>{r.week}</strong>
            <span>semanas de estrada</span>
          </div>
          <div>
            <strong>{r.badges}/8</strong>
            <span>insígnias</span>
          </div>
          <div>
            <strong>{meta.best}/8</strong>
            <span>melhor marca</span>
          </div>
        </div>
        <div className="ending-party">
          {r.party.map((m) => (
            <Sprite key={m.id} name={m.name} />
          ))}
        </div>
      </div>
      {r.won && (
        <div className="unlock-note">
          <Lock size={21} />
          <div>
            <b>Novas formas de se complicar.</b>
            <p>Correria e Nuzlocke estão liberados para as próximas runs.</p>
          </div>
        </div>
      )}
      <div className="ending-actions">
        <button className="button secondary" onClick={onHall}>
          <Medal size={18} />
          Ver Hall da Fama
        </button>
      <button className="button primary" onClick={onNew}>
        Outra região. Outra história.
        <ArrowRight size={19} />
      </button>
      </div>
    </main>
  );
}
