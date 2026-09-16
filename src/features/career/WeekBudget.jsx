import { weekLimit } from "../../game/selectors/weekLimit.js";
import { cx } from "../../shared/classNames.js";
import { Check } from "lucide-react";
import { Sun } from "lucide-react";
import { city } from "../../game/selectors/city.js";

export function WeekBudget({ inLeague, r, remaining }) {
  return (
    <div className="week-budget">
      <div>
        <span className="section-label">
          {inLeague ? "DESAFIO DA LIGA" : "TEMPO NESTA CIDADE"}
        </span>
        <strong>
          {inLeague
            ? `${r.leagueIndex} de 5 vitórias`
            : `${remaining} ${remaining === 1 ? "semana restante" : "semanas restantes"}`}
        </strong>
        {!inLeague && remaining === 1 && (
          <span className="final-week">
            Última ação →{" "}
            {city(r).kind === "gym"
              ? "ginásio automático"
              : "viagem automática"}
          </span>
        )}
      </div>
      <div className="week-stamps">
        {Array.from(
          {
            length: inLeague ? 5 : weekLimit(r),
          },
          (_, i) => (
            <span
              key={i}
              className={cx(
                i < (inLeague ? r.leagueIndex : r.spent) && "spent",
              )}
            >
              {i < (inLeague ? r.leagueIndex : r.spent) ? (
                <Check size={15} />
              ) : (
                <Sun size={16} />
              )}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
