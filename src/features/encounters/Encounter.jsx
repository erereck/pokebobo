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
import { captureChanceForRun } from "../../game/career/weekEvents.js";
import { CAMPAIGN_RULES } from "../../game/config/campaign.js";

export function Encounter({ run: r, act }) {
  const [replaceId, setReplaceId] = useState("");
  const fullParty = r.party.length >= CAMPAIGN_RULES.partySize;
  const box = r.box || [];
  const fullBox = box.length >= CAMPAIGN_RULES.boxSize;
  const needsRelease = fullParty && fullBox;
  const captureChance = captureChanceForRun(r, ENCOUNTER_RULES.captureChance);
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
        {fullParty && (
          <label className="replace-choice">
            {fullBox
              ? "Equipe e reserva lotadas. Quem sai se a captura der certo?"
              : `Equipe completa. A reserva tem ${CAMPAIGN_RULES.boxSize - box.length} vaga${CAMPAIGN_RULES.boxSize - box.length === 1 ? "" : "s"}.`}
            <select
              value={replaceId}
              onChange={(event) => setReplaceId(event.target.value)}
            >
              {!fullBox && (
                <option value="">Enviar o capturado direto para a reserva</option>
              )}
              {fullBox && <option value="">Escolha quem deixa a equipe</option>}
              {r.party.map((mon) => (
                <option key={mon.id} value={mon.id}>
                  {fullBox ? "Substituir" : "Trocar com"} {mon.name} · nível {mon.level}
                </option>
              ))}
            </select>
            <small>
              {fullBox
                ? `Com as ${CAMPAIGN_RULES.partySize + CAMPAIGN_RULES.boxSize} vagas ocupadas, o escolhido sai definitivamente. Se a captura falhar, nada muda.`
                : replaceId
                  ? "O integrante escolhido vai para a reserva se a captura funcionar."
                  : "Se a captura funcionar, ninguém precisa sair do time ou da reserva."}
            </small>
          </label>
        )}
        {r.encounters.map((e, i) => (
          <button
            key={i}
            disabled={e.used || (needsRelease && !replaceId)}
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
        {Math.round(captureChance * 100)}% de chance{r.eventBoosts?.capture ? ` (+${Math.round(r.eventBoosts.capture * 100)}% de evento)` : ""} · 1 Poké
        Bola · {r.balls} na mochila · reserva {box.length}/{CAMPAIGN_RULES.boxSize}
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
