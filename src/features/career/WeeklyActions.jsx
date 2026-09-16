import { Action } from "./Action.jsx";
import { Swords } from "lucide-react";
import { Footprints } from "lucide-react";
import { Backpack } from "lucide-react";
import { Search } from "lucide-react";
import { canTrain } from "../../game/selectors/levelGain.js";
import { PROGRESSION } from "../../game/config/progression.js";

export function WeeklyActions({ act, r }) {
  return (
    <div className="action-grid">
      <Action
        icon={Swords}
        title="Treinar equipe"
        detail={
          canTrain(r.party)
            ? `+${PROGRESSION.trainingMin} a ${PROGRESSION.trainingMax} níveis · até nv. ${PROGRESSION.maxLevel}`
            : "Equipe no nível máximo"
        }
        disabled={!canTrain(r.party)}
        onClick={() =>
          act({
            type: "TRAIN",
          })
        }
      />
      <Action
        icon={Footprints}
        title="Explorar rota"
        detail={
          r.balls === 0
            ? "Você precisa de Poké Bolas"
            : `${r.encounters.filter((e) => !e.used).length} encontros · 1 tentativa`
        }
        disabled={!r.balls || !r.encounters.some((e) => !e.used)}
        onClick={() =>
          act({
            type: "EXPLORE",
          })
        }
      />
      <Action
        icon={Backpack}
        title="Preparar equipe"
        detail={`Berry de cura para todos · ${r.berries} kits`}
        disabled={!r.berries}
        onClick={() =>
          act({
            type: "PREPARE",
          })
        }
      />
      <Action
        icon={Search}
        title="Procurar itens"
        detail="Poké Bolas ou kits de berries"
        onClick={() =>
          act({
            type: "FORAGE",
          })
        }
      />
    </div>
  );
}
