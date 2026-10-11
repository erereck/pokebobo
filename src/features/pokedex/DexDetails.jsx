import { useState } from "react";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { TypeTag } from "../../components/pokemon/TypeTag.jsx";
import { DexVariants } from "./DexVariants.jsx";
import {
  dexRegion,
  dexRuns,
  evolutionaryFamily,
  KIND_LABELS,
} from "./dexModel.js";

export function DexDetails({ entry, index, preferShiny, onSelect }) {
  const owned = index.get(entry.name);
  const [variant, setVariant] = useState(
    (preferShiny && owned?.shiny) || (!owned?.normal && owned?.shiny)
      ? "shiny"
      : "normal",
  );
  const runs = dexRuns(owned?.records || [], variant);
  return (
    <>
      <span className="section-label">
        #{String(entry.num).padStart(3, "0")} · {dexRegion(entry)} ·{" "}
        {owned ? "REGISTRADO" : "A DESCOBRIR"}
      </span>
      <h3>{entry.name}</h3>
      <div className="types">
        {entry.types.map((type) => (
          <TypeTag key={type} type={type} />
        ))}
      </div>
      <DexVariants
        name={entry.name}
        normal={Boolean(owned?.normal)}
        shiny={Boolean(owned?.shiny)}
        preferShiny={preferShiny}
        onVariant={setVariant}
      />
      <h4>Linha evolutiva</h4>
      <div className="dex-family">
        {evolutionaryFamily(entry).map((mon) => (
          <button
            key={mon.name}
            className={index.has(mon.name) ? "" : "is-unknown"}
            aria-label={"Consultar " + mon.name}
            aria-pressed={mon.name === entry.name}
            onClick={() => onSelect(mon.name)}
          >
            <Sprite
              name={mon.name}
              battleStyle="2d"
              shiny={Boolean(index.get(mon.name)?.shiny)}
            />
            <small>{mon.name}</small>
          </button>
        ))}
      </div>
      <h4>
        Jornadas{" "}
        {variant === "shiny"
          ? "com shiny"
          : variant === "normal"
            ? "com variante normal"
            : "registradas"}{" "}
        · {runs.length}
      </h4>
      {runs.length ? (
        <ul className="dex-run-list">
          {runs.map((record) => (
            <li key={[record.slot, record.seed, record.runNumber].join(":")}>
              <strong>
                Slot {record.slot} · Run #{record.runNumber} ·{" "}
                {record.runName || "Treinador"}
              </strong>
              <span>
                {KIND_LABELS[record.kind] || "Registrado"} · semana{" "}
                {record.week || 1}
                {record.level ? " · nível " + record.level : ""}
              </span>
              <small>
                {[record.normal && "Normal", record.shiny && "✦ Shiny"]
                  .filter(Boolean)
                  .join(" + ")}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="fine-print">
          {owned
            ? "Esta variante ainda não acompanhou suas jornadas."
            : "Capture ou evolua esta espécie para registrar sua história."}
        </p>
      )}
    </>
  );
}
