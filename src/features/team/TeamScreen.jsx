import { useState, useEffect } from "react";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { PokemonDetails } from "./PokemonDetails.jsx";
import { ReservePanel } from "./ReservePanel.jsx";
import { CAMPAIGN_RULES } from "../../game/config/campaign.js";

export function TeamScreen({ run, act, selectedMonId }) {
  const [selected, setSelected] = useState(selectedMonId || run.party[0]?.id);
  const [panel, setPanel] = useState("details");
  useEffect(() => {
    if (selectedMonId) {
      setSelected(selectedMonId);
      setPanel("details");
    }
  }, [selectedMonId]);

  const box = run.box || [];
  const mon = run.party.find((m) => m.id === selected) || run.party[0];

  return (
    <section className="team-screen">
      <header className="pixel-screen-heading">
        <h1>Sua equipe</h1>
        <span>
          {run.party.length}/{CAMPAIGN_RULES.partySize} POKÉMON
        </span>
      </header>
      <div className="roster-selector" aria-label="Selecionar Pokémon">
        {run.party.map((m, i) => (
          <button
            key={m.id}
            aria-pressed={mon?.id === m.id}
            aria-label={`${m.name}, nível ${m.level}${i === 0 ? ", líder" : ""}`}
            title={`${m.name} · nível ${m.level}`}
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

      <div
        className="team-sections"
        role="group"
        aria-label="Informações da equipe"
      >
        <button
          aria-pressed={panel === "details"}
          onClick={() => setPanel("details")}
        >
          Ficha e golpes
        </button>
        <button
          aria-pressed={panel === "reserve"}
          onClick={() => setPanel("reserve")}
        >
          Reserva · {box.length}/{CAMPAIGN_RULES.boxSize}
        </button>
      </div>
      {panel === "details" && mon && (
        <PokemonDetails mon={mon} run={run} act={act} />
      )}

      {panel === "reserve" && (
        <ReservePanel run={run} mon={mon} act={act} onSelect={setSelected} />
      )}
    </section>
  );
}
