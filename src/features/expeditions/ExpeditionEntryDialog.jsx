import { ArrowRight, Compass } from "lucide-react";
import { Modal } from "../../components/ui/Modal.jsx";
import { EXPEDITION_STORIES } from "../../game/data/expeditions.js";
import { itemName } from "../../game/equipment/equipment.js";
import { weekLimit } from "../../game/selectors/weekLimit.js";

export function ExpeditionEntryDialog({ run, site, act, onClose }) {
  const story = EXPEDITION_STORIES[site.id],
    field = run.phase === "exploration";
  return (
    <Modal title={story.name} onClose={onClose} className="expedition-dialog">
      <span className="section-label">
        <Compass size={14} /> EXPEDIÇÃO OPCIONAL · 3 SALAS
      </span>
      <p className="expedition-prose">{story.intro}</p>
      <ol className="expedition-itinerary">
        <li>
          <b>Encontrar</b>
          <span>
            ₽ {site.cacheMoney} + {site.cacheBalls} Poké Bolas no primeiro baú.
          </span>
        </li>
        <li>
          <b>Escolher</b>
          <span>
            Uma bolsa de suprimentos. Você pode sair com seus achados em
            qualquer sala.
          </span>
        </li>
        <li>
          <b>Arriscar</b>
          <span>
            Guardião opcional: nível {site.team[0].level}–
            {site.team.at(-1).level}. Vitória: ₽ {site.victoryMoney} +{" "}
            {site.rewards.map(itemName).join(" ou ")}.
          </span>
        </li>
      </ol>
      <div className="expedition-caution">
        <b>
          {field
            ? "Usa a semana de exploração já gasta."
            : "Toda a visita custa uma única semana."}
        </b>
        <p>
          Não gasta Poké Bolas para entrar. Salas e guardião não cobram ações
          extras. Ao sair, a visita termina para esta jornada, mesmo se você não
          pegar o tesouro.
        </p>
        {field && (
          <p>
            O desvio deve ser escolhido antes de resolver qualquer encontro
            nesta caminhada. Você deixa a caminhada e seus encontros restantes
            para trás.
          </p>
        )}
        <p>
          Derrota no guardião encerra a jornada. No Nuzlocke, quem cair não
          volta. Prepare sua equipe antes de entrar.
        </p>
        {run.spent + (field ? 0 : 1) >= weekLimit(run) && (
          <p>
            <b>
              É a última semana da cidade: ao sair, o ginásio ou a viagem começa
              automaticamente.
            </b>
          </p>
        )}
      </div>
      <footer className="market-confirm">
        <button
          className="button primary full"
          onClick={() => {
            if (act({ type: "EXPEDITION_ENTER", siteId: site.id })) onClose();
          }}
        >
          Entrar{field ? " · sem outra semana" : " · 1 semana"}{" "}
          <ArrowRight size={18} />
        </button>
        <button className="text-button" onClick={onClose}>
          Ficar na trilha
        </button>
      </footer>
    </Modal>
  );
}
