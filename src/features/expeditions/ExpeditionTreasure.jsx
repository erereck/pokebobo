import { heldItem } from "../../game/equipment/equipment.js";
import { EXPEDITION_STORIES } from "../../game/data/expeditions.js";
import { Check, Gem } from "lucide-react";
import { weekLimit } from "../../game/selectors/weekLimit.js";

export function ExpeditionTreasure({ run, site, act }) {
  const e = run.expeditions[site.id],
    story = EXPEDITION_STORIES[site.id];
  return (
    <div className="expedition-treasure">
      <Gem size={32} />
      <h2>
        {e.status === "cleared"
          ? "O tesouro é seu."
          : "Uma história para levar."}
      </h2>
      <p>{story.victory}</p>
      {e.status === "won" ? (
        <>
          <p>
            <b>Escolha um equipamento + ₽ {site.victoryMoney}.</b> O outro fica
            no santuário.
          </p>
          <div className="expedition-treasures">
            {site.rewards.map((id) => {
              const item = heldItem(id);
              return (
                <button
                  className="button secondary"
                  key={id}
                  onClick={() => act({ type: "EXPEDITION_REWARD", reward: id })}
                >
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                  <small>Guardar na mochila</small>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="expedition-caution">
            <Check size={20} />
            <b>
              {heldItem(e.reward).name} + ₽ {site.victoryMoney} guardados.
            </b>
            <p>
              O item já está disponível na Mochila. Equipe antes de concluir se
              quiser levá-lo à próxima batalha.
            </p>
          </div>
          {run.spent >= weekLimit(run) && (
            <p className="expedition-caution">
              Última semana: ao concluir, o ginásio ou a viagem começa
              automaticamente.
            </p>
          )}
          <button
            className="button primary full"
            onClick={() => act({ type: "EXPEDITION_LEAVE" })}
          >
            Concluir a expedição
          </button>
        </>
      )}
    </div>
  );
}
