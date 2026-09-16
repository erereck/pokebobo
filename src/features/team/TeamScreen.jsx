import { useState, useEffect } from "react";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { PokemonDetails } from "./PokemonDetails.jsx";
import { ScreenHeading } from "../../components/ui/ScreenHeading.jsx";
export function TeamScreen({ run, act, selectedMonId }) {
  const [selected, setSelected] = useState(selectedMonId || run.party[0]?.id);
  useEffect(() => {
    if (selectedMonId) setSelected(selectedMonId);
  }, [selectedMonId]);
  const mon = run.party.find((m) => m.id === selected) || run.party[0];
  return (
    <section className="team-screen">
      <ScreenHeading
        eyebrow="ARQUIVO DE POKÉMON"
        title="Sua equipe"
        text="Selecione para ver os golpes. O líder abre a batalha."
      />
      <div className="roster-selector" aria-label="Selecionar Pokémon">
        {run.party.map((m, i) => (
          <button
            key={m.id}
            aria-pressed={mon?.id === m.id}
            onClick={() => setSelected(m.id)}
          >
            <Sprite name={m.name} />
            <span>
              <strong>{m.name}</strong>
              <small>
                Lv. {m.level}
                {i === 0 ? " · líder" : ""}
              </small>
            </span>
          </button>
        ))}
      </div>
      {mon && <PokemonDetails mon={mon} run={run} act={act} />}
    </section>
  );
}
