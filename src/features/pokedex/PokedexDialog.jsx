import { useMemo, useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { Modal } from "../../components/ui/Modal.jsx";
import { ShinyMark } from "../../components/pokemon/ShinyMark.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { TypeTag } from "../../components/pokemon/TypeTag.jsx";
import catalog from "../../game/catalog.json" with { type: "json" };
import { stateCollection } from "../../game/persistence/dexStorage.js";

const ENTRIES = [
  ...new Map(Object.values(catalog).map((data) => [data.name, data])).values(),
].sort((a, b) => a.num - b.num || a.name.localeCompare(b.name));

export function PokedexDialog({ state, slot, onClose }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("registered");
  const [selected, setSelected] = useState(null);
  const collection = useMemo(() => stateCollection(state, slot), [state, slot]);
  const owned = new Set(collection.map((entry) => entry.species));
  const shinies = new Set(
    collection.filter((entry) => entry.shiny).map((entry) => entry.species),
  );
  const visible = ENTRIES.filter(
    (data) =>
      (filter === "all" ||
        (filter === "shiny" ? shinies.has(data.name) : owned.has(data.name))) &&
      (data.name.toLowerCase().includes(query.toLowerCase()) ||
        String(data.num) === query.replace(/^#/, "")),
  );
  const chosen =
    visible.find((entry) => entry.name === selected) ||
    visible.find((entry) => owned.has(entry.name)) ||
    visible[0];
  const observations = collection.filter(
    (entry) => entry.species === chosen?.name,
  );
  const runs = observations.filter(
    (entry, i, all) =>
      all.findIndex(
        (other) =>
          other.slot === entry.slot &&
          other.seed === entry.seed &&
          other.runNumber === entry.runNumber,
      ) === i,
  );
  const family = chosen
    ? [
        catalog[chosen.prevo],
        chosen,
        ...(chosen.evos || []).map((name) => catalog[name]),
      ].filter(Boolean)
    : [];
  const kindLabels = {
    starter: "Inicial",
    capture: "Capturado",
    evolution: "Evoluiu na jornada",
    theft: "Resgatado do contrabandista",
    snapshot: "Equipe de save antigo",
  };
  return (
    <Modal title="Sua Pokédex" className="pokedex-dialog" onClose={onClose}>
      <div className="dex-collection-summary">
        <BookOpen size={26} />
        <div>
          <strong>{owned.size} espécies registradas</strong>
          <p>Capturas e evoluções dos três slots, guardadas neste navegador.</p>
        </div>
      </div>
      <div className="dex-search">
        <Search size={18} />
        <input
          aria-label="Buscar Pokémon por nome ou número"
          placeholder="Nome ou número do Pokémon"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="dex-filters" aria-label="Filtrar Pokédex">
        <button
          className="button secondary"
          aria-pressed={filter === "registered"}
          onClick={() => setFilter("registered")}
        >
          Registrados
        </button>
        <button
          className="button secondary"
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}
        >
          Catálogo do jogo
        </button>
        <button
          className="button secondary"
          aria-pressed={filter === "shiny"}
          onClick={() => setFilter("shiny")}
        >
          ✦ Shinies · {shinies.size}
        </button>
      </div>
      <div className="pokedex-layout">
        <div className="pokedex-list" aria-label="Espécies">
          {visible.map((entry) => (
            <button
              key={entry.name}
              className={`pokedex-entry${chosen?.name === entry.name ? " is-selected" : ""}${!owned.has(entry.name) ? " is-unknown" : ""}`}
              aria-pressed={chosen?.name === entry.name}
              onClick={() => setSelected(entry.name)}
            >
              <Sprite name={entry.name} shiny={shinies.has(entry.name)} />
              <span>
                <small>#{String(entry.num).padStart(3, "0")}</small>
                <strong>{entry.name}</strong>
              </span>
              <small>{owned.has(entry.name) ? "✓" : "—"}</small>
            </button>
          ))}
          {!visible.length && (
            <p className="notice">
              {query
                ? "Nenhum Pokémon encontrado."
                : filter === "shiny"
                  ? "Você ainda não registrou um shiny. Cada Pokémon novo tem chance de 1/1024."
                  : "Escolha um inicial ou capture seu primeiro Pokémon para começar o registro."}
            </p>
          )}
        </div>
        <div className="pokedex-details">
          {chosen && (
            <>
              <Sprite name={chosen.name} shiny={shinies.has(chosen.name)} />
              <span className="section-label">
                #{String(chosen.num).padStart(3, "0")} ·{" "}
                {owned.has(chosen.name) ? "REGISTRADO" : "AINDA NÃO REGISTRADO"}
              </span>
              <h3>
                {chosen.name} <ShinyMark shiny={shinies.has(chosen.name)} />
              </h3>
              <div className="types">
                {chosen.types.map((type) => (
                  <TypeTag key={type} type={type} />
                ))}
              </div>
              <h4>Linha evolutiva</h4>
              <div className="dex-family">
                {family.map((entry) => (
                  <button
                    key={entry.name}
                    aria-label={`Consultar ${entry.name}`}
                    className={owned.has(entry.name) ? "" : "is-unknown"}
                    onClick={() => setSelected(entry.name)}
                  >
                    <Sprite name={entry.name} shiny={shinies.has(entry.name)} />
                    <small>{entry.name}</small>
                  </button>
                ))}
              </div>
              <h4>Jornadas registradas · {runs.length}</h4>
              {runs.length ? (
                <ul className="dex-run-list">
                  {runs.map((entry) => (
                    <li key={`${entry.slot}:${entry.seed}:${entry.runNumber}`}>
                      <strong>
                        Slot {entry.slot} · Run #{entry.runNumber} ·{" "}
                        {entry.runName}{" "}
                        <ShinyMark
                          shiny={observations.some(
                            (other) =>
                              other.shiny &&
                              other.slot === entry.slot &&
                              other.seed === entry.seed &&
                              other.runNumber === entry.runNumber,
                          )}
                        />
                      </strong>
                      <span>
                        {kindLabels[entry.kind] || "Registrado"} · semana{" "}
                        {entry.week}
                        {entry.level ? ` · nível ${entry.level}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="fine-print">
                  Esta espécie ainda não acompanhou suas jornadas.
                </p>
              )}
            </>
          )}
        </div>
      </div>
      <p className="fine-print">
        Saves antigos preservam a equipe conhecida. Capturas antigas que não
        estavam mais na equipe não podem ser reconstruídas.
      </p>
    </Modal>
  );
}
