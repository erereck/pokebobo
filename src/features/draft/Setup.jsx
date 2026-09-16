import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { ORIGINS } from "../../game/data/origins.js";
import { VILLAGES } from "../../game/data/villages.js";
import { GYMS } from "../../game/data/gyms/index.js";
import { DraftSteps } from "./DraftSteps.jsx";
import { StarterCard } from "./StarterCard.jsx";
import { Heart } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { RegionReady } from "./RegionReady.jsx";
import { CityChoice } from "./CityChoice.jsx";
import { Compass } from "lucide-react";
import { RotateCcw } from "lucide-react";
import { DraftTimeline } from "./DraftTimeline.jsx";
import { BookOpen } from "lucide-react";

export function Setup({ run: r, act }) {
  const screenRef = useRef(null);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    setSelected(null);
    screenRef.current?.scrollTo(0, 0);
  }, [r.phase, r.route.length]);
  const origin = r.phase === "origin",
    starter = r.phase === "starter",
    ready = r.phase === "ready";
  const step = origin ? 1 : starter ? 2 : 3;
  const offers = origin
    ? ORIGINS.filter((o) => r.offers.includes(o.id))
    : r.phase === "draft"
      ? [...VILLAGES, ...GYMS].filter((o) => r.offers.includes(o.id))
      : [];
  const title = origin
    ? "Escolha sua origem"
    : starter
      ? "Escolha seu parceiro"
      : ready
        ? "Região pronta!"
        : r.route.length === 1
          ? "Escolha uma parada"
          : `Escolha seu ${r.route.length - 1}º ginásio.`;
  return (
    <main ref={screenRef} className={"setup setup-" + r.phase}>
      <DraftSteps step={step} />
      <div className="setup-heading">
        <div>
          <span className="eyebrow">
            RUN {String(r.number).padStart(3, "0")} · {r.name}
          </span>
          <h1>{title}</h1>
          <p>
            {origin
              ? "De qual cidade você vai sair com a mochila nas costas?"
              : starter
                ? "Os três estão no nível 10. Só um vai dar o primeiro passo com você."
                : ready
                  ? "Um último olhar no mapa. Daqui pra frente, cada semana conta."
                  : r.route.length === 1
                    ? "Uma cidade para conhecer sua equipe, explorar e ganhar alguns níveis."
                    : `Todos são ${r.route.length - 1}º ginásios nos jogos de origem. O nome da cidade é a pista.`}
          </p>
        </div>
        {r.phase === "draft" && (
          <div className="draft-counter">
            <b>{String(r.route.length - 1).padStart(2, "0")}</b>
            <span>
              / 08
              <br />
              GINÁSIOS
            </span>
          </div>
        )}
      </div>
      {starter ? (
        <>
          <div className="starter-grid">
            {r.route[0].starters.map((n) => (
              <StarterCard
                key={n}
                n={n}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
          </div>
          <div className="setup-bottom">
            <span>
              <Heart size={16} />
              Não é só sobre vantagem de tipo.
            </span>
            <button
              disabled={!selected}
              className="button primary"
              onClick={() =>
                act({
                  type: "STARTER",
                  name: selected,
                })
              }
            >
              Escolher {selected || "parceiro"}
              <ArrowRight size={18} />
            </button>
          </div>
        </>
      ) : ready ? (
        <RegionReady r={r} act={act} />
      ) : (
        <>
          <div className="city-choices">
            {offers.map((c, i) => (
              <CityChoice key={c.id} c={c} act={act} origin={origin} i={i} />
            ))}
          </div>
          {origin ? (
            <div className="setup-bottom">
              <span>
                <Compass size={16} />
                Seu ponto de partida define os três iniciais.
              </span>
              <button
                className="text-button"
                onClick={() =>
                  act({
                    type: "OTHER_ORIGINS",
                  })
                }
              >
                <RotateCcw size={15} />
                Outras origens
              </button>
            </div>
          ) : (
            <DraftTimeline r={r} />
          )}
        </>
      )}
      <div className="setup-tip">
        <BookOpen size={17} />
        <span>
          {origin
            ? "Kanto, Johto, Hoenn, Sinnoh, Unova, Alola e Galar. Kalos fica para outra viagem."
            : "Não mostramos os tipos dos ginásios. O que você lembra dos jogos faz parte da estratégia."}
        </span>
      </div>
    </main>
  );
}
