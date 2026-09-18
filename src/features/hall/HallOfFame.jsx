import {
  BookOpen,
  Flag,
  MapPin,
  Medal,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Modal } from "../../components/ui/Modal.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { BadgeStrip } from "../../components/progress/BadgeStrip.jsx";
import { cx } from "../../shared/classNames.js";

const MODE_LABELS = {
  normal: "Clássico",
  rush: "Correria",
  nuzlocke: "Nuzlocke",
};

function teamName(mon) {
  return typeof mon === "string" ? mon : mon?.name;
}

function teamLevel(mon) {
  return typeof mon === "string" ? 0 : mon?.level || 0;
}

function endingLabel(run) {
  if (run.won) return "CAMPEÃO";
  if (run.reason === "abandoned") return "JORNADA ENCERRADA";
  if (run.reason === "nuzlocke") return "SEM SOBREVIVENTES";
  if (run.badges >= 8)
    return run.leagueIndex
      ? `LIGA · ${Math.min(run.leagueIndex, 4)}/4 ELITE`
      : "CLASSIFICADO À LIGA";
  return `${run.badges}/8 INSÍGNIAS`;
}

export function HallOfFame({ meta, onClose }) {
  const history = meta.history || [];
  const champions = history.filter((run) => run.won).length;
  return (
    <Modal title="Hall da Fama" onClose={onClose} className="hall-dialog">
      <section className="hall-of-fame">
        <div className="hall-banner">
          <div className="hall-trophy">
            <Trophy size={40} />
          </div>
          <div>
            <span className="eyebrow">ARQUIVO DE CARREIRAS</span>
            <h3>Todo campeão chegou até aqui. Toda derrota também.</h3>
            <p>
              O Hall preserva as jornadas encerradas, com ou sem título da
              Liga.
            </p>
          </div>
          <div className="hall-stats">
            <span>
              <strong>{history.length}</strong>
              registradas
            </span>
            <span>
              <strong>{champions}</strong>
              campeãs
            </span>
            <span>
              <strong>{meta.best}/8</strong>
              melhor marca
            </span>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="hall-empty">
            <Flag size={34} />
            <h3>Nenhuma página encerrada ainda.</h3>
            <p>Quando uma run terminar, ela ganha um lugar aqui.</p>
          </div>
        ) : (
          <div className="hall-grid">
            {history.map((run) => (
              <article
                className={cx("hall-card", run.won && "is-champion")}
                key={run.id}
              >
                <header>
                  <span className="hall-run-number">
                    RUN {String(run.id).padStart(3, "0")}
                  </span>
                  <span className="hall-result">
                    {run.won ? <Medal size={14} /> : <Flag size={14} />}
                    {endingLabel(run)}
                  </span>
                </header>

                <div className="hall-trainer">
                  <div>
                    <span>{MODE_LABELS[run.mode] || "Clássico"}</span>
                    <h3>{run.name}</h3>
                  </div>
                  {run.won && <Sparkles size={24} />}
                </div>

                <BadgeStrip count={run.badges} />

                <div className="hall-team" aria-label="Equipe final">
                  {(run.team || []).slice(0, 6).map((mon, index) => (
                    <div key={typeof mon === "string" ? mon + index : mon.id || index}>
                      <Sprite name={teamName(mon)} />
                      {teamLevel(mon) > 0 && <small>Lv.{teamLevel(mon)}</small>}
                    </div>
                  ))}
                </div>

                <div className="hall-facts">
                  <span>
                    <b>{run.week}</b>
                    semanas
                  </span>
                  <span>
                    <b>{run.badges}/8</b>
                    insígnias
                  </span>
                  <span>
                    <b>{run.events || 0}</b>
                    acontecimentos
                  </span>
                </div>

                {run.route?.length > 0 && (
                  <div className="hall-route">
                    <MapPin size={14} />
                    <p>
                      {run.route
                        .map((stop) =>
                          typeof stop === "string" ? stop : stop?.name,
                        )
                        .filter(Boolean)
                        .join(" → ")}
                    </p>
                  </div>
                )}

                {run.highlights?.length > 0 && (
                  <details className="hall-highlights">
                    <summary>
                      <BookOpen size={14} />
                      Momentos da jornada
                    </summary>
                    {run.highlights.slice(0, 5).map((item, index) => (
                      <p key={index}>
                        <b>S{item.week}</b> {item.text}
                      </p>
                    ))}
                  </details>
                )}

                <footer>
                  {run.won
                    ? "Título conquistado e registrado para sempre."
                    : run.reason === "abandoned"
                      ? "A jornada foi encerrada pelo treinador."
                      : run.opponent
                        ? `Último adversário: ${run.opponent}.`
                        : "A jornada terminou antes do título."}
                  {run.seed ? <small>Seed {run.seed}</small> : null}
                </footer>
              </article>
            ))}
          </div>
        )}
      </section>
    </Modal>
  );
}
