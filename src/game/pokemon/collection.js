import catalog from "../catalog.json" with { type: "json" };

export function registerPokemon(r, mon, kind = "capture") {
  r.collection ||= [];
  if (
    r.collection.some(
      (entry) => entry.monId === mon.id && entry.species === mon.name,
    )
  )
    return;
  r.collection.push({
    species: mon.name,
    monId: mon.id,
    kind,
    level: mon.level,
    runNumber: r.number,
    runName: r.name,
    seed: r.seed,
    week: r.week,
  });
}

export function registerEvolution(r, before, after) {
  if (before.name === after.name) return;
  const stages = [];
  let name = after.name;
  while (name && name !== before.name) {
    stages.unshift(name);
    name = catalog[name]?.prevo;
  }
  for (const species of stages)
    registerPokemon(r, { ...after, name: species }, "evolution");
}
