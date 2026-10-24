import { Swords } from "lucide-react";
import { Modal } from "../../components/ui/Modal.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { rivalProfile, rivalStage, rivalTeam } from "../../game/rival/rival.js";
import { heldItem } from "../../game/equipment/equipment.js";

export function RivalDialog({ run, act, onClose }) {
  const rival = rivalProfile(run),
    stage = rivalStage(run);
  if (!rival || !stage) return null;
  const reward = heldItem(stage.reward);
  const memory = run.rival.memories?.at(-1);
  return (
    <Modal
      title={`Revanche com ${rival.name}`}
      className="rival-dialog"
      onClose={onClose}
    >
      <span className="section-label">
        {run.rival.victories.length} VITÓRIA
        {run.rival.victories.length !== 1 ? "S" : ""} NO HISTÓRICO ·{" "}
        {stage.title.toUpperCase()}
      </span>
      <p className="rival-quote">
        “
        {stage.badges > 2 || run.rival.victories.length
          ? rival.rematch
          : rival.intro}
        ”
      </p>
      {memory && (
        <p className="rival-memory">
          {rival.name} lembra de {memory.nickname || memory.name}
          {memory.nickname ? `, seu ${memory.name}` : ""}, no reencontro de{" "}
          {memory.badges} insígnias. A luta durou {memory.turns} turnos.
        </p>
      )}
      <div className="rival-roster" aria-label="Equipe do rival">
        {rivalTeam(run, stage).map((mon) => (
          <div key={mon.id}>
            <Sprite name={mon.name} />
            <b>{mon.name}</b>
            <small>Nv. {mon.level}</small>
          </div>
        ))}
      </div>
      <div className="new-move-card">
        <strong>Em caso de vitória: {reward.name}</strong>
        <p>{reward.description}</p>
        <small>
          Vai para a mochila. Equipe depois, sem gastar semana. Uma recompensa
          por reencontro.
        </small>
      </div>
      <p className="rival-stakes">
        <b>Uma derrota encerra a jornada.</b> No Nuzlocke, quem cair não volta.
        Não gasta semana nem concede níveis extras. Você pode seguir viagem sem
        lutar.
      </p>
      <footer className="market-confirm">
        <button
          className="button primary full"
          onClick={() => {
            if (act({ type: "RIVAL_CHALLENGE" })) onClose();
          }}
        >
          <Swords size={18} /> Enfrentar {rival.name}
        </button>
        <button className="text-button" onClick={onClose}>
          Agora não
        </button>
      </footer>
    </Modal>
  );
}
