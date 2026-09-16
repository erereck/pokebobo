import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { ArrowRight } from "lucide-react";

export function SwitchOptions({ snap, locked, move }) {
  return (
    <div className="switch-options">
      {snap.player.map((p, i) => (
        <button
          key={i}
          disabled={p.fainted || p.active || locked}
          onClick={() => move(`switch ${i + 1}`)}
        >
          <Sprite name={p.name} />
          <span>
            <b>{p.name}</b>
            <small>
              {p.fainted ? "Fora de combate" : `${p.hp} / ${p.maxhp} HP`}
            </small>
          </span>
          <ArrowRight size={17} />
        </button>
      ))}
    </div>
  );
}
