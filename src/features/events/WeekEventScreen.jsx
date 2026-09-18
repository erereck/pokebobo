import {
  ArrowRight,
  Clock3,
  MapPin,
  Sparkles,
  Backpack,
  CircleDot,
} from "lucide-react";
import { weekEventView } from "../../game/career/weekEvents.js";
import { city } from "../../game/selectors/city.js";

const rarityLabels = {
  common: "ACONTECIMENTO",
  uncommon: "ACONTECIMENTO INCOMUM",
  rare: "ACONTECIMENTO RARO",
};

export function WeekEventScreen({ run: r, act }) {
  const event = weekEventView(r);
  const place = city(r);

  if (!event) {
    return (
      <section className="week-event-screen">
        <div className="week-event-card">
          <span className="section-label">ACONTECIMENTO</span>
          <h1>O momento passou.</h1>
          <p>Volte à jornada para continuar.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={"week-event-screen rarity-" + event.rarity}>
      <div className="page-meta week-event-meta">
        <span>
          <MapPin size={14} />
          {place.name.toUpperCase()}
        </span>
        <span>
          <Clock3 size={14} />
          SEMANA <b>{String(r.week).padStart(2, "0")}</b>
        </span>
      </div>

      <article className="week-event-card">
        <div className="week-event-signal" aria-hidden="true">
          <Sparkles size={30} />
        </div>
        <div className="week-event-copy">
          <span className="section-label">
            {rarityLabels[event.rarity] || rarityLabels.common}
          </span>
          <span className="week-event-kicker">{event.kicker}</span>
          <h1>{event.title}</h1>
          <p>{event.text}</p>
        </div>
      </article>

      <div className="section-head event-choice-heading">
        <h2>O que você faz?</h2>
        <span className="mono">NÃO GASTA OUTRA AÇÃO</span>
      </div>

      <div className="event-choice-list">
        {event.choices.map((choice, index) => (
          <button
            className="event-choice"
            key={choice.id}
            onClick={() =>
              act({
                type: "EVENT_CHOICE",
                choiceId: choice.id,
              })
            }
          >
            <span className="event-choice-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="event-choice-copy">
              <strong>{choice.label}</strong>
              <small>{choice.hint}</small>
            </span>
            <ArrowRight size={19} />
          </button>
        ))}
      </div>

      <div className="event-stock">
        <span>
          <CircleDot size={14} />
          {r.balls} Poké Bolas
        </span>
        <span>
          <Backpack size={14} />
          {r.berries} kits de berries
        </span>
        {r.eventBoosts?.capture > 0 && (
          <span>Captura +{Math.round(r.eventBoosts.capture * 100)}%</span>
        )}
        {r.eventBoosts?.training > 0 && (
          <span>Treino +{r.eventBoosts.training}</span>
        )}
      </div>

      <p className="fine-print event-fine-print">
        O acontecimento nasceu da sua semana e da seed da run. Algumas escolhas
        podem reaparecer como consequências mais adiante.
      </p>
    </section>
  );
}
