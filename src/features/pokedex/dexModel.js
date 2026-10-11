import catalog from "../../game/catalog.json" with { type: "json" };
import { TYPES } from "../../game/data/types.js";

export const DEX_ENTRIES = [
  ...new Map(Object.values(catalog).map((data) => [data.name, data])).values(),
].sort((a, b) => a.num - b.num || a.name.localeCompare(b.name));
export const DEX_REGIONS = [
  "Kanto",
  "Johto",
  "Hoenn",
  "Sinnoh",
  "Unova",
  "Kalos",
  "Alola",
  "Galar",
];
export const DEX_TYPES = [
  ...new Set(DEX_ENTRIES.flatMap((entry) => entry.types)),
].sort((a, b) => (TYPES[a] || a).localeCompare(TYPES[b] || b, "pt-BR"));
export const KIND_LABELS = {
  starter: "Inicial",
  capture: "Capturado",
  evolution: "Evoluiu na jornada",
  theft: "Resgatado do contrabandista",
  snapshot: "Equipe de save antigo",
};

export function dexRegion(entry) {
  if (entry.name.endsWith("-Alola")) return "Alola";
  if (entry.name.endsWith("-Galar")) return "Galar";
  return DEX_REGIONS[
    [151, 251, 386, 493, 649, 721, 809, Infinity].findIndex(
      (limit) => entry.num <= limit,
    )
  ];
}

export function collectionIndex(collection) {
  const index = new Map();
  for (const record of collection) {
    if (!record || typeof record.species !== "string") continue;
    if (!Object.hasOwn(catalog, record.species)) continue;
    const species = catalog[record.species].name;
    if (!index.has(species))
      index.set(species, { normal: false, shiny: false, records: [] });
    const item = index.get(species);
    item[record.shiny === true ? "shiny" : "normal"] = true;
    item.records.push(record);
  }
  return index;
}

export function regionProgress(index) {
  return DEX_REGIONS.map((name) => {
    const entries = DEX_ENTRIES.filter((entry) => dexRegion(entry) === name);
    return {
      name,
      total: entries.length,
      registered: entries.filter((entry) => index.has(entry.name)).length,
      shiny: entries.filter((entry) => index.get(entry.name)?.shiny).length,
    };
  }).filter((region) => region.total);
}

const normalize = (text) =>
  String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export function filteredDex(
  index,
  {
    query = "",
    status = "registered",
    region = "all",
    type = "all",
    variant = "all",
    sort = "number",
  } = {},
) {
  const search = normalize(query);
  const entries = DEX_ENTRIES.filter((entry) => {
    const record = index.get(entry.name);
    return (
      (!search ||
        normalize(entry.name).includes(search) ||
        String(entry.num) === search) &&
      (status === "all" ||
        (status === "missing" ? !record : Boolean(record))) &&
      (region === "all" || dexRegion(entry) === region) &&
      (type === "all" || entry.types.includes(type)) &&
      (variant === "all" ||
        (variant === "both"
          ? record?.normal && record?.shiny
          : record?.[variant]))
    );
  });
  if (sort === "name") entries.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "recent") {
    const order = new Map([...index.keys()].map((name, i) => [name, i]));
    entries.sort(
      (a, b) =>
        (order.get(b.name) ?? -1) - (order.get(a.name) ?? -1) || a.num - b.num,
    );
  }
  return entries;
}

export function evolutionaryFamily(entry) {
  if (!entry) return [];
  let base = entry;
  const visited = new Set();
  while (catalog[base.prevo] && !visited.has(base.name)) {
    visited.add(base.name);
    base = catalog[base.prevo];
  }
  const family = [];
  visited.clear();
  function visit(mon) {
    if (!mon || visited.has(mon.name)) return;
    visited.add(mon.name);
    family.push(mon);
    (mon.evos || []).forEach((name) => visit(catalog[name]));
  }
  visit(base);
  return family;
}

export function dexRuns(records, variant = "all") {
  const runs = new Map();
  for (const entry of records) {
    if (
      (variant === "normal" && entry.shiny === true) ||
      (variant === "shiny" && entry.shiny !== true)
    )
      continue;
    const key = [entry.slot, entry.seed, entry.runNumber].join(":");
    if (!runs.has(key))
      runs.set(key, { ...entry, normal: false, shiny: false });
    runs.get(key)[entry.shiny === true ? "shiny" : "normal"] = true;
  }
  return [...runs.values()];
}
