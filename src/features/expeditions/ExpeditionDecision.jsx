import { Modal } from "../../components/ui/Modal.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { EXPEDITION_RULES } from "../../game/config/expeditions.js";
import { itemName } from "../../game/equipment/equipment.js";
import { weekLimit } from "../../game/selectors/weekLimit.js";

export function ExpeditionDecision({ kind, run, site, act, onClose }) {
  const e = run.expeditions[site.id];
  const send = (action) => {
    if (act(action)) onClose();
  };
  return (
    <Modal
      title={
        kind === "guardian"
          ? "Enfrentar o guardião?"
          : kind === "exit"
            ? "Encerrar a expedição?"
            : e.room === 0
              ? "O primeiro achado"
              : "Qual bolsa levar?"
      }
      onClose={onClose}
      className="expedition-dialog"
    >
      {kind === "guardian" ? (
        <>
          <p>
            O guardião aceita um único desafio. A equipe começa recuperada; os
            equipamentos atuais entram no combate.
          </p>
          <div className="rival-roster" aria-label="Equipe do guardião">
            {site.team.map((mon) => (
              <div key={mon.name}>
                <Sprite name={mon.name} />
                <b>{mon.name}</b>
                <small>Nv. {mon.level}</small>
              </div>
            ))}
          </div>
          <div className="expedition-caution">
            <b>Uma derrota encerra a jornada.</b>
            <p>
              No Nuzlocke, quem cair deixa a equipe, mesmo na vitória. Sem
              sobreviventes, a jornada termina.
            </p>
            <p>
              Vencer rende ₽ {site.victoryMoney} e um equipamento à sua escolha:{" "}
              {site.rewards.map(itemName).join(" ou ")}. Nenhum nível ou semana
              extra.
            </p>
          </div>
          <footer className="market-confirm">
            <button
              className="button primary full"
              onClick={() => send({ type: "EXPEDITION_CHALLENGE" })}
            >
              Enfrentar o guardião
            </button>
            <button className="text-button" onClick={onClose}>
              Ainda não
            </button>
          </footer>
        </>
      ) : kind === "exit" ? (
        <>
          <p>
            Os achados já estão na mochila. Ao sair, este lugar fica encerrado
            nesta jornada. As salas e o tesouro restantes ficam para trás.
          </p>
          {run.spent >= weekLimit(run) && (
            <p className="expedition-caution">
              <b>
                Última semana: o ginásio ou a viagem começa assim que você sair.
              </b>
            </p>
          )}
          <footer className="market-confirm">
            <button
              className="button primary full"
              onClick={() => send({ type: "EXPEDITION_LEAVE" })}
            >
              Sair com meus achados
            </button>
            <button className="text-button" onClick={onClose}>
              Continuar explorando
            </button>
          </footer>
        </>
      ) : e.room === 0 ? (
        <>
          <p className="expedition-prose">
            O baú contém <b>₽ {site.cacheMoney}</b> e{" "}
            <b>{site.cacheBalls} Poké Bolas</b>. Guardar não custa recursos.
            Você conserva tudo se decidir recuar.
          </p>
          <footer className="market-confirm">
            <button
              className="button primary full"
              onClick={() =>
                send({ type: "EXPEDITION_COLLECT", choice: "cache" })
              }
            >
              Guardar os achados
            </button>
          </footer>
        </>
      ) : (
        <>
          <p>
            Você só consegue salvar uma bolsa. A escolha é definitiva e não
            custa outro recurso.
          </p>
          <div className="expedition-choices">
            {["balls", "berries"].map((choice) => (
              <button
                className="button secondary"
                key={choice}
                onClick={() => send({ type: "EXPEDITION_COLLECT", choice })}
              >
                {EXPEDITION_RULES.supplies[choice]}{" "}
                {choice === "balls" ? "Poké Bolas" : "kits de berries"}
              </button>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}
