import { useState } from "react";
import { DoorOpen, PackageOpen, Swords, ArrowUp, LogOut } from "lucide-react";
import { EXPEDITION_RULES as RULES } from "../../game/config/expeditions.js";
import { EXPEDITION_STORIES } from "../../game/data/expeditions.js";
import {
  activeExpedition,
  expeditionSite,
  expeditionFloor,
  nearPoint,
} from "../../game/expeditions/expeditions.js";
import { useFieldControls } from "../encounters/useFieldControls.js";
import { PixelViewport } from "../encounters/PixelViewport.jsx";
import { ExpeditionCanvas } from "./ExpeditionCanvas.jsx";
import { ExpeditionDpad } from "./ExpeditionDpad.jsx";
import { ExpeditionDecision } from "./ExpeditionDecision.jsx";
import { ExpeditionTreasure } from "./ExpeditionTreasure.jsx";
import { itemName } from "../../game/equipment/equipment.js";

export function ExpeditionScreen({ run, act }) {
  const [decision, setDecision] = useState(null);
  const e = activeExpedition(run),
    site = expeditionSite(run.activeExpedition);
  const controls = useFieldControls(
    e,
    (action) => act({ ...action, type: "EXPEDITION_MOVE" }),
    !decision && e?.status === "active",
  );
  if (!e || !site) return null;
  const story = EXPEDITION_STORIES[site.id],
    room = story.rooms[e.room];
  const found = e.collected.includes(e.room),
    busy = !!e.walk || controls.isHolding;
  const open = (event, kind) => {
    event.currentTarget.focus({ preventScroll: true });
    setDecision(kind);
  };
  return (
    <section className={`expedition-screen is-${site.theme}`}>
      <header className="pixel-screen-heading">
        <h1>{story.name}</h1>
        <span>EXPEDIÇÃO</span>
      </header>
      <ol className="expedition-progress" aria-label="Progresso da expedição">
        {["Achado", "Escolha", "Guardião"].map((label, i) => (
          <li
            key={label}
            className={
              i === e.room ? "is-current" : i < e.room ? "is-done" : ""
            }
            aria-current={i === e.room ? "step" : undefined}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {label}
          </li>
        ))}
      </ol>
      {e.status !== "active" ? (
        <ExpeditionTreasure run={run} site={site} act={act} />
      ) : (
        <>
          <h2 className="expedition-room-title">{room.title}</h2>
          <div className="expedition-field">
            <PixelViewport width={192} height={144}>
              <div
                className="field-map"
                data-field-steps={e.steps}
                data-field-walking={!!e.walk}
                role="group"
                tabIndex={0}
                aria-label={`${room.title}: posição ${e.x + 1}, ${e.y + 1}. Use setas ou WASD para caminhar. ${e.room < 2 ? "Baú a leste; passagem ao norte." : "Sentinela ao norte."}`}
              >
                <ExpeditionCanvas expedition={e} site={site} act={act} />
                {Array.from(
                  { length: RULES.width * RULES.height },
                  (_, index) => {
                    const x = index % RULES.width,
                      y = Math.floor(index / RULES.width),
                      adjacent = Math.abs(e.x - x) + Math.abs(e.y - y) === 1;
                    const object = e.room < 2 ? RULES.cache : RULES.guardian;
                    return (
                      <button
                        key={index}
                        tabIndex={-1}
                        className="field-tile"
                        aria-label={`${!expeditionFloor(e.room, x, y) ? "Parede" : x === object.x && y === object.y ? (e.room < 2 ? "Baú" : "Sentinela") : "Chão"}, ${x + 1}, ${y + 1}`}
                        disabled={
                          !!decision ||
                          !!e.walk ||
                          !adjacent ||
                          !expeditionFloor(e.room, x, y) ||
                          (x === object.x && y === object.y)
                        }
                        onClick={() => controls.move(x - e.x, y - e.y)}
                      />
                    );
                  },
                )}
              </div>
            </PixelViewport>
            <div className="expedition-side">
              <p className="expedition-room-text" role="status">
                {found ? room.found : room.text}
              </p>
              <div className="expedition-controls">
                <ExpeditionDpad controls={controls} disabled={!!decision} />
                <div className="expedition-interactions">
                  {e.room < 2 ? (
                    <>
                      <button
                        className="button secondary"
                        disabled={busy || found || !nearPoint(e, RULES.cache)}
                        onClick={(event) => open(event, "cache")}
                      >
                        <PackageOpen size={18} />
                        {found ? "Achados guardados" : "Examinar o baú"}
                      </button>
                      <button
                        className="button primary"
                        disabled={busy || !found || !nearPoint(e, RULES.gate)}
                        onClick={() => act({ type: "EXPEDITION_ADVANCE" })}
                      >
                        <ArrowUp size={18} />
                        Próxima sala
                      </button>
                    </>
                  ) : (
                    <button
                      className="button primary"
                      disabled={busy || !nearPoint(e, RULES.guardian)}
                      onClick={(event) => open(event, "guardian")}
                    >
                      <Swords size={18} />
                      Ver desafio
                    </button>
                  )}
                  <button
                    className="button secondary"
                    disabled={busy}
                    onClick={(event) => open(event, "exit")}
                  >
                    <LogOut size={16} />
                    Sair com os achados
                  </button>
                </div>
              </div>
              <p className="field-guide">
                <DoorOpen size={14} />
                {e.room === 2
                  ? "Aproxime-se da sentinela para ver o desafio. Equipe e Mochila permitem trocar líder e equipamentos antes de lutar."
                  : found
                    ? "A passagem fica no alto, no centro. Aproxime-se para continuar."
                    : "Use setas, WASD ou o direcional. O baú fica à direita, no alto."}
              </p>
            </div>
          </div>
        </>
      )}
      <div className="expedition-receipt" aria-label="Achados desta visita">
        <span>JÁ NA MOCHILA</span>
        <b>
          {e.collected.includes(0)
            ? `₽ ${site.cacheMoney + (e.reward ? site.victoryMoney : 0)} · ${site.cacheBalls + (e.supply === "balls" ? RULES.supplies.balls : 0)} Poké Bolas${e.supply === "berries" ? ` · ${RULES.supplies.berries} kits` : ""}${e.reward ? ` · ${itemName(e.reward)}` : ""}`
            : "Nenhum achado ainda"}
        </b>
        <small>Uma semana pela visita inteira · sair encerra este lugar.</small>
      </div>
      {decision && (
        <ExpeditionDecision
          kind={decision}
          run={run}
          site={site}
          act={act}
          onClose={() => setDecision(null)}
        />
      )}
    </section>
  );
}
