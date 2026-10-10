import { useState } from "react";
import { ArrowRight, Sparkles, Check, LockKeyhole } from "lucide-react";
import { Modal } from "../../components/ui/Modal.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { TypeTag } from "../../components/pokemon/TypeTag.jsx";
import { evolutionOptions } from "../../game/pokemon/evolution.js";
import catalog from "../../game/catalog.json" with { type: "json" };

export function EvolutionDialog({ run, act }) {
  const pending = run.pendingEvolutionChoices?.[0];
  const mon =
    pending &&
    [...run.party, ...(run.box || [])].find(
      (candidate) => candidate.id === pending.monId,
    );
  const [selection, setSelection] = useState(null);
  if (!mon) return null;
  const options = evolutionOptions(mon);
  const selected = options.find(
    (option) => option.name === selection && option.available,
  );
  return (
    <Modal
      title="Escolha a evolução"
      className="evolution-dialog"
      dismissible={false}
      onClose={() => {}}
    >
      <div className="evolution-hero">
        <Sprite name={mon.name} shiny={mon.shiny} />
        <div>
          <span className="section-label">
            UM PARCEIRO · {options.length} CAMINHOS
          </span>
          <h3>O futuro de {mon.name}</h3>
          <p>
            Nível {mon.level}. Escolha o tipo que combina com sua equipe. A
            decisão é permanente.
          </p>
        </div>
      </div>
      <div
        className="evolution-grid"
        role="group"
        aria-label="Caminhos de evolução"
      >
        {options.map((option) => {
          const data = catalog[option.name];
          const focused = selected?.name === option.name;
          const stats = Object.entries(data.stats)
            .filter(([stat]) => stat !== "hp")
            .sort((a, b) => b[1] - a[1]);
          const statLabels = {
            atk: "Ataque",
            def: "Defesa",
            spa: "At. especial",
            spd: "Def. especial",
            spe: "Velocidade",
          };
          return (
            <button
              key={option.name}
              className={`evolution-option${focused ? " is-selected" : ""}`}
              disabled={!option.available}
              aria-pressed={focused}
              onClick={() => setSelection(option.name)}
            >
              <span className="evolution-signal">
                {focused ? (
                  <Check size={16} />
                ) : !option.available ? (
                  <LockKeyhole size={15} />
                ) : (
                  <Sparkles size={15} />
                )}
              </span>
              <Sprite name={option.name} shiny={mon.shiny} />
              <strong>{option.name}</strong>
              <span className="types">
                {data.types.map((type) => (
                  <TypeTag key={type} type={type} />
                ))}
              </span>
              <small>
                {statLabels[stats[0][0]]} {stats[0][1]}
              </small>
              <small>
                {option.available
                  ? "Disponível"
                  : `Libera no nível ${option.level}`}
              </small>
            </button>
          );
        })}
      </div>
      <button
        className="button primary full"
        disabled={!selected}
        onClick={() => {
          act({ type: "EVOLUTION_CHOICE", monId: mon.id, name: selected.name });
          setSelection(null);
        }}
      >
        <ArrowRight size={18} />
        {selected ? `Evoluir para ${selected.name}` : "Selecione um caminho"}
      </button>
      <button
        className="button secondary full"
        onClick={() => {
          act({ type: "EVOLUTION_CHOICE", monId: mon.id, defer: true });
          setSelection(null);
        }}
      >
        Escolher depois
      </button>
      <p className="fine-print">
        A escolha também aparece na reserva. Você pode reabrir a decisão na
        ficha do Pokémon ou esperar o próximo nível.
      </p>
    </Modal>
  );
}
