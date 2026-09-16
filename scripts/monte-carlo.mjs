import { summarizeCampaigns, breakdowns } from "./simulation/summarize.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { runCampaign } from "./simulation/runCampaign.mjs";
import { STRATEGIES } from "./simulation/policies.mjs";
import { PROGRESSION } from "../src/game/config/progression.js";
import packageInfo from "../package.json" with { type: "json" };
const args = Object.fromEntries(
  process.argv
    .slice(2)
    .reduce(
      (pairs, arg, index, all) =>
        arg.startsWith("--")
          ? [...pairs, [arg.slice(2), all[index + 1]]]
          : pairs,
      [],
    ),
);
const count = Number(args.runs || 25),
  seed = Number(args.seed || 20260913),
  mode = args.mode || "normal";
const strategies =
  args.strategy && args.strategy !== "all" ? [args.strategy] : STRATEGIES;
if (
  !Number.isInteger(count) ||
  count < 1 ||
  count > 100000 ||
  !Number.isInteger(seed) ||
  !["normal", "rush", "nuzlocke"].includes(mode) ||
  strategies.some((s) => !STRATEGIES.includes(s))
)
  throw Error(
    "Use --runs 1..100000 --seed integer --mode normal|rush|nuzlocke --strategy all|training|balanced|coverage|random",
  );
const results = [],
  started = Date.now();
for (const strategy of strategies) {
  for (let index = 0; index < count; index++) {
    const runSeed = (seed + Math.imul(index + 1, 0x9e3779b1)) >>> 0;
    results.push(runCampaign(runSeed, strategy, mode));
    if ((index + 1) % 10 === 0 || index + 1 === count)
      console.log(strategy + ": " + (index + 1) + "/" + count);
  }
}
const summaries = strategies.map((strategy) => {
  const rows = results.filter((r) => r.strategy === strategy);
  return { strategy, ...summarizeCampaigns(rows), ...breakdowns(rows) };
});
const report = {
  version: packageInfo.version,
  seed,
  runsPerStrategy: count,
  mode,
  progression: PROGRESSION,
  durationSeconds: (Date.now() - started) / 1000,
  methodology:
    "Campanhas completas com ações do reducer e batalhas reais @pkmn/sim. Mesmas seeds por estratégia; política de decisão usa RNG separado. Ambos os lados usam a IA observável. Limite de 180 turnos por combate: truncamentos são reportados separadamente, não contam como derrota. Vitórias não são estimativa de jogadores humanos.",
  summaries,
  results,
};
const out = path.resolve(
  args.out || `docs/balance/monte-carlo-${packageInfo.version}-${mode}.json`,
);
await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, JSON.stringify(report, null, 2));
console.table(
  summaries.map(
    ({
      strategy,
      runs,
      wins,
      winRate,
      censored,
      meanBadges,
      medianLeagueLevel,
    }) => ({
      strategy,
      runs,
      wins,
      winRate,
      censored,
      meanBadges: meanBadges.toFixed(2),
      medianLeagueLevel,
    }),
  ),
);
console.log(
  "Relatório: " + out + " · " + report.durationSeconds.toFixed(1) + "s",
);
