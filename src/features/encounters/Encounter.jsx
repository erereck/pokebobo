import { ScreenHeading } from "../../components/ui/ScreenHeading.jsx";
import { RouteCover } from "../../components/scenery/RouteCover.jsx";
import { city } from "../../game/selectors/city.js";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import catalog from "../../game/catalog.json" with { type: "json" };
import { TypeTag } from "../../components/pokemon/TypeTag.jsx";
import { targetLevel } from "../../game/selectors/targetLevel.js";
import { Ball } from "../../components/icons/Ball.jsx";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { ENCOUNTER_RULES } from "../../game/config/encounters.js";

export function Encounter({ run: r, act }) {
  const [replaceId, setReplaceId] = useState("");
  const full = r.party.length >= 6;
  return (
    <>
      <ScreenHeading
        eyebrow={`EXPLORAÇÃO · SEMANA ${r.week}`}
        title="Pokémon à vista!"
        text="A semana já foi gasta. Escolha quem capturar."
      />
      <div className="encounter-scene">
        <RouteCover place={city(r)} />
      </div>
      <div className="encounter-options">
        {full && (
          <label className="replace-choice">
            Equipe completa. Quem sai se a captura der certo?
            <select
              value={replaceId}
              onChange={(event) => setReplaceId(event.target.value)}
            >
              <option value="">Escolha um integrante</option>
              {r.party.map((mon) => (
                <option key={mon.id} value={mon.id}>
                  {mon.name} · nível {mon.level}
                </option>
              ))}
            </select>
            <small>Se a captura falhar, sua equipe continua igual.</small>
          </label>
        )}
        {r.encounters.map((e, i) => (
          <button
            key={i}
            disabled={e.used || (full && !replaceId)}
            className="encounter-mon"
            onClick={() =>
              act({
                type: "CAPTURE",
                index: i,
                replaceId,
              })
            }
          >
            <Sprite name={e.name} />
            <div>
              <span className="section-label">
                {e.used ? "ENCONTRO ESGOTADO" : "ENCONTRO SELVAGEM"}
              </span>
              <h2>{e.name}</h2>
              <div className="types">
                {catalog[e.name].types.map((t) => (
                  <TypeTag type={t} key={t} />
                ))}
              </div>
              <small>
                {e.used
                  ? "A oportunidade passou."
                  : `Nível ${Math.max(8, targetLevel(r) - 1)}–${Math.max(8, targetLevel(r) + 1)}`}
              </small>
            </div>
            <span className="capture-call">
              <Ball />
              Capturar
            </span>
          </button>
        ))}
      </div>
      <p className="fine-print">
        {Math.round(ENCOUNTER_RULES.captureChance * 100)}% de chance · 1 Poké
        Bola · {r.balls} na mochila
        <br />
        Uma tentativa por espécie. O resultado fica salvo.
      </p>
      <button
        className="button secondary full"
        onClick={() =>
          act({
            type: "SKIP_ENCOUNTER",
          })
        }
      >
        Deixar a rota em paz
        <ArrowRight size={18} />
      </button>
    </>
  );
}
