import { useEffect, useRef, useState } from "react";
import { CaptureCanvas } from "./CaptureCanvas.jsx";
import { PixelViewport } from "./PixelViewport.jsx";
import { targetLevel } from "../../game/selectors/targetLevel.js";
import { CAMPAIGN_RULES } from "../../game/config/campaign.js";

export function Encounter({ run: r, act }) {
  const [replaceId, setReplaceId] = useState("");
  const [selected, setSelected] = useState(() =>
    r.encounters.findIndex((e) => !e.used),
  );
  const [ready, setReady] = useState(false);
  const [skip, setSkip] = useState(false);
  const [selectedAction, setSelectedAction] = useState("ball");
  const ballButton = useRef(null);
  const attempt = r.phase === "capture" ? r.captureAttempt : null;
  const index =
    attempt?.index ??
    r.exploration?.activeIndex ??
    r.eventEncounterIndex ??
    selected;
  const wild = r.encounters[index];
  useEffect(() => {
    setReady(false);
    setSkip(false);
    setReplaceId("");
    setSelectedAction("ball");
  }, [index, wild?.name]);
  useEffect(() => {
    setSkip(false);
  }, [attempt?.id]);
  useEffect(() => {
    if (
      !attempt &&
      ready &&
      wild?.captureAttempts &&
      document.activeElement === document.body
    )
      ballButton.current?.focus({ preventScroll: true });
  }, [attempt, ready, wild?.captureAttempts]);
  const box = r.box || [];
  const fullParty = r.party.length >= CAMPAIGN_RULES.partySize;
  const fullBox = box.length >= CAMPAIGN_RULES.boxSize;
  if (!wild) return null;
  const result = attempt?.success
    ? `${wild.name} foi capturado!`
    : `${wild.name} escapou da Poké Bola.`;
  const level =
    wild.level ?? Math.max(8, targetLevel(r) - 1 - (wild.legendary ? 5 : 0));
  const ballDisabled =
    !ready ||
    wild.used ||
    !r.balls ||
    (fullParty && fullBox && !r.party.some((mon) => mon.id === replaceId));
  return (
    <section className="wild-screen" aria-label={`Encontro com ${wild.name}`}>
      <PixelViewport width={240} height={160}>
        <div className="gba-capture" aria-busy={!!attempt}>
          <CaptureCanvas
            name={wild.name}
            level={level}
            balls={r.balls}
            water={wild.habitat === "water"}
            attempt={attempt}
            skip={skip}
            exploration={r.exploration}
            returning={!!wild.captureAttempts}
            selectedAction={selectedAction}
            ballDisabled={ballDisabled}
            onComplete={() =>
              attempt
                ? act({ type: "CAPTURE_FINISH", id: attempt.id })
                : setReady(true)
            }
          />
          {!attempt && (
            <div
              className="capture-menu"
              role="group"
              aria-label="Ações do encontro"
            >
              <button
                ref={ballButton}
                aria-label="Lançar Poké Bola"
                disabled={ballDisabled}
                onPointerEnter={() => setSelectedAction("ball")}
                onFocus={() => setSelectedAction("ball")}
                onClick={() =>
                  act({ type: "CAPTURE", index, replaceId, animate: true })
                }
              >
                <span className="sr-only">
                  Poké Bola · {r.balls} disponíveis
                </span>
              </button>
              <button
                aria-label="Fugir do encontro"
                disabled={!ready}
                onPointerEnter={() => setSelectedAction("run")}
                onFocus={() => setSelectedAction("run")}
                onClick={() => act({ type: "SKIP_ENCOUNTER" })}
              >
                <span className="sr-only">Fugir</span>
              </button>
            </div>
          )}
        </div>
      </PixelViewport>
      <div className={`capture-footer${fullParty ? " with-destination" : ""}`}>
        <p className="sr-only" role="status" aria-live="polite">
          {attempt
            ? "Poké Bola lançada. Acompanhe a captura…"
            : ready
              ? wild.captureAttempts
                ? `${result} Escolha sua próxima ação.`
                : `${wild.name} selvagem apareceu!`
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
          </>
        )}
        {attempt && (
          <div className="capture-result-actions">
            <button
              className="button secondary full"
              onClick={() => setSkip(true)}
            >
              Pular animação
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
