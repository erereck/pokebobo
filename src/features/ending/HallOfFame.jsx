import {
  Award,
  CalendarDays,
  Flag,
  MapPin,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { Sprite } from "../../components/pokemon/Sprite.jsx";

const modeNames = {
  normal: "Clássico",
  rush: "Correria",
  nuzlocke: "Nuzlocke",
};

const reasonNames = {
  champion: "Campeão da Liga",
  defeat: "Derrota em batalha",
  "nuzlocke-out": "Sem sobreviventes",
  abandoned: "Jornada encerrada",
};

function normalizeTeam(team = []) {
  return team.map((member, index) =>
    typeof member === "string"
      ? { id: `legacy-${index}`, name: member, level: null }
      : member,
  );
}

export function HallOfFame({ history = [], compact = false }) {
  if (!history.length) return null;

  return (
    <section className={"hall-of-fame" + (compact ? " compact" : "")}>
      <div className="hall-heading">
        <div>
          <span className="section-label">ARQUIVO PERMANENTE</span>
          <h2>Hall da Fama</h2>
        </div>
        <span className="hall-count">{history.length} carreiras</span>
      </div>

      <div className="hall-grid">
        {history.map((run, index) => {
          const team = normalizeTeam(run.team);
          return (
            <article
              className={"hall-card " + (run.won ? "champion" : "unfinished")}
              key={`${run.id}-${index}`}
            >
              <header>
                <span className="hall-run-number">
                  RUN {String(run.id || index + 1).padStart(3, "0")}
                </span>
                <span className="hall-status">
                  {run.won ? <Trophy size={14} /> : <Flag size={14} />}
                  {reasonNames[run.reason] ||
                    (run.won ? "Campeão da Liga" : "Run encerrada")}
                </span>
              </header>

              <div className="hall-name-row">
                <div>
                  <span>{modeNames[run.mode] || "Clássico"}</span>
                  <h3>{run.name || "Treinador"}</h3>
                </div>
                {run.won ? <Award size={30} /> : <ShieldCheck size={28} />}
              </div>

              <div className="hall-team">
                {team.map((member, teamIndex) => (
                  <div key={member.id || `${member.name}-${teamIndex}`}>
                    <Sprite name={member.name} />
                    <span>
                      {member.level ? `Nv. ${member.level}` : member.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="hall-stats">
                <span>
                  <Trophy size={13} />
                  <b>{run.badges || 0}/8</b> insígnias
                </span>
                <span>
                  <CalendarDays size={13} />
                  <b>{run.week || 0}</b> semanas
                </span>
                {run.origin && (
                  <span>
                    <MapPin size={13} />
                    {run.origin}
                  </span>
                )}
              </div>

              {!compact && (
                <footer>
                  <span>
                    {run.starter ? `Inicial: ${run.starter}` : "Registro legado"}
                  </span>
                  {run.seed ? <span>Seed {run.seed}</span> : null}
                  {run.opponent ? <span>Último rival: {run.opponent}</span> : null}
                </footer>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
