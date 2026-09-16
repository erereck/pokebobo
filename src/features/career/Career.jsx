import { city } from "../../game/selectors/city.js";
import { weekLimit } from "../../game/selectors/weekLimit.js";
import { MapPin } from "lucide-react";
import { CityHero } from "./CityHero.jsx";
import { WeekBudget } from "./WeekBudget.jsx";
import { BookOpen } from "lucide-react";

import { WeeklyActions } from "./WeeklyActions.jsx";
import { Route } from "lucide-react";
import { LeagueLineup } from "../league/LeagueLineup.jsx";
import { Trophy } from "lucide-react";
import { Swords } from "lucide-react";
import { Footprints } from "lucide-react";
import { ArrowRight } from "lucide-react";

export function Career({ run: r, act }) {
  const c = city(r),
    remaining = weekLimit(r) - r.spent;
  const inLeague = r.inLeague;
  const next = inLeague ? r.league[r.leagueIndex] : null;
  return (
    <section className={"career-screen" + (inLeague ? " is-league" : "")}>
      <div className="page-meta">
        <span>
          <MapPin size={14} />
          {inLeague
            ? "LIGA POKÉMON"
            : `${c.region.toUpperCase()} · PARADA ${String(r.position + 1).padStart(2, "0")} / 10`}
        </span>
        <span>
          SEMANA <b>{String(r.week).padStart(2, "0")}</b>
        </span>
      </div>
      <CityHero inLeague={inLeague} c={c} r={r} next={next} />
      <WeekBudget inLeague={inLeague} r={r} remaining={remaining} />
      {r.notice && (
        <div className="notice" role="status">
          <BookOpen size={17} />
          <p>{r.notice}</p>
        </div>
      )}

      {!inLeague ? (
        <>
          <div className="section-head action-heading">
            <h2>Escolha sua ação</h2>
            <span className="mono">1 AÇÃO = 1 SEMANA</span>
          </div>
          <WeeklyActions act={act} r={r} />
          <div className="route-hint">
            <Route size={15} />
            <span>{r.routeName}</span>
            <span>{r.encounters.length} espécies</span>
          </div>
        </>
      ) : (
        <LeagueLineup r={r} />
      )}
      <button
        className="button primary challenge-button"
        onClick={() =>
          act({
            type: "CHALLENGE",
          })
        }
      >
        <span>
          {inLeague ? (
            <Trophy size={20} />
          ) : c.kind === "gym" ? (
            <Swords size={20} />
          ) : (
            <Footprints size={20} />
          )}
          <span>
            {inLeague
              ? `Enfrentar ${next.name}`
              : c.kind === "gym"
                ? "Desafiar o ginásio"
                : "Seguir para a próxima cidade"}
            <small>
              {inLeague
                ? "Uma vitória de cada vez."
                : c.kind === "gym"
                  ? "Sem gastar semana. Sem segunda chance."
                  : `Próxima parada: ${r.route[r.position + 1]?.name} · +1 semana`}
            </small>
          </span>
        </span>
        <ArrowRight size={20} />
      </button>
      <p className="fine-print">
        {inLeague
          ? "A equipe se recupera entre vitórias. Uma derrota encerra tudo."
          : `Ao completar ${weekLimit(r)} semanas, ${c.kind === "gym" ? "o ginásio começa" : "você segue viagem"} automaticamente.`}
      </p>
    </section>
  );
}
