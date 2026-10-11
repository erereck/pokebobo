import { useMemo, useRef, useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { Modal } from "../../components/ui/Modal.jsx";
import { Sprite } from "../../components/pokemon/Sprite.jsx";
import { stateCollection } from "../../game/persistence/dexStorage.js";
import {
  collectionIndex,
  DEX_ENTRIES,
  DEX_REGIONS,
  DEX_TYPES,
  filteredDex,
} from "./dexModel.js";
import { DexProgress } from "./DexProgress.jsx";
import { DexDetails } from "./DexDetails.jsx";
import { TYPES } from "../../game/data/types.js";

const DEFAULTS = {
  query: "",
  status: "registered",
  region: "all",
  type: "all",
  variant: "all",
  sort: "number",
};

export function PokedexDialog({ state, slot, onClose }) {
  const [filters, setFilters] = useState(DEFAULTS);
  const [selected, setSelected] = useState(null);
  const detailsRef = useRef(null);
  const index = useMemo(
    () => collectionIndex(stateCollection(state, slot)),
    [state, slot],
  );
  const visible = useMemo(() => filteredDex(index, filters), [index, filters]);
  const chosen = visible.find((entry) => entry.name === selected) || visible[0];
  const shinies = [...index.values()].filter((record) => record.shiny).length;
  const change = (key, value) =>
    setFilters((previous) => ({ ...previous, [key]: value }));
  const select = (name, family = false) => {
    setSelected(name);
    if (family) setFilters({ ...DEFAULTS, status: "all" });
    if (window.matchMedia("(max-width: 600px)").matches)
      detailsRef.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
  };
  return (
    <Modal title="Sua Pokédex" className="pokedex-dialog" onClose={onClose}>
      <div className="dex-collection-summary">
        <BookOpen size={28} />
        <div>
          <strong>Sua coleção, jornada por jornada.</strong>
          <p>Capturas e evoluções dos três slots, guardadas neste navegador.</p>
        </div>
      </div>
      <div className="dex-total-grid">
        <div>
          <strong>
            {index.size}
            <small>/{DEX_ENTRIES.length}</small>
          </strong>
          <span>espécies e formas</span>
        </div>
        <div>
          <strong>✦ {shinies}</strong>
          <span>shinies registrados</span>
        </div>
        <div>
          <strong>
            {Math.round((index.size / DEX_ENTRIES.length) * 100)}%
          </strong>
          <span>do catálogo do jogo</span>
        </div>
      </div>
      <DexProgress
        index={index}
        region={filters.region}
        onRegion={(value) => change("region", value)}
      />
      <div className="dex-search">
        <Search size={18} />
        <input
          aria-label="Buscar Pokémon por nome ou número"
          placeholder="Nome ou número do Pokémon"
          value={filters.query}
          onChange={(event) => change("query", event.target.value)}
        />
      </div>
      <div className="dex-filters" aria-label="Filtrar registros">
        {[
          ["registered", "Registrados"],
          ["all", "Catálogo"],
          ["missing", "Faltam"],
        ].map(([key, label]) => (
          <button
            key={key}
            className="button secondary"
            aria-pressed={filters.status === key}
            onClick={() => change("status", key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="dex-selectors">
        <label>
          REGIÃO
          <select
            aria-label="Região da Pokédex"
            value={filters.region}
            onChange={(e) => change("region", e.target.value)}
          >
            <option value="all">Todas as regiões</option>
            {DEX_REGIONS.map((region) => (
              <option key={region}>{region}</option>
            ))}
          </select>
        </label>
        <label>
          TIPO
          <select
            aria-label="Tipo do Pokémon"
            value={filters.type}
            onChange={(e) => change("type", e.target.value)}
          >
            <option value="all">Todos os tipos</option>
            {DEX_TYPES.map((type) => (
              <option value={type} key={type}>
                {TYPES[type] || type}
              </option>
            ))}
          </select>
        </label>
        <label>
          VARIANTE
          <select
            aria-label="Variante registrada"
            value={filters.variant}
            onChange={(e) => change("variant", e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="normal">Normal</option>
            <option value="shiny">✦ Shinies · {shinies}</option>
            <option value="both">Normal + shiny</option>
          </select>
        </label>
        <label>
          ORDEM
          <select
            aria-label="Ordenar Pokédex"
            value={filters.sort}
            onChange={(e) => change("sort", e.target.value)}
          >
            <option value="number">Número</option>
            <option value="name">Nome</option>
            <option value="recent">Últimas descobertas</option>
          </select>
        </label>
      </div>
      <div className="dex-results">
        <span>
          {visible.length} resultado{visible.length === 1 ? "" : "s"}
        </span>
        <button
          type="button"
          className="text-button"
          onClick={() => setFilters(DEFAULTS)}
        >
          Limpar filtros
        </button>
      </div>
      <div className={"pokedex-layout" + (!chosen ? " is-empty" : "")}>
        <div className="pokedex-list" aria-label="Espécies">
          {visible.map((entry) => {
            const record = index.get(entry.name);
            return (
              <button
                key={entry.name}
                className={
                  "pokedex-entry" +
                  (chosen?.name === entry.name ? " is-selected" : "") +
                  (!record ? " is-unknown" : "")
                }
                aria-pressed={chosen?.name === entry.name}
                onClick={() => select(entry.name)}
              >
                <Sprite
                  name={entry.name}
                  battleStyle="2d"
                  loading="lazy"
                  shiny={
                    filters.variant === "normal"
                      ? false
                      : Boolean(record?.shiny)
                  }
                />
                <span>
                  <small>#{String(entry.num).padStart(3, "0")}</small>
                  <strong>{entry.name}</strong>
                  <small>
                    {record
                      ? [record.normal && "Normal", record.shiny && "✦ Shiny"]
                          .filter(Boolean)
                          .join(" + ")
                      : "A descobrir"}
                  </small>
                </span>
              </button>
            );
          })}
          {!visible.length && (
            <div className="dex-empty">
              <BookOpen size={30} />
              <strong>
                {filters.variant === "shiny" && !shinies
                  ? "Seu primeiro shiny ainda vem aí."
                  : "Nenhum registro com esses filtros."}
              </strong>
              <p>
                {index.size
                  ? "Mude a região, o tipo ou a variante para continuar explorando sua coleção."
                  : "Escolha seu inicial ou capture um Pokémon para começar a coleção."}
              </p>
              <button
                className="button secondary"
                onClick={() => setFilters({ ...DEFAULTS, status: "all" })}
              >
                Explorar catálogo
              </button>
            </div>
          )}
        </div>
        {chosen && (
          <div ref={detailsRef} className="pokedex-details">
            <DexDetails
              key={chosen.name + ":" + filters.variant}
              entry={chosen}
              index={index}
              preferShiny={filters.variant === "shiny"}
              onSelect={(name) => select(name, true)}
            />
          </div>
        )}
      </div>
      <p className="fine-print">
        O progresso considera as espécies e formas disponíveis no Pokébobo.
        Equipes de saves antigos são recuperadas; capturas antigas fora da
        equipe podem não ter registro.
      </p>
    </Modal>
  );
}
