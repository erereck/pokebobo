import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Fish,
  Waves,
  LogOut,
} from "lucide-react";
import { PixelViewport } from "./PixelViewport.jsx";
import { useFieldControls } from "./useFieldControls.js";
import { EXPLORATION_RULES } from "../../game/config/exploration.js";
import {
  terrainAt,
  atLake,
  isTallGrass,
} from "../../game/world/exploration.js";
import { FieldCanvas } from "./FieldCanvas.jsx";
import { useEffect } from "react";

export function ExplorationScreen({ run: r, act }) {
  const e = r.exploration;
  const controls = useFieldControls(e, act);
  useEffect(() => {
    if (e && !e.walk && e.steps >= EXPLORATION_RULES.maxRouteSteps)
      act({ type: "EXIT_ROUTE" });
  }, [e, act]);
  if (!e) return null;
  const lakeAvailable = r.encounters.some(
    (mon) => mon.habitat === "water" && !mon.used,
  );
  const { move } = controls;
  const directions = [
    { dx: 0, dy: -1, label: "Caminhar para cima", Icon: ArrowUp },
    { dx: -1, dy: 0, label: "Caminhar para esquerda", Icon: ArrowLeft },
    { dx: 0, dy: 1, label: "Caminhar para baixo", Icon: ArrowDown },
    { dx: 1, dy: 0, label: "Caminhar para direita", Icon: ArrowRight },
  ];
  return (
    <section className="exploration-screen">
      <header className="pixel-screen-heading">
        <h1>{r.routeName}</h1>
        <span>EXPLORAR</span>
      </header>
      <div className="field-status">
        <span>{r.balls} Poké Bolas</span>
      </div>
      <PixelViewport width={192} height={128}>
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
      </PixelViewport>
      <p className="field-guide">
        Segure as setas ou WASD para caminhar. Entre e saia do mato para
        encontrar Pokémon.
      </p>
      <div className="field-controls">
        <div className="field-dpad" aria-label="Controles da caminhada">
          {directions.map(({ dx, dy, label, Icon }) => (
            <button
              key={label}
              className="hardware-button"
              aria-label={label}
              onPointerDown={(event) => controls.press(event, dx, dy)}
              onPointerUp={controls.release}
              onPointerCancel={controls.release}
              onLostPointerCapture={controls.release}
              onClick={(event) => {
                if (event.detail === 0) move(dx, dy);
              }}
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
          <button
            className="button primary field-exit"
            disabled={!!e.walk || controls.isHolding}
            aria-label="Voltar à jornada"
            onClick={() => act({ type: "EXIT_ROUTE" })}
          >
            <LogOut size={16} /> Voltar
          </button>
        </div>
      </div>
      <p className="field-lake-guide">
        {r.badges < EXPLORATION_RULES.fishingBadges
          ? "Fishing Rod: 3ª insígnia · Surf: 5ª"
          : !lakeAvailable
            ? "O lago não tem mais encontros nesta rota."
            : !atLake(e)
              ? "Aproxime-se da margem para usar o lago."
              : r.badges < EXPLORATION_RULES.surfBadges
                ? "Fishing Rod liberada · Surf: 5ª insígnia"
                : "Escolha pescar ou usar Surf."}
      </p>
    </section>
  );
}
