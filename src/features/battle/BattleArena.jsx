import { RouteCover } from "../../components/scenery/RouteCover.jsx";
import { city } from "../../game/selectors/city.js";
import { Health } from "./Health.jsx";
import { BattlePokemonSprite } from "./BattlePokemonSprite.jsx";
import { combatantSpriteVisible } from "./combatantVisibility.js";

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
        <BattlePokemonSprite
          key={`${snap.foe.name}-${snap.foe.shiny}-${spriteStyle}`}
          mon={snap.foe}
          spriteStyle={spriteStyle}
          visible={showEnemy}
        />
      </div>
      <div className={"combatant ally" + effectClass(effect, "player")}>
        <BattlePokemonSprite
          key={`${current.name}-${current.shiny}-${spriteStyle}`}
          mon={current}
          back
          spriteStyle={spriteStyle}
          visible={showPlayer}
        />
        <Health
          mon={current}
          future={snap.futureMoves?.find((future) => future.side === "player")}
        />
      </div>
      <div className="arena-floor" />
    </div>
  );
}
