import { RouteCover } from "../../components/scenery/RouteCover.jsx";
import { city } from "../../game/selectors/city.js";
import { Health } from "./Health.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { combatantSpriteVisible } from "./combatantVisibility.js";

function effectClass(effect, side) {
  return effect?.side === side ? ` is-${effect.type}` : "";
}

export function BattleArena({ r, snap, current, effect }) {
  const showEnemy = combatantSpriteVisible(snap.foe, effect, "enemy");
  const showPlayer = combatantSpriteVisible(current, effect, "player");

  return (
    <div className="arena">
      <div className="arena-scenery">
        <RouteCover place={city(r)} />
      </div>
      <div className={"combatant enemy" + effectClass(effect, "enemy")}>
        <Health mon={snap.foe} />
        <div className="battle-sprite">
          {showEnemy && <Sprite name={snap.foe.name} animated />}
        </div>
      </div>
      <div className={"combatant ally" + effectClass(effect, "player")}>
        <div className="battle-sprite">
          {showPlayer && <Sprite name={current.name} back animated />}
        </div>
        <Health mon={current} />
      </div>
      <div className="arena-floor" />
    </div>
  );
}
