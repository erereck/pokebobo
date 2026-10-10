import { RouteCover } from "../../components/scenery/RouteCover.jsx";
import { city } from "../../game/selectors/city.js";
import { Health } from "./Health.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { combatantSpriteVisible } from "./combatantVisibility.js";
import catalog from "../../game/catalog.json" with { type: "json" };

function spriteSize(name) {
  const height = catalog[name]?.height || 1;
  // Escala comprimida: pequenos continuam legíveis e gigantes cabem na arena.
  return `${Math.round(Math.max(48, Math.min(100, 52 + Math.sqrt(height) * 30)))}%`;
}

function effectClass(effect, side) {
  return effect?.side === side ? ` is-${effect.type}` : "";
}

export function BattleArena({ r, snap, current, effect, spriteStyle }) {
  const showEnemy = combatantSpriteVisible(snap.foe, effect, "enemy");
  const showPlayer = combatantSpriteVisible(current, effect, "player");

  return (
    <div className="arena">
      <div className="arena-scenery">
        <RouteCover place={r.inLeague ? { id: "indigo" } : city(r)} />
      </div>
      <div className={"combatant enemy" + effectClass(effect, "enemy")}>
        <Health
          mon={snap.foe}
          future={snap.futureMoves?.find((future) => future.side === "enemy")}
        />
        <div
          className="battle-sprite"
          style={{ "--species-size": spriteSize(snap.foe.name) }}
        >
          {showEnemy && (
            <Sprite name={snap.foe.name} animated battleStyle={spriteStyle} />
          )}
        </div>
      </div>
      <div className={"combatant ally" + effectClass(effect, "player")}>
        <div
          className="battle-sprite"
          style={{ "--species-size": spriteSize(current.name) }}
        >
          {showPlayer && (
            <Sprite
              name={current.name}
              back
              animated
              battleStyle={spriteStyle}
            />
          )}
        </div>
        <Health
          mon={current}
          future={snap.futureMoves?.find((future) => future.side === "player")}
        />
      </div>
      <div className="arena-floor" />
    </div>
  );
}
