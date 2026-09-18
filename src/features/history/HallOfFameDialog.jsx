import { Archive, BookOpen, Flag, Trophy } from "lucide-react";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { cx } from "../../shared/classNames.js";

const MODE_LABELS = {
  normal: "Clássico",
  rush: "Correria",
  nuzlocke: "Nuzlocke",
  legacy: "Registro antigo",
};

function monsOf(names, levels) {
  if (!Array.isArray(names)) return [];
  return names
    .map((mon, index) => ({
      name: typeof mon === "string" ? mon : mon?.name,
      level: levels?.[index] ?? (typeof mon === "object" && mon ? mon.level : null),
    }))
    .filter((mon) => mon.name);
}

function endingLabel(run) {
  if (run.won || run.ending === "champion") return "CAMPEÃO";
  if (run.ending === "retired") return "ENCERRADA";
  return "DERROTA";
}

function endingCopy(run) {
  if (run.won)
    return `${run.badges}/8 insígnias · Liga conquistada na semana ${run.week}.`;
  if (run.ending === "retired")
    return `${run.badges}/8 insígnias · a jornada foi encerrada na semana ${run.week}.`;
  return `${run.badges}/8 insígnias · a run terminou na semana ${run.week}.`;
}

function MonStrip({ mons }) {
  return mons.map((mon, monIndex) => (
    <div key={`${mon.name}-${monIndex}`}>
      <Sprite name={mon.name} />
      <small>{mon.level ? `Lv.${mon.level}` : mon.name}</small>
    </div>
  ));
}

export function HallOfFameDialog({ history = [], onClose }) {
  const champions = history.filter((run) => run.won).length;
  const best = history.reduce(
    (maximum, run) => Math.max(maximum, Number(run.badges) || 0),
    0,
  );

  return (
    <Modal className="hall-dialog" title="Hall da Fama" onClose={onClose}>
      <section className="hall-hero">
        <div className="hall-trophy">
          <Trophy size={34} />
        </div>
        <div>
          <span className="section-label">ARQUIVO DE CARREIRA</span>
          <h3>Toda run merece uma moldura.</h3>
          <p>
            Campeões ficam em destaque, mas derrotas e jornadas encerradas
            também permanecem aqui. O Hall é a história inteira do treinador.
          </p>
        </div>
      </section>

      <div className="hall-summary">
        <div>
          <strong>{history.length}</strong>
          <span>runs registradas</span>
        </div>
        <div>
          <strong>{champions}</strong>
          <span>títulos da Liga</span>
        </div>
        <div>
          <strong>{best}/8</strong>
          <span>melhor marca</span>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="hall-empty">
          <BookOpen size={34} />
          <b>O primeiro espaço ainda está vazio.</b>
          <p>Quando uma run terminar, campeã ou não, ela aparece aqui.</p>
        </div>
      ) : (
        <div className="hall-grid">
          {history.map((run, index) => {
            const team = monsOf(run.team, run.levels);
            const reserve = monsOf(run.box, run.boxLevels);
            return (
              <article
                className={cx("hall-card", run.won && "is-champion")}
                key={`${run.id}-${index}`}
              >
                <div className="hall-card-top">
                  <span className="hall-run-number">
                    RUN {String(run.id || index + 1).padStart(3, "0")}
                  </span>
                  <span className="hall-ending">
                    {run.won ? <Trophy size={13} /> : <Flag size={13} />}
                    {endingLabel(run)}
                  </span>
                </div>
                <h3>{run.name || "Treinador"}</h3>
                <p>{endingCopy(run)}</p>

                <div className="hall-team" aria-label="Equipe final">
                  {team.length ? (
                    <MonStrip mons={team} />
                  ) : (
                    <span className="muted small">Equipe não registrada.</span>
                  )}
                </div>

                {reserve.length > 0 && (
                  <div className="hall-reserve">
                    <span><Archive size={12} /> RESERVA</span>
                    <div className="hall-team"><MonStrip mons={reserve} /></div>
                  </div>
                )}

                <div className="hall-facts">
                  <span>{MODE_LABELS[run.mode] || "Clássico"}</span>
                  <span>semana {run.week || 1}</span>
                  {run.seed ? <span>seed {run.seed}</span> : null}
                </div>
                {run.opponent ? (
                  <small className="hall-opponent">
                    Último rival: <b>{run.opponent}</b>
                  </small>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
