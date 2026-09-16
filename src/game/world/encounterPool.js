import catalog from "../catalog.json" with { type: "json" };
import { POOLS } from "../data/encounters/index.js";
import { CITY_SPECIES } from "../data/encounters/signatures.js";

export function familyOf(name) {
  let species = catalog[name];
  while (species?.prevo && catalog[species.prevo])
    species = catalog[species.prevo];
  return species?.name || name;
}

export function encounterPool(here, next) {
  const signature = CITY_SPECIES[here.id] || [];
  return [
    ...new Set([
      ...signature,
      ...(CITY_SPECIES[next?.id] || []),
      ...POOLS[here.biome],
      ...(next ? POOLS[next.biome] : []),
    ]),
  ].filter((name) => catalog[name]);
}
