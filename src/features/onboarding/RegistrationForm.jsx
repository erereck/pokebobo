import { cx } from "../../shared/classNames.js";
import { Lock } from "lucide-react";
import { Check } from "lucide-react";
import { ArrowRight } from "lucide-react";

export function RegistrationForm({
  meta,
  onStart,
  name,
  setName,
  mode,
  setMode,
  moveLearningMode,
  setMoveLearningMode,
}) {
  return (
    <section className="registration">
      <span className="section-label">
        NOVO REGISTRO / {String(meta.runs + 1).padStart(3, "0")}
      </span>
      <h2>Nova aventura</h2>
      <p>Registre seu nome e escolha como quer jogar.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onStart();
        }}
      >
        <label htmlFor="trainer-name">NOME DO TREINADOR</label>
        <input
          id="trainer-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          placeholder="Seu nome de treinador"
          autoComplete="nickname"
        />

        <div className="mode-heading">
          <label>MODO DA RUN</label>
          <span>
            {meta.wins ? "MODOS DESBLOQUEADOS" : "2 MODOS PARA DESBLOQUEAR"}
          </span>
        </div>
        <div className="mode-options">
          {[
            ["normal", "Clássico"],
            ["rush", "Correria"],
            ["nuzlocke", "Nuzlocke"],
          ].map(([id, label]) => (
            <button
              type="button"
              key={id}
              disabled={id !== "normal" && !meta.wins}
              aria-pressed={mode === id}
              className={cx(mode === id && "selected")}
              onClick={() => setMode(id)}
            >
              {id !== "normal" && !meta.wins ? (
                <Lock size={12} />
              ) : mode === id ? (
                <Check size={12} />
              ) : null}
              {label}
            </button>
          ))}
        </div>
        <p className="mode-desc">
          {mode === "rush"
            ? "Só duas semanas por cidade. O relógio aperta."
            : mode === "nuzlocke"
              ? "Quem cair em batalha deixa a equipe para sempre."
              : "3 semanas por cidade. Perdeu uma batalha, acabou."}
        </p>

        <div className="mode-heading move-learning-heading">
          <label>MODO DOS ATAQUES</label>
          <span>SALVO NESTE SLOT</span>
        </div>
        <div className="mode-options move-mode-options">
          {[
            ["manual", "Manual"],
            ["automatic", "Automático"],
          ].map(([id, label]) => (
            <button
              type="button"
              key={id}
              aria-pressed={moveLearningMode === id}
              className={cx(moveLearningMode === id && "selected")}
              onClick={() => setMoveLearningMode(id)}
            >
              {moveLearningMode === id ? <Check size={12} /> : null}
              {label}
            </button>
          ))}
        </div>
        <p className="mode-desc move-mode-desc">
          {moveLearningMode === "automatic"
            ? "O jogo escolhe sozinho até 4 golpes disponíveis sempre que seu Pokémon sobe de nível ou evolui."
            : "Vagas livres são preenchidas direto. Com 4 golpes, você escolhe qual esquecer quando aprender um novo."}
        </p>

        <button className="button primary start-button" type="submit">
          Iniciar aventura <ArrowRight size={21} />
        </button>
      </form>
      <div className="registration-foot">
        <span className="save-dot" />
        Salvo automaticamente neste aparelho.
      </div>
    </section>
  );
}
