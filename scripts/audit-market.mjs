import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { initialState, reducer } from "../src/game/engine.js";
import { makeMon } from "../src/game/pokemon.js";
import { MARKET_TMS, MARKET_RULES } from "../src/game/config/market.js";
import { pokemonSalePrice } from "../src/game/market/market.js";
import { ELITES } from "../src/game/data/league/elites.js";
import { CHAMPIONS } from "../src/game/data/league/champions.js";
import { simulateCombat } from "./simulation/runCampaign.mjs";

const averageTm =
  MARKET_TMS.reduce((sum, tm) => sum + tm.price, 0) / MARKET_TMS.length;
const referenceSpecies = [
  "Pidgeot",
  "Arbok",
  "Raichu",
  "Sandslash",
  "Golduck",
  "Machamp",
  "Golem",
  "Rapidash",
  "Muk",
  "Hypno",
  "Seaking",
  "Victreebel",
];
const prices = [35, 45, 55].map((level) => {
  const sales = referenceSpecies.map((name) => ({
    name,
    level,
    value: pokemonSalePrice(makeMon(name, level, name)),
  }));
  const average = sales.reduce((sum, mon) => sum + mon.value, 0) / sales.length;
  return {
    level,
    average: Number(average.toFixed(2)),
    tmsPerPokemon: Number((average / averageTm).toFixed(3)),
    sales,
  };
});
assert.ok(prices[1].tmsPerPokemon > 1.2 && prices[1].tmsPerPokemon < 1.4);

const combats = [];
for (const level of [45, 50]) {
  for (const [i, elite] of ELITES.entries()) {
    const state = initialState();
    state.run = {
      phase: "market",
      mode: "normal",
      moveLearningMode: "automatic",
      rng: 20261023 + i,
      seed: 20261023 + i,
      badges: 8,
      inLeague: false,
      leagueIndex: 0,
      league: [
        elite,
        ...ELITES.filter((candidate) => candidate !== elite).slice(0, 3),
        CHAMPIONS[0],
      ],
      week: 40,
      spent: 0,
      money: 0,
      marketPurchases: [],
      journal: [],
      pendingMoveChoices: [],
      pendingEvolutionChoices: [],
      party: [
        "Venusaur",
        "Charizard",
        "Blastoise",
        "Alakazam",
        "Gengar",
        "Dragonite",
      ].map((name, index) => makeMon(name, level, `p${index}`)),
      box: ["Arbok", "Pidgeot"].map((name, index) =>
        makeMon(name, level, `b${index}`),
      ),
    };
    let market = reducer(state, { type: "MARKET_SELL", monId: "b0" });
    market = reducer(market, { type: "MARKET_SELL", monId: "b1" });
    const proceeds = market.run.money;
    market = reducer(market, {
      type: "MARKET_BUY_TM",
      tmId: "earthquake",
      monId: "p1",
      forgetMoveId: market.run.party[1].moves[0],
    });
    market = reducer(market, {
      type: "MARKET_BUY_TM",
      tmId: "shadowball",
      monId: "p3",
      forgetMoveId: market.run.party[3].moves[0],
    });
    assert.deepEqual(market.run.marketPurchases, ["earthquake", "shadowball"]);
    const prepareBattle = (s) =>
      reducer(reducer(s, { type: "MARKET_LEAVE" }), { type: "CHALLENGE" });
    const before = prepareBattle(state),
      after = prepareBattle(market);
    assert.deepEqual(before.run.battle.seed, after.run.battle.seed);
    assert.deepEqual(before.run.battle.enemy, after.run.battle.enemy);
    const baseline = simulateCombat(before.run.battle),
      trained = simulateCombat(after.run.battle);
    assert.equal(baseline.censored || trained.censored, false);
    combats.push({
      level,
      elite: elite.name,
      proceeds,
      spent: 2400,
      remaining: market.run.money,
      baseline: {
        winner: baseline.snapshot.winner,
        turns: baseline.snapshot.turn,
        fainted: baseline.snapshot.player.filter((mon) => mon.fainted).length,
      },
      market: {
        winner: trained.snapshot.winner,
        turns: trained.snapshot.turn,
        fainted: trained.snapshot.player.filter((mon) => mon.fainted).length,
      },
    });
  }
}
const report = {
  method:
    "Economia com 12 espécies intermediárias evoluídas, níveis 35/45/55. Combates reais pareados contra os 11 membros da Elite na primeira posição, com os mesmos adversários e seeds, equipes de seis nos níveis 45/50 e duas reservas vendidas por Earthquake/Shadow Ball. Ambas as políticas usam a IA do jogo. Não é amostra de jogadores nem mede a chance de completar toda a Liga.",
  reference: MARKET_RULES,
  tmCount: MARKET_TMS.length,
  averageTm,
  prices,
  combatCount: combats.length * 2,
  combats,
  wins: {
    baseline: combats.filter((c) => c.baseline.winner === "Você").length,
    market: combats.filter((c) => c.market.winner === "Você").length,
  },
};
await mkdir("docs/balance/market-0.22.0", { recursive: true });
await writeFile(
  "docs/balance/market-0.22.0/economy-and-combat.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    prices: prices.map(({ sales, ...summary }) => summary),
    combatCount: report.combatCount,
    wins: report.wins,
  }),
);
