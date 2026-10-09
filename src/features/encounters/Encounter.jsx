import { useEffect, useState } from "react";
import { ScreenHeading } from "../../components/ui/ScreenHeading.jsx";
import { CaptureCanvas } from "./CaptureCanvas.jsx";
import { BitmapLabel } from "./BitmapLabel.jsx";
import { targetLevel } from "../../game/selectors/targetLevel.js";
import { ENCOUNTER_RULES } from "../../game/config/encounters.js";
import { captureChanceForRun } from "../../game/career/weekEvents.js";
import { CAMPAIGN_RULES } from "../../game/config/campaign.js";
import { EXPLORATION_RULES } from "../../game/config/exploration.js";

export function Encounter({ run: r, act }) {
  const [replaceId, setReplaceId] = useState("");
  const [selected, setSelected] = useState(() =>
    r.encounters.findIndex((e) => !e.used),
  );
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const [skip, setSkip] = useState(false);
  const attempt = r.phase === "capture" ? r.captureAttempt : null;
  const index =
    attempt?.index ??
    r.exploration?.activeIndex ??
    r.eventEncounterIndex ??
    selected;
  const wild = r.encounters[index];
  useEffect(() => {
    setReady(false);
    setFinished(false);
    setSkip(false);
  }, [wild?.name]);
  const box = r.box || [];
  const fullParty = r.party.length >= CAMPAIGN_RULES.partySize;
  const fullBox = box.length >= CAMPAIGN_RULES.boxSize;
  const chance = wild?.theft
    ? 1
    : captureChanceForRun(
        r,
        wild?.legendary
          ? EXPLORATION_RULES.legendaryCaptureChance
          : ENCOUNTER_RULES.captureChance,
      );
  if (!wild) return null;
  const result = attempt?.success
    ? `${wild.name} foi capturado!`
    : `${wild.name} escapou da Poké Bola.`;
  const level =
    wild.level ?? Math.max(8, targetLevel(r) - 1 - (wild.legendary ? 5 : 0));
  return (
    <section className="wild-screen">
      <ScreenHeading
        eyebrow={`ENCONTRO SELVAGEM · SEMANA ${r.week}`}
        title={finished ? result : "Pokémon à vista!"}
        text={r.routeName}
      />
      <div className="gba-capture" aria-busy={!!attempt && !finished}>
        <CaptureCanvas
          name={wild.name}
          level={level}
          balls={r.balls}
          water={wild.habitat === "water"}
          attempt={attempt}
          skip={skip}
          onComplete={() => (attempt ? setFinished(true) : setReady(true))}
        />
        {!attempt && (
          <div
            className="capture-menu"
            role="group"
            aria-label="Ações do encontro"
          >
            <button
              aria-label="Lançar Poké Bola"
              disabled={
                !ready ||
                wild.used ||
                !r.balls ||
                (fullParty && fullBox && !replaceId)
              }
              onClick={() =>
                act({ type: "CAPTURE", index, replaceId, animate: true })
              }
            >
              <span className="pixel-cursor" aria-hidden="true">
                ▶
              </span>
              <BitmapLabel text="POKÉ BOLA" />
            </button>
            <button
              aria-label="Fugir do encontro"
              disabled={!ready}
              onClick={() => act({ type: "SKIP_ENCOUNTER" })}
            >
              <span className="pixel-cursor" aria-hidden="true">
                ▶
              </span>
              <BitmapLabel text="FUGIR" />
            </button>
          </div>
        )}
      </div>
      <p className="capture-live" role="status" aria-live="polite">
        {finished
          ? result
          : attempt
            ? "Poké Bola lançada. Acompanhe a captura…"
            : ready
              ? `${wild.name} selvagem apareceu!`
              : "Um Pokémon saiu do mato…"}
      </p>
      {!attempt && (
        <>
          {r.exploration?.activeIndex == null &&
            r.eventEncounterIndex == null && (
              <label className="replace-choice">
                Pokémon encontrado
                <select
                  value={selected}
                  onChange={(e) => setSelected(Number(e.target.value))}
                >
                  {r.encounters.map(
                    (e, i) =>
                      !e.used && (
                        <option key={i} value={i}>
                          {e.name}
                        </option>
                      ),
                  )}
                </select>
              </label>
            )}
          {fullParty && (
            <label className="replace-choice">
              {fullBox
                ? "Equipe e reserva lotadas. Quem sai se a captura funcionar?"
                : "Destino se a captura funcionar"}
              <select
                value={replaceId}
                onChange={(e) => setReplaceId(e.target.value)}
              >
                <option value="">
                  {fullBox
                    ? "Escolha quem deixa a equipe"
                    : "Enviar para a reserva"}
                </option>
                {r.party.map((mon) => (
                  <option key={mon.id} value={mon.id}>
                    {fullBox ? "Substituir" : "Trocar com"} {mon.name} · nível{" "}
                    {mon.level}
                  </option>
                ))}
              </select>
              <small>
                {fullBox
                  ? "O escolhido sai definitivamente apenas se a captura funcionar."
                  : "Trocar envia o integrante escolhido para a reserva."}
              </small>
            </label>
          )}
          <p className="fine-print">
            {Math.round(chance * 100)}% de chance · {r.balls} Poké Bolas na
            mochila · reserva {box.length}/{CAMPAIGN_RULES.boxSize}
            <br />
            Uma tentativa por encontro, com suas Poké Bolas normais.
          </p>
        </>
      )}
      {attempt && (
        <div className="capture-result-actions">
          {finished ? (
            <button
              className="button primary full"
              onClick={() => act({ type: "CAPTURE_FINISH", id: attempt.id })}
            >
              {r.exploration ? "Continuar explorando" : "Continuar jornada"}
            </button>
          ) : (
            <button
              className="button secondary full"
              onClick={() => setSkip(true)}
            >
              Pular animação
            </button>
          )}
          <small>
            O resultado está salvo. Recarregar repete a apresentação sem gastar
            outra bola.
          </small>
        </div>
      )}
    </section>
  );
}
