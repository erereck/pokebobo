import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Fish,
  Waves,
  LogOut,
} from "lucide-react";
import { ScreenHeading } from "../../components/ui/ScreenHeading.jsx";
import { EXPLORATION_RULES } from "../../game/config/exploration.js";
import {
  terrainAt,
  atLake,
  isTallGrass,
} from "../../game/world/exploration.js";
import { FieldCanvas } from "./FieldCanvas.jsx";

export function ExplorationScreen({ run: r, act }) {
  const e = r.exploration;
  if (!e) return null;
  const remaining = r.encounters.filter((mon) => !mon.used).length;
  const lakeAvailable = r.encounters.some(
    (mon) => mon.habitat === "water" && !mon.used,
  );
  const move = (dx, dy) => act({ type: "MOVE_ROUTE", dx, dy, animate: true });
  const directions = [
    { dx: 0, dy: -1, label: "Caminhar para cima", Icon: ArrowUp },
    { dx: -1, dy: 0, label: "Caminhar para esquerda", Icon: ArrowLeft },
    { dx: 0, dy: 1, label: "Caminhar para baixo", Icon: ArrowDown },
    { dx: 1, dy: 0, label: "Caminhar para direita", Icon: ArrowRight },
  ];
  return (
    <section
      className="exploration-screen"
      onKeyDown={(event) => {
        const keys = {
          ArrowUp: [0, -1],
          ArrowDown: [0, 1],
          ArrowLeft: [-1, 0],
          ArrowRight: [1, 0],
          w: [0, -1],
          s: [0, 1],
          a: [-1, 0],
          d: [1, 0],
        };
        if (
          !keys[event.key] ||
          event.ctrlKey ||
          event.altKey ||
          event.metaKey ||
          event.target.closest("input,textarea,select")
        )
          return;
        event.preventDefault();
        move(...keys[event.key]);
      }}
    >
      <ScreenHeading
        eyebrow="EXPLORAÇÃO DE CAMPO"
        title="Um passo de cada vez"
        text={r.routeName}
      />
      <div className="field-status">
        <span>{remaining} encontros restantes</span>
        <span>{r.balls} Poké Bolas</span>
        <span>1 semana já gasta</span>
      </div>
      <div
        className="field-map"
        role="group"
        tabIndex={0}
        aria-label={`Rota: posição ${e.x + 1}, ${e.y + 1}. Use as setas para caminhar.`}
      >
        <FieldCanvas exploration={e} act={act} />
        {Array.from(
          { length: EXPLORATION_RULES.width * EXPLORATION_RULES.height },
          (_, index) => {
            const x = index % EXPLORATION_RULES.width,
              y = Math.floor(index / EXPLORATION_RULES.width);
            const terrain = terrainAt(x, y);
            const grass = isTallGrass(e, x, y);
            const nearby = Math.abs(x - e.x) + Math.abs(y - e.y) === 1;
            return (
              <button
                key={index}
                tabIndex={-1}
                className={`field-tile${grass ? " is-grass" : ""}`}
                disabled={
                  !!e.walk || !nearby || (terrain === "water" && !e.surfing)
                }
                aria-label={`${terrain === "water" ? "Lago" : grass ? "Mato alto" : "Trilha"}, ${x + 1}, ${y + 1}`}
                onClick={() => move(x - e.x, y - e.y)}
              />
            );
          },
        )}
      </div>
      <p className="field-guide">
        Entre e saia do mato alto: cada passo pode revelar um Pokémon. Toque
        numa casa vizinha ou use as setas / WASD.
      </p>
      <div className="field-controls">
        <div className="field-dpad" aria-label="Controles da caminhada">
          {directions.map(({ dx, dy, label, Icon }) => (
            <button
              key={label}
              className="hardware-button"
              aria-label={label}
              disabled={!!e.walk}
              onClick={() => move(dx, dy)}
            >
              <Icon size={22} />
            </button>
          ))}
        </div>
        <div className="lake-actions">
          <button
            className="button secondary"
            disabled={
              !atLake(e) ||
              !!e.walk ||
              !lakeAvailable ||
              !r.balls ||
              r.badges < EXPLORATION_RULES.fishingBadges
            }
            onClick={() => act({ type: "LAKE_ENCOUNTER", method: "fish" })}
          >
            <Fish size={18} />
            Pescar
          </button>
          <button
            className="button secondary"
            disabled={
              !atLake(e) ||
              !!e.walk ||
              !lakeAvailable ||
              !r.balls ||
              r.badges < EXPLORATION_RULES.surfBadges
            }
            onClick={() => act({ type: "LAKE_ENCOUNTER", method: "surf" })}
          >
            <Waves size={18} />
            Surf
          </button>
          <small>
            {r.badges < EXPLORATION_RULES.fishingBadges
              ? "Fishing Rod: 3ª insígnia · Surf: 5ª"
              : !lakeAvailable
                ? "O lago não tem mais encontros nesta rota."
                : !atLake(e)
                  ? "Aproxime-se da margem para usar o lago."
                  : r.badges < EXPLORATION_RULES.surfBadges
                    ? "Fishing Rod liberada · Surf: 5ª insígnia"
                    : "Escolha pescar ou usar Surf: 1 encontro no lago."}
          </small>
        </div>
      </div>
      <button
        className="button primary full"
        disabled={!!e.walk}
        onClick={() => act({ type: "EXIT_ROUTE" })}
      >
        <LogOut size={18} />
        {remaining ? "Encerrar exploração" : "Voltar à jornada"}
      </button>
    </section>
  );
}
