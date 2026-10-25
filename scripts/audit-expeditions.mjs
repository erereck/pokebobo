import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import {
  EXPEDITION_SITES,
  EXPEDITION_RULES,
} from "../src/game/config/expeditions.js";
import { ORIGINS } from "../src/game/data/origins.js";
import { guardianTeam } from "../src/game/expeditions/expeditions.js";
import { makeMon } from "../src/game/pokemon/createPokemon.js";
import { grow } from "../src/game/pokemon/evolution.js";
import { movesFor } from "../src/game/pokemon/moves.js";
import { simulateCombat } from "./simulation/runCampaign.mjs";
import { MARKET_TMS } from "../src/game/config/market.js";

const combats = [];
for (const site of EXPEDITION_SITES)
  for (const [originIndex, origin] of ORIGINS.entries())
    for (const formation of ["rocha-psiquico", "agua-sombrio"])
      for (const offset of [-3, 0, 3])
        for (const seed of [1, 2, 3]) {
          const level = site.team[1].level + offset;
          const roots = (
            formation === "rocha-psiquico"
              ? [origin.starters[0], "Pidgey", "Geodude", "Abra", "Gastly"]
              : [origin.starters[0], "Pidgey", "Magikarp", "Houndour", "Oddish"]
          ).slice(0, site.badges === 2 ? 4 : 5);
          const player = roots.map((name, i) => {
            const mon = grow(makeMon(name, 1, `p${i}`), level - 1);
            return { ...mon, moves: movesFor(mon.name, level) };
          });
          const spec = {
            name: site.id,
            player,
            enemy: guardianTeam(site),
            seed: [2026, 10, 24 + originIndex, seed],
            choices: [],
          };
          const { snapshot, censored } = simulateCombat(spec, 240);
          combats.push({
            site: site.id,
            origin: origin.id,
            formation,
            level,
            seed,
            player: player.map(({ name, level }) => ({ name, level })),
            winner: snapshot.winner,
            turns: snapshot.turn,
            fainted: snapshot.player.filter((m) => m.fainted).length,
            censored,
          });
        }
const averageTm =
  MARKET_TMS.reduce((sum, tm) => sum + tm.price, 0) / MARKET_TMS.length;
const report = {
  method:
    "252 combates reais: dois lugares, sete origens (primeiro inicial), três níveis (-3/0/+3 em relação ao segundo guardião), duas composições (rocha/psíquico ou água/sombrio) e três seeds. Equipes de quatro/cinco, linhagens evoluídas, sem itens, mesma IA observadora em ambos os lados, limite 240 turnos. Amostra controlada; não é campanha completa nem taxa de vitória humana. Não usa equipe nível 100 para medir dificuldade.",
  economy: EXPEDITION_SITES.map((site) => ({
    site: site.id,
    weeklyCost: 1,
    visitsPerJourney: 1,
    partialMoney: site.cacheMoney,
    fullMoney: site.cacheMoney + site.victoryMoney,
    fullMoneyPerAverageTm: (site.cacheMoney + site.victoryMoney) / averageTm,
    cacheBalls: site.cacheBalls,
    supplyChoice: EXPEDITION_RULES.supplies,
    equipmentChoice: site.rewards,
  })),
  totals: EXPEDITION_SITES.map((site) => {
    const rows = combats.filter((row) => row.site === site.id);
    return {
      site: site.id,
      combats: rows.length,
      wins: rows.filter((row) => row.winner === "Você").length,
      censored: rows.filter((row) => row.censored).length,
      levels: [...new Set(rows.map((row) => row.level))].map((level) => {
        const group = rows.filter((row) => row.level === level);
        return {
          level,
          wins: group.filter((row) => row.winner === "Você").length,
          combats: group.length,
          meanFainted:
            group.reduce((sum, row) => sum + row.fainted, 0) / group.length,
        };
      }),
    };
  }),
  combats,
};
assert.equal(combats.length, 252);
assert.equal(combats.filter((row) => row.censored).length, 0);
const folder = "docs/balance/expeditions-0.24.0";
await mkdir(folder, { recursive: true });
await writeFile(
  `${folder}/combat-and-economy.json`,
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify({ economy: report.economy, totals: report.totals }, null, 2),
);
