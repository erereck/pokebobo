import { useState } from "react";
import { ArrowUpRight, Swords } from "lucide-react";
import { rivalProfile, rivalStage, rivalTeam } from "../../game/rival/rival.js";
import { itemName } from "../../game/equipment/equipment.js";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { RivalDialog } from "./RivalDialog.jsx";

export function RivalCard({ run, act }) {
  const [open, setOpen] = useState(false);
  const stage = rivalStage(run),
    rival = rivalProfile(run);
  if (!stage || !rival) return null;
  const partner = rivalTeam(run, stage).at(-1);
  return (
    <section className="rival-card" aria-label={`Reencontro com ${rival.name}`}>
      <Sprite name={partner.name} />
      <div>
        <span className="section-label">
          <Swords size={12} /> REENCONTRO · OPCIONAL
        </span>
        <h3>{rival.name} está por perto.</h3>
        <p>
          {stage.title} · recompensa: <b>{itemName(stage.reward)}</b>
        </p>
      </div>
      <button
        className="button secondary"
        onClick={(event) => {
          event.currentTarget.focus({ preventScroll: true });
          setOpen(true);
        }}
      >
        Ver revanche <ArrowUpRight size={16} />
      </button>
      {open && (
        <RivalDialog run={run} act={act} onClose={() => setOpen(false)} />
      )}
    </section>
  );
}
