import { useState } from "react";
import { Landmark, Mountain, ArrowUpRight } from "lucide-react";
import {
  EXPEDITION_RULES,
  EXPEDITION_SITES,
} from "../../game/config/expeditions.js";
import { EXPEDITION_STORIES } from "../../game/data/expeditions.js";
import {
  availableExpeditions,
  nearPoint,
  fieldExpeditionOpen,
} from "../../game/expeditions/expeditions.js";
import { ExpeditionEntryDialog } from "./ExpeditionEntryDialog.jsx";

export function ExpeditionAccess({ run, act, field = false, busy = false }) {
  const [selected, setSelected] = useState(null);
  const available = availableExpeditions(run);
  const sites = EXPEDITION_SITES.filter((site) => run.badges >= site.badges);
  if (run.inLeague || run.badges > EXPEDITION_RULES.lastBadge || !sites.length)
    return null;
  const atEntrance =
    !field ||
    (run.exploration && nearPoint(run.exploration, EXPEDITION_RULES.entrance));
  return (
    <section
      className={`expedition-access${field ? " in-field" : ""}`}
      aria-label="Expedições opcionais"
    >
      <div className="section-head">
        <h2>Fora da trilha</h2>
        <span className="mono">OPCIONAL</span>
      </div>
      {sites.map((site) => {
        const story = EXPEDITION_STORIES[site.id],
          record = run.expeditions?.[site.id];
        const Icon = site.theme === "cave" ? Mountain : Landmark;
        return (
          <div className="expedition-offer" key={site.id}>
            <Icon size={28} aria-hidden="true" />
            <div>
              <h3>{story.name}</h3>
              <p>
                {record
                  ? record.status === "cleared"
                    ? "Tesouro conquistado · visita encerrada"
                    : "Você voltou com seus achados · visita encerrada"
                  : field
                    ? "Parte desta exploração · sem outra semana"
                    : "3 salas · 1 semana · uma visita por jornada"}
              </p>
            </div>
            {!record && (
              <button
                className="button secondary"
                disabled={
                  busy ||
                  !atEntrance ||
                  !available.includes(site) ||
                  (field && !fieldExpeditionOpen(run))
                }
                onClick={(event) => {
                  event.currentTarget.focus({ preventScroll: true });
                  setSelected(site);
                }}
              >
                Ver entrada <ArrowUpRight size={16} />
              </button>
            )}
          </div>
        );
      })}
      {field && available.length > 0 && !fieldExpeditionOpen(run) && (
        <p className="fine-print">
          Você já resolveu um encontro nesta caminhada. Visite pela Jornada em
          outra semana.
        </p>
      )}
      {field &&
        available.length > 0 &&
        fieldExpeditionOpen(run) &&
        !atEntrance && (
          <p className="fine-print">
            A entrada fica à esquerda do começo da rota.
          </p>
        )}
      {selected && (
        <ExpeditionEntryDialog
          run={run}
          site={selected}
          act={act}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
