import { WeekBudget } from "../career/WeekBudget.jsx";
import { weekLimit } from "../../game/selectors/weekLimit.js";
import { Backpack, Sprout, Search, Footprints } from "lucide-react";
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
          <p>1 bola por captura. Explore para encontrar Pokémon.</p>
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
          <p>1 kit prepara o time inteiro. Cura automática em batalha.</p>
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
