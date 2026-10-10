import { ShinyMark } from "../../components/pokemon/ShinyMark.jsx";
import { Dex } from "@pkmn/sim";
import catalog from "../../game/catalog.json" with { type: "json" };
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { TypeTag } from "../../components/pokemon/TypeTag.jsx";
import { Flag, ArrowUp, Sparkles } from "lucide-react";
import { evolutionOptions } from "../../game/pokemon/evolution.js";

function displayMove(data, id) {
  const local = data.moves.find((move) => move.id === id);
  if (local) return local;
  const dex = Dex.moves.get(id);
  return dex?.exists
    ? {
        id,
        name: dex.name,
        type: dex.type,
        category: dex.category,
        power: dex.basePower,
        accuracy: dex.accuracy,
      }
    : { id, name: id };
}

export function PokemonDetails({ mon, run, act }) {
  const data = catalog[mon.name],
    lead = run.party[0]?.id === mon.id;
  const evolutions = evolutionOptions(mon);
  return (
    <section className="pokemon-details" aria-label={"Ficha de " + mon.name}>
      <div className="pokemon-scan">
        <span className="scan-number">
          Nº {String(data.num).padStart(3, "0")}
        </span>
        <Sprite name={mon.name} shiny={mon.shiny} />
        <span className="scan-caption">LEITURA COMPLETA</span>
      </div>
      <div className="pokemon-info">
        <div className="pokemon-name">
          <div>
            <h2>
              {mon.name} <ShinyMark shiny={mon.shiny} />
            </h2>
            <div className="types">
              {data.types.map((t) => (
                <TypeTag key={t} type={t} />
              ))}
            </div>
          </div>
          <strong className="pokemon-level">
            <small>LEVEL</small>
            {mon.level}
          </strong>
        </div>
        <div className="pokemon-traits">
          <span>
            <small>HABILIDADE</small>
            <b>{data.ability}</b>
          </span>
          <span>
            <small>ITEM</small>
            <b>{mon.item ? "Sitrus Berry" : "Nenhum"}</b>
          </span>
        </div>
        <div className="section-head">
          <h3>Golpes equipados</h3>
          <span className="mono">{mon.moves.length}/4</span>
        </div>
        <div className="equipped-moves">
          {mon.moves.map((id) => {
            const m = displayMove(data, id);
            return (
              <div key={id}>
                <strong>{m.name || id}</strong>
                {m.type && <TypeTag type={m.type} />}
                <small>
                  {m.category === "Status"
                    ? "Status"
                    : "Poder " + (m.power || "—")}{" "}
                  ·{" "}
                  {m.accuracy === true
                    ? "Não erra"
                    : (m.accuracy || "—") + "% precisão"}
                </small>
              </div>
            );
          })}
        </div>
        <div className="pokemon-management">
          <button
            className="button primary full"
            aria-label={
              lead
                ? "Abre as batalhas"
                : run.phase !== "career"
                  ? "Troque a ordem entre batalhas"
                  : "Colocar na frente · grátis"
            }
            disabled={lead || run.phase !== "career"}
            onClick={() => act({ type: "LEAD", id: mon.id })}
          >
            {lead ? <Flag size={17} /> : <ArrowUp size={17} />}{" "}
            {lead
              ? "Abre as batalhas"
              : run.phase !== "career"
                ? "Ordem bloqueada"
                : "Colocar na frente"}
          </button>
          {evolutions.length > 1 &&
            evolutions.some((option) => option.available) && (
              <button
                className="button secondary full"
                aria-label="Escolher evolução · grátis"
                disabled={run.phase !== "career"}
                onClick={() =>
                  act({ type: "EVOLUTION_REQUEST", monId: mon.id })
                }
              >
                <Sparkles size={17} />
                Escolher evolução
              </button>
            )}
        </div>
      </div>
    </section>
  );
}
