import { cx } from "../../shared/classNames.js";
import { Flag } from "lucide-react";
import { Footprints } from "lucide-react";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { ArrowRight } from "lucide-react";
import { PROGRESSION } from "../../game/config/progression.js";
import { levelGains, levelGainLabel } from "../../game/selectors/levelGain.js";
import {
  battleVictory,
  noSurvivors,
} from "../../game/selectors/battleVictory.js";

export function ResultScreen({ run: r, act }) {
  const won = battleVictory(r);
  const eligible = r.party.filter(
    (mon) =>
      r.mode !== "nuzlocke" ||
      !r.outcome.player.find((p) => p.id === mon.id)?.fainted,
  );
  const amount =
    r.battle.kind === "gym"
      ? PROGRESSION.gymVictoryLevels
      : PROGRESSION.leagueVictoryLevels;
  const reward = levelGainLabel(levelGains(eligible, amount));
  return (
    <div className="result-screen">
      <div className={cx("result-emblem", !won && "lost")}>
        {won ? <Flag size={42} /> : <Footprints size={42} />}
      </div>
      <span className="eyebrow">
        {r.battle.kind === "gym"
          ? "DESAFIO DE GINÁSIO"
          : r.battle.kind === "league"
            ? "LIGA POKÉMON"
            : "BATALHA NO CAMINHO"}
      </span>
      <h1>{won ? "Vitória!" : "Fim da aventura"}</h1>
      <p>
        {won
          ? `${r.battle.name} ficou pelo caminho.`
          : noSurvivors(r)
            ? "Seu último Pokémon caiu. Sem sobreviventes, a run termina aqui."
            : `${r.battle.name} levou a melhor.`}
      </p>
      <div className="result-team">
        {r.outcome.player.map((m, i) => (
          <div className={cx(m.fainted && "fainted")} key={i}>
            <Sprite name={m.name} />
            <small>{m.fainted ? "Caiu" : "De pé"}</small>
          </div>
        ))}
      </div>
      <div className="result-receipt">
        <div>
          <span>Turnos de batalha</span>
          <b>{r.outcome.turn}</b>
        </div>
        <div>
          <span>{won ? "Recompensa" : "Insígnias conquistadas"}</span>
          <b>
            {won
              ? r.battle.kind === "gym"
                ? `Insígnia ${r.badges + 1}/8 · ${reward}`
                : r.battle.kind === "league"
                  ? reward
                  : "Equipe recuperada"
              : `${r.badges}/8`}
          </b>
        </div>
        <p>
          {won
            ? r.mode === "nuzlocke"
              ? "Quem caiu deixa a equipe. Os sobreviventes continuam."
              : "Sua equipe se recupera para a próxima parada."
            : "O save não apaga a derrota. A próxima história começa em outro mapa."}
        </p>
      </div>
      <button
        className="button primary full"
        onClick={() =>
          act({
            type: "RESULT",
          })
        }
      >
        {won ? "Continuar a jornada" : "Registrar esta história"}
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
