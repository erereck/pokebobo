import { mkdir, writeFile } from "node:fs/promises";
import { PROGRESSION as p } from "../src/game/config/progression.js";
import { CAMPAIGN_RULES as c } from "../src/game/config/campaign.js";
import { random } from "../src/game/random/random.js";

const samples = Number(process.argv[2] || 10000);
if (!Number.isSafeInteger(samples) || samples < 1 || samples > 1000000)
  throw Error("Use uma quantidade inteira de 1 a 1000000.");
function trajectory(trainingPerCity, seed) {
  let level = p.initialLevel;
  const rng = { rng: seed || 1 },
    gyms = [];
  const gain = (n) => (level = Math.min(p.maxLevel, level + n));
  for (let position = 0; position < c.cityCount; position++) {
    if (position > 0) gain(p.travelLevels);
    for (let k = 0; k < trainingPerCity; k++)
      gain(
        p.trainingMin +
          Math.floor(random(rng) * (p.trainingMax - p.trainingMin + 1)),
      );
    if (position >= 2) {
      const badge = position - 2;
      gyms.push({
        gym: badge + 1,
        player: level,
      });
      gain(p.gymVictoryLevels);
    }
  }
  const leagueEntry = level;
  for (let i = 0; i < c.eliteCount; i++) gain(p.leagueVictoryLevels);
  return { gyms, leagueEntry, championEntry: level };
}
function stats(values) {
  values.sort((a, b) => a - b);
  const q = (f) => values[Math.floor((values.length - 1) * f)];
  return {
    min: values[0],
    p10: q(0.1),
    median: q(0.5),
    p90: q(0.9),
    max: values.at(-1),
    mean: Number(
      (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
    ),
    percent99OrMore: Number(
      ((values.filter((x) => x >= 99).length / values.length) * 100).toFixed(2),
    ),
  };
}
const strategies = [];
for (let train = 0; train <= c.weeksPerCity; train++) {
  const runs = Array.from({ length: samples }, (_, i) =>
    trajectory(train, Math.imul(i + 1, 0x9e3779b1) >>> 0),
  );
  strategies.push({
    trainingPerCity: train,
    firstGym: stats(runs.map((r) => r.gyms[0].player)),
    eighthGym: stats(runs.map((r) => r.gyms[7].player)),
    leagueEntry: stats(runs.map((r) => r.leagueEntry)),
    championEntry: stats(runs.map((r) => r.championEntry)),
  });
}
const report = {
  method:
    "Orçamento de níveis, não simulação de batalhas. Assume todas as vitórias, inicial presente desde a origem, nenhuma emboscada, mesmo número de treinos por cidade. Não mede taxa de vitória.",
  samplesPerStrategy: samples,
  progression: p,
  freeLevelsBeforeLeague:
    p.initialLevel +
    (c.cityCount - 1) * p.travelLevels +
    c.gymCount * p.gymVictoryLevels,
  noTraining: trajectory(0, 1),
  strategies,
};
await mkdir("docs/balance", { recursive: true });
await writeFile(
  "docs/balance/current-progression.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.table(
  strategies.map((s) => ({
    treinos: s.trainingPerCity,
    "1º ginásio (mediana)": s.firstGym.median,
    "8º ginásio (mediana)": s.eighthGym.median,
    "Liga (mediana)": s.leagueEntry.median,
    "Liga ≥99 (%)": s.leagueEntry.percent99OrMore,
  })),
);
console.log(report.method);
