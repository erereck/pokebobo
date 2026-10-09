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
import { terrainAt, atLake } from "../../game/world/exploration.js";

export function ExplorationScreen({ run: r, act }) {
  const e = r.exploration;
  if (!e) return null;
  const remaining = r.encounters.filter((mon) => !mon.used).length;
  const lakeAvailable = r.encounters.some(
    (mon) => mon.habitat === "water" && !mon.used,
  );
  const move = (dx, dy) => act({ type: "MOVE_ROUTE", dx, dy });
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
        {Array.from(
          { length: EXPLORATION_RULES.width * EXPLORATION_RULES.height },
          (_, index) => {
            const x = index % EXPLORATION_RULES.width,
              y = Math.floor(index / EXPLORATION_RULES.width);
            const terrain = terrainAt(x, y);
            const spotIndex = e.spots.findIndex(
              (spot) => spot?.x === x && spot?.y === y,
            );
            const nearby = Math.abs(x - e.x) + Math.abs(y - e.y) === 1;
            const player = x === e.x && y === e.y;
            return (
              <button
                key={index}
                tabIndex={-1}
                className={`field-tile terrain-${terrain}${spotIndex >= 0 ? " is-spot" : ""}${player ? " is-player" : ""}`}
                disabled={!nearby || (terrain === "water" && !e.surfing)}
                aria-label={`${terrain === "water" ? "Lago" : spotIndex >= 0 ? "Matinho com encontro" : "Trilha"}, ${x + 1}, ${y + 1}`}
                onClick={() => move(x - e.x, y - e.y)}
              >
                {spotIndex >= 0 && (
                  <span className="field-marker">
                    {r.encounters[spotIndex].used ? "✓" : spotIndex + 1}
                  </span>
                )}
                {player && (
                  <img
                    className={`field-trainer${e.surfing ? " is-surfing" : ""}`}
                    src={`${import.meta.env.BASE_URL}field/${e.surfing ? "red_surf" : "red_normal"}.png`}
                    alt="Seu treinador"
                  />
                )}
              </button>
            );
          },
        )}
      </div>
      <p className="field-guide">
        Entre nos matinhos numerados para encontrar Pokémon. Toque numa casa
        vizinha ou use as setas.
      </p>
      <div className="field-controls">
        <div className="field-dpad" aria-label="Controles da caminhada">
          {directions.map(({ dx, dy, label, Icon }) => (
            <button
              key={label}
              className="hardware-button"
              aria-label={label}
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
        onClick={() => act({ type: "EXIT_ROUTE" })}
      >
        <LogOut size={18} />
        {remaining ? "Encerrar exploração" : "Voltar à jornada"}
      </button>
    </section>
  );
}
