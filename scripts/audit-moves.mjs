import { ELITES } from "../src/game/data/league/elites.js";
import { CHAMPIONS } from "../src/game/data/league/champions.js";
import { PROGRESSION } from "../src/game/config/progression.js";
import { writeFile, mkdir } from "node:fs/promises";
import { Dex } from "@pkmn/sim";
import { GYMS } from "../src/game/data/gyms/index.js";
import { ORIGINS } from "../src/game/data/origins.js";
import { movesFor } from "../src/game/pokemon/moves.js";
import catalog from "../src/game/catalog.json" with { type: "json" };
import pkg from "../package.json" with { type: "json" };

function audit(name, level, context) {
  const species = catalog[name],
    moves = movesFor(name, level).map((id) => {
      const m = Dex.mod("gen8").moves.get(id),
        entry = species.moves.find((m) => m.id === id);
      return {
        id,
        name: m.name,
        power: m.basePower,
        accuracy: m.accuracy,
        type: m.type,
        category: m.category,
        effectiveLevel: entry?.level ?? null,
        sources: entry ? [entry.source] : [],
      };
    });
  return {
    ...context,
    reference: species.moveReference,
    name,
    level,
    moves,
    flags: [
      ...(moves.some((m) => m.power >= 90 && level <= 25)
        ? ["poder ≥90 até nível 25"]
        : []),
      ...(moves.some(
        (m) => m.power >= 90 && m.sources.some((s) => s.code.endsWith("L1")),
      )
        ? ["golpe forte de evolução/nível 1"]
        : []),
      ...(!moves.some(
        (m) => m.category !== "Status" && species.types.includes(m.type),
      )
        ? ["sem STAB de dano"]
        : []),
    ],
  };
}
const gyms = GYMS.flatMap((g) =>
  g.team.map((name, index) =>
    audit(name, g.levels[index], {
      gym: g.leader,
      city: g.id,
      order: g.order,
      sourceGame: g.source,
    }),
  ),
);
const starters = ORIGINS.flatMap((o) =>
  o.starters.map((name) => audit(name, 10, { origin: o.name })),
);
const boostedGyms = GYMS.flatMap((g) =>
  g.team.map((name, index) =>
    audit(name, g.levels[index] + PROGRESSION.gymCatchupLevels, {
      gym: g.leader,
      city: g.id,
      order: g.order,
      boost: PROGRESSION.gymCatchupLevels,
    }),
  ),
);
const league = [
  ...ELITES.flatMap((t) =>
    Array.from({ length: 4 }, (_, slot) =>
      t.team.map((name, index) =>
        audit(
          name,
          PROGRESSION.leagueFirstLevel +
            slot * PROGRESSION.leagueLevelStep +
            (index === t.team.length - 1 ? PROGRESSION.aceBonus : 0),
          { trainer: t.name, slot: slot + 1 },
        ),
      ),
    ).flat(),
  ),
  ...CHAMPIONS.flatMap((t) =>
    t.team.map((name, index) =>
      audit(
        name,
        PROGRESSION.leagueFirstLevel +
          4 * PROGRESSION.leagueLevelStep +
          (index === t.team.length - 1 ? PROGRESSION.aceBonus : 0),
        { trainer: t.name, slot: 5 },
      ),
    ),
  ),
];
const report = {
  version: pkg.version,
  engine: "@pkmn/sim " + pkg.dependencies["@pkmn/sim"],
  method:
    "Sets automáticos nos níveis originais e com +6, iniciais no nível 10 e cada posição possível da Liga. Fonte efetiva de cada golpe vem do catálogo e da regra lineage-levels-v1. Flags são pontos de revisão, não declaração de ilegalidade ou de desequilíbrio.",
  gyms,
  starters,
  boostedGyms,
  league,
};
await mkdir("docs/balance", { recursive: true });
await writeFile(
  "docs/balance/moves-" + pkg.version + ".json",
  JSON.stringify(report, null, 2),
);
console.table(
  gyms
    .filter((g) => g.order <= 2 && g.flags.length)
    .map((g) => ({
      leader: g.gym,
      species: g.name,
      level: g.level,
      moves: g.moves.map((m) => m.name).join(", "),
      flags: g.flags.join("; "),
    })),
);
console.log(
  `${gyms.length} sets de ginásio, ${boostedGyms.length} com +6, ${starters.length} iniciais e ${league.length} sets da Liga auditados.`,
);
