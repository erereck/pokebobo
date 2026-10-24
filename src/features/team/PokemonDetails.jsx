import { ShinyMark } from "../../components/pokemon/ShinyMark.jsx";
import catalog from "../../game/catalog.json" with { type: "json" };
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { TypeTag } from "../../components/pokemon/TypeTag.jsx";
import { Flag, ArrowUp, Sparkles } from "lucide-react";
import { evolutionOptions } from "../../game/pokemon/evolution.js";
import { EquippedMove } from "./EquippedMove.jsx";
import { useState } from "react";
import { Package, Pencil } from "lucide-react";
import { itemName } from "../../game/equipment/equipment.js";
import { pokemonName } from "../../game/heroes/heroes.js";
import { EquipmentDialog } from "../equipment/EquipmentDialog.jsx";
import { NicknameDialog } from "../heroes/NicknameDialog.jsx";
import { PokemonFeats } from "../heroes/PokemonFeats.jsx";

export function PokemonDetails({ mon, run, act }) {
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [nicknameOpen, setNicknameOpen] = useState(false);
  const data = catalog[mon.name],
    lead = run.party[0]?.id === mon.id;
  const evolutions = evolutionOptions(mon);
  const canManage = ["career", "market"].includes(run.phase);
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
              {pokemonName(mon)} <ShinyMark shiny={mon.shiny} />
            </h2>
            {mon.nickname && (
              <small className="pokemon-species">{mon.name}</small>
            )}
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
            <small>{run.phase === "battle" ? "ITEM LEVADO" : "ITEM"}</small>
            <b>{itemName(mon.item)}</b>
          </span>
        </div>
        <div className="section-head">
          <h3>Golpes equipados</h3>
          <span className="mono">{mon.moves.length}/4</span>
        </div>
        <div className="equipped-moves">
          {mon.moves.map((id) => (
            <EquippedMove key={`${mon.id}-${id}`} id={id} />
          ))}
        </div>
        <div className="pokemon-management">
          <div className="partner-controls">
            <button
              className="button secondary"
              disabled={!canManage}
              onClick={(event) => {
                event.currentTarget.focus({ preventScroll: true });
                setEquipmentOpen(true);
              }}
            >
              <Package size={16} /> Equipamento
            </button>
            <button
              className="button secondary"
              disabled={!canManage}
              onClick={(event) => {
                event.currentTarget.focus({ preventScroll: true });
                setNicknameOpen(true);
              }}
            >
              <Pencil size={16} /> Apelido
            </button>
          </div>
          <button
            className="button primary full"
            aria-label={
              lead
                ? "Abre as batalhas"
                : !canManage
                  ? "Troque a ordem entre batalhas"
                  : "Colocar na frente · grátis"
            }
            disabled={lead || !canManage}
            onClick={() => act({ type: "LEAD", id: mon.id })}
          >
            {lead ? <Flag size={17} /> : <ArrowUp size={17} />}{" "}
            {lead
              ? "Abre as batalhas"
              : !canManage
                ? "Ordem bloqueada"
                : "Colocar na frente"}
          </button>
          {evolutions.length > 1 &&
            evolutions.some((option) => option.available) && (
              <button
                className="button secondary full"
                aria-label="Escolher evolução · grátis"
                disabled={!canManage}
                onClick={() =>
                  act({ type: "EVOLUTION_REQUEST", monId: mon.id })
                }
              >
                <Sparkles size={17} />
                Escolher evolução
              </button>
            )}
        </div>
        <PokemonFeats mon={mon} run={run} />
      </div>
      {equipmentOpen && (
        <EquipmentDialog
          run={run}
          act={act}
          monId={mon.id}
          onClose={() => setEquipmentOpen(false)}
        />
      )}
      {nicknameOpen && (
        <NicknameDialog
          mon={mon}
          act={act}
          onClose={() => setNicknameOpen(false)}
        />
      )}
    </section>
  );
}
