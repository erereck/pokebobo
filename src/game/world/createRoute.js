import { city } from "../selectors/city.js";
import { pick } from "../random/pick.js";
import { CITY_SPECIES } from "../data/encounters/signatures.js";
import { encounterPool, familyOf } from "./encounterPool.js";
import { targetLevel } from "../selectors/targetLevel.js";
import { grow } from "../pokemon/evolution.js";
import { makeMon } from "../pokemon/createPokemon.js";

export function createRoute(r) {
  const here = city(r),
    next = r.route[r.position + 1];
  const used = new Set(r.seenFamilies || []),
    available = encounterPool(here, next);
  const fresh = (names) => names.filter((n) => !used.has(familyOf(n)));
  const local = CITY_SPECIES[here.id] || available;
  const first = pick(r, fresh(local).length ? fresh(local) : local);
  used.add(familyOf(first));
  const remaining = available.filter((n) => familyOf(n) !== familyOf(first));
  const second = pick(
    r,
    fresh(remaining).length ? fresh(remaining) : remaining,
  );
  const level = Math.max(8, targetLevel(r) - 1);
  r.encounters = [first, second].map((name) => ({
    name: r.badges >= 3 ? grow(makeMon(name, level, "wild"), 0).name : name,
    used: false,
  }));
  r.seenFamilies = [
    ...new Set([...(r.seenFamilies || []), familyOf(first), familyOf(second)]),
  ];
  r.currentRoute = {
    id: `${here.id}--${next?.id || "league"}`,
    from: here.id,
    to: next?.id || "league",
    biome: here.biome,
    name: next ? `${here.name} → ${next.name}` : `${here.name} → Liga`,
    species: r.encounters.map((e) => e.name),
  };
  r.routeName = r.currentRoute.name;
  r.exploredRoutes = [
    ...(r.exploredRoutes || []),
    structuredClone(r.currentRoute),
  ];
}
