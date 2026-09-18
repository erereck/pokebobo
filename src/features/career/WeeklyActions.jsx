import { Action } from "./Action.jsx";
import { Swords } from "lucide-react";
import { Footprints } from "lucide-react";
import { Backpack } from "lucide-react";
import { Search } from "lucide-react";
import { canTrain } from "../../game/selectors/levelGain.js";
import { PROGRESSION } from "../../game/config/progression.js";

export function WeeklyActions({ act, r }) {
  const trainees = [...r.party, ...(r.box || [])];
  const trainingAvailable = canTrain(trainees);
  return (
    <div className="action-grid">
      <Action
        icon={Swords}
        title="Treinar equipe"
        detail={
          trainingAvailable
            ? `+${PROGRESSION.trainingMin} a ${PROGRESSION.trainingMax} níveis${r.eventBoosts?.training ? ` +${r.eventBoosts.training} bônus` : ""} · equipe e reserva${r.box?.length ? ` (${r.box.length})` : ""}`
            : "Equipe e reserva no nível máximo"
        }
        disabled={!trainingAvailable}
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
        detail={`Poké Bolas ou kits de berries${r.eventBoosts?.forage ? ` · +${r.eventBoosts.forage} bônus` : ""}`}
        onClick={() =>
          act({
            type: "FORAGE",
          })
        }
      />
    </div>
  );
}
