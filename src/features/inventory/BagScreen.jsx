import { WeekBudget } from "../career/WeekBudget.jsx";
import { weekLimit } from "../../game/selectors/weekLimit.js";
import {
  Backpack,
  Sprout,
  Search,
  Footprints,
  Fish,
  Waves,
} from "lucide-react";
import { EXPLORATION_RULES } from "../../game/config/exploration.js";
import { Ball } from "../../components/icons/Ball.jsx";
import { ScreenHeading } from "../../components/ui/ScreenHeading.jsx";
export function BagScreen({ run: r, act }) {
  const canUse = r.phase === "career" && !r.inLeague;
  return (
    <section className="bag-screen">
      <ScreenHeading
        eyebrow="SUPRIMENTOS DE VIAGEM"
        title="Sua mochila"
        text="Estoque e ações no mesmo lugar. Usar uma ação aqui também gasta uma semana."
      />
      {canUse && <WeekBudget r={r} remaining={weekLimit(r) - r.spent} />}
      <div className="bag-compartments">
        <article>
          <div className="item-display">
            <Ball size={64} />
            <strong>{r.balls}</strong>
          </div>
          <h2>Poké Bolas</h2>
          <p>Explore e capture com 1 bola por encontro.</p>
          <button
            className="button primary full"
            disabled={!canUse || !r.balls || !r.encounters.some((e) => !e.used)}
            onClick={() => act({ type: "EXPLORE" })}
          >
            <Footprints size={17} />
            Explorar · 1 semana
          </button>
        </article>
        <article>
          <div className="item-display berry">
            <Sprout size={64} />
            <strong>{r.berries}</strong>
          </div>
          <h2>Kits de berries</h2>
          <p>1 kit equipa todo o time com berries de cura.</p>
          <button
            className="button primary full"
            disabled={!canUse || !r.berries}
            onClick={() => act({ type: "PREPARE" })}
          >
            <Backpack size={17} />
            Preparar · 1 semana
          </button>
        </article>
      </div>
      <div className="field-equipment">
        <p>
          <Fish size={20} />
          <strong>Fishing Rod</strong>
          <span>
            {r.badges >= EXPLORATION_RULES.fishingBadges
              ? "Disponível nos lagos"
              : "3ª insígnia"}
          </span>
        </p>
        <p>
          <Waves size={20} />
          <strong>Surf</strong>
          <span>
            {r.badges >= EXPLORATION_RULES.surfBadges
              ? "Disponível nos lagos"
              : "5ª insígnia"}
          </span>
        </p>
        <small>Use no lago sem gastar outra semana.</small>
      </div>
      {!canUse && (
        <p className="notice">
          Os suprimentos podem ser preparados nas cidades, antes de entrar em
          batalha ou na Liga.
        </p>
      )}
      <button
        className="button secondary full"
        disabled={!canUse}
        onClick={() => act({ type: "FORAGE" })}
      >
        <Search size={18} />
        Procurar suprimentos · 1 semana
      </button>
    </section>
  );
}
