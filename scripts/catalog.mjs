import { learnsetFor } from "./catalog/learnsetPolicy.mjs";
import { createHash } from "node:crypto";
import packageInfo from "../package.json" with { type: "json" };
import { Dex } from "@pkmn/sim";
import { ORIGINS, GYMS, ELITES, CHAMPIONS, POOLS } from "../src/game/data.js";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { access } from "node:fs/promises";
import { CITY_SPECIES } from "../src/game/data/encounters/signatures.js";
const names = new Set([
  ...ORIGINS.flatMap((x) => x.starters),
  ...GYMS.flatMap((x) => x.team),
  ...ELITES.flatMap((x) => x.team),
  ...CHAMPIONS.flatMap((x) => x.team),
  ...Object.values(POOLS).flat(),
  ...Object.values(CITY_SPECIES).flat(),
]);
for (const name of names) {
  const s = Dex.species.get(name);
  if (s.prevo) names.add(s.prevo);
  for (const evo of s.evos || [])
    if (Dex.species.get(evo).gen <= 8) names.add(evo);
}
const catalog = {};
const audit = {
  version: packageInfo.version,
  engine: packageInfo.dependencies["@pkmn/sim"],
  policy: "lineage-levels-v1",
  species: {},
  excludedSpecies: [],
};
for (const name of names) {
  const s = Dex.species.get(name);
  if (!s.exists) throw Error(name);
  const learned = learnsetFor(name);
  if (!learned) {
    audit.excludedSpecies.push({
      name,
      reason:
        "Sem geração 8/7 de aprendizado comum à linhagem; espécie não usada nos elencos atuais.",
    });
    continue;
  }
  audit.species[name] = { ...learned.reference, excluded: learned.excluded };
  catalog[name] = {
    name: s.name,
    id: s.id,
    num: s.num,
    types: s.types,
    stats: s.baseStats,
    ability: s.abilities[0],
    evos: s.evos || [],
    evoLevel: s.evoLevel || null,
    evoType: s.evoType || null,
    prevo: s.prevo || null,
    moves: learned.moves,
    moveReference: learned.reference,
  };
  if (name !== s.name) catalog[s.name] = catalog[name];
}
for (const species of Object.values(catalog))
  species.evos = species.evos.filter((name) => catalog[name]);
for (const name of [
  ...ORIGINS.flatMap((o) => o.starters),
  ...GYMS.flatMap((g) => g.team),
  ...ELITES.flatMap((g) => g.team),
  ...CHAMPIONS.flatMap((g) => g.team),
  ...Object.values(POOLS).flat(),
  ...Object.values(CITY_SPECIES).flat(),
])
  if (!catalog[name]) throw Error("Espécie utilizada sem referência: " + name);
audit.packageLockSha256 = createHash("sha256")
  .update(await readFile("package-lock.json"))
  .digest("hex");
await mkdir("docs/balance", { recursive: true });
audit.catalogSha256 = createHash("sha256")
  .update(JSON.stringify(catalog))
  .digest("hex");
await writeFile(
  "docs/balance/catalog-" + packageInfo.version + ".json",
  JSON.stringify(audit, null, 2),
);
await mkdir("src/game", { recursive: true });
await writeFile("src/game/catalog.json", JSON.stringify(catalog));
console.log(
  `Catálogo: ${Object.keys(catalog).length} entradas, com atributos e golpes do Showdown.`,
);
await mkdir("public/sprites", { recursive: true });
const ids = [...new Set(Object.values(catalog).map((s) => s.num))];
let failures = [];
let next = 0;
await Promise.all(
  Array.from({ length: 10 }, async () => {
    while (next < ids.length) {
      const id = ids[next++];
      try {
        try {
          await access(`public/sprites/${id}.png`);
          continue;
        } catch {}
        const res = await fetch(
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        );
        if (!res.ok) throw Error(res.status);
        await writeFile(
          `public/sprites/${id}.png`,
          Buffer.from(await res.arrayBuffer()),
        );
      } catch (e) {
        failures.push(id);
      }
    }
  }),
);
console.log(
  `Sprites locais: ${ids.length - failures.length}/${ids.length}`,
  failures,
);
if (failures.length) process.exitCode = 1;
