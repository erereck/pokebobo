import { readFile, writeFile } from "node:fs/promises";
import catalog from "../src/game/catalog.json" with { type: "json" };
import { MARKET_TMS } from "../src/game/config/market.js";
import { lineageFor } from "./catalog/learnsetPolicy.mjs";

// Compilado no Node: o bundle web não inclui os learnsets do Showdown.
export function machineMovesFor(species) {
  const generation = species.moveReference.generation;
  const stages = lineageFor(species.name);
  return MARKET_TMS.filter((tm) =>
    stages.some(({ data }) => data.learnset[tm.id]?.includes(`${generation}M`)),
  ).map((tm) => tm.id);
}

const machines = Object.fromEntries(
  Object.entries(catalog).map(([name, species]) => [
    name,
    machineMovesFor(species),
  ]),
);
const target = "src/game/data/marketCompatibility.json";
if (process.argv.includes("--check")) {
  if ((await readFile(target, "utf8")) !== JSON.stringify(machines))
    throw Error(
      "Compatibilidade de TMs desatualizada. Execute npm run market:catalog.",
    );
} else await writeFile(target, JSON.stringify(machines));
console.log(
  `Compatibilidade de ${MARKET_TMS.length} TMs em ${Object.keys(machines).length} entradas.`,
);
