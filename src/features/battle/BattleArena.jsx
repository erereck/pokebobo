import { RouteCover } from "../../components/scenery/RouteCover.jsx";
import { city } from "../../game/selectors/city.js";
import { Health } from "./Health.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";

export function BattleArena({ r, snap, current }) {
  return (
    <div className="arena">
      <div className="arena-scenery">
        <RouteCover place={city(r)} />
      </div>
      <div className="combatant enemy">
        <Health mon={snap.foe} />
        <div className="battle-sprite">
          <Sprite name={snap.foe.name} />
        </div>
      </div>
      <div className="combatant ally">
        <div className="battle-sprite">
          <Sprite name={current.name} />
        </div>
        <Health mon={current} />
      </div>
      <div className="arena-floor" />
    </div>
  );
}
