import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { ORIGINS } from "../src/game/data/origins.js";
import { RIVALS } from "../src/game/data/rivals.js";
import { RIVAL_STAGES } from "../src/game/config/rival.js";
import { HELD_ITEMS } from "../src/game/config/equipment.js";
import { MARKET_TMS, MARKET_RARE_CANDY } from "../src/game/config/market.js";
import { rivalTeam, createRival } from "../src/game/rival/rival.js";
import { grow } from "../src/game/pokemon/evolution.js";
import { movesFor } from "../src/game/pokemon/moves.js";
import { makeMon } from "../src/game/pokemon/createPokemon.js";
import { initialState, reducer } from "../src/game/engine.js";
import { ELITES } from "../src/game/data/league/elites.js";
import { CHAMPIONS } from "../src/game/data/league/champions.js";
import { pokemonSalePrice } from "../src/game/market/market.js";
import { simulateCombat } from "./simulation/runCampaign.mjs";

const summary = ({ snapshot, censored }) => ({
  winner: snapshot.winner,
  turns: snapshot.turn,
  fainted: snapshot.player.filter((mon) => mon.fainted).length,
  censored,
});
const evolved = (name, level, id) => {
  const mon = grow(makeMon(name, 1, id), level - 1);
  return { ...mon, moves: movesFor(mon.name, level) };
};
const duels = [];
for (const [originIndex, origin] of ORIGINS.entries())
  for (const profile of RIVALS)
    for (const stage of RIVAL_STAGES)
      for (const offset of [-2, 2]) {
        const run = { route: [origin], seed: 20261024 + originIndex };
        run.rival = {
          ...createRival(run, origin.starters[0]),
          profile: profile.id,
        };
        const roots = [
          origin.starters[0],
          "Pidgey",
          "Geodude",
          "Abra",
          "Gastly",
        ].slice(0, stage.size + 1);
        const spec = {
          name: `Rival ${profile.name}`,
          seed: [17, 43, 98, originIndex + 1],
          player: roots.map((name, index) =>
            evolved(name, stage.level + offset, `p${index}`),
          ),
          enemy: rivalTeam(run, stage),
          choices: [],
        };
        const combat = simulateCombat(spec, 240);
        duels.push({
          origin: origin.id,
          playerStarter: origin.starters[0],
          profile: profile.id,
          badges: stage.badges,
          playerLevel: stage.level + offset,
          playerSize: spec.player.length,
          enemyLevels: spec.enemy.map((mon) => mon.level),
          enemySize: spec.enemy.length,
          ...summary(combat),
        });
      }

const gearCombats = [];
for (const level of [45, 50])
  for (const [index, elite] of ELITES.entries()) {
    const state = initialState();
    state.run = {
      phase: "market",
      badges: 8,
      inLeague: false,
      leagueIndex: 0,
      league: [
        elite,
        ...ELITES.filter((t) => t !== elite).slice(0, 3),
        CHAMPIONS[0],
      ],
      rng: 20261024 + index,
      seed: 20261024 + index,
      week: 40,
      spent: 0,
      money: 0,
      marketPurchases: [],
      heldItems: {},
      journal: [],
      pendingMoveChoices: [],
      pendingEvolutionChoices: [],
      moveLearningMode: "automatic",
      party: [
        "Venusaur",
        "Charizard",
        "Blastoise",
        "Alakazam",
        "Gengar",
        "Dragonite",
      ].map((name, i) => makeMon(name, level, `p${i}`)),
      box: ["Arbok", "Pidgeot", "Golduck"].map((name, i) =>
        makeMon(name, level, `b${i}`),
      ),
    };
    let market = state;
    for (let i = 0; i < 3; i++)
      market = reducer(market, { type: "MARKET_SELL", monId: `b${i}` });
    const proceeds = market.run.money;
    for (const [itemId, monId] of [
      ["leftovers", "p2"],
      ["focussash", "p3"],
      ["choicescarf", "p5"],
    ])
      market = reducer(market, { type: "MARKET_BUY_ITEM", itemId, monId });
    const spent = HELD_ITEMS.reduce((sum, item) => sum + item.price, 0);
    assert.equal(market.run.money, proceeds - spent);
    assert.equal(market.run.marketPurchases.length, 3);
    const begin = (s) =>
      reducer(reducer(s, { type: "MARKET_LEAVE" }), { type: "CHALLENGE" }).run
        .battle;
    const baseSpec = begin(state),
      equippedSpec = begin(market);
    assert.deepEqual(baseSpec.seed, equippedSpec.seed);
    assert.deepEqual(baseSpec.enemy, equippedSpec.enemy);
    const baseline = simulateCombat(baseSpec),
      equipped = simulateCombat(equippedSpec);
    gearCombats.push({
      level,
      elite: elite.name,
      proceeds,
      spent,
      remaining: market.run.money,
      baseline: summary(baseline),
      equipped: summary(equipped),
      finalItems: equipped.snapshot.player.map(({ id, item }) => ({
        id,
        item,
      })),
    });
  }

const reference = [
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
const averageTm =
  MARKET_TMS.reduce((sum, tm) => sum + tm.price, 0) / MARKET_TMS.length;
const averageSale =
  reference.reduce(
    (sum, name) => sum + pokemonSalePrice(makeMon(name, 45, name)),
    0,
  ) / reference.length;
const report = {
  method:
    "Combates reais, com a mesma IA observadora nos dois lados. 126 duelos opcionais: sete origens, primeiro inicial, três perfis, três marcos e equipes de 3/4/5 nos níveis de referência -2/+2. Elite: 22 pares com mesmos inimigos/seeds, equipe fixa de seis nos níveis 45/50, sem itens versus três equipamentos comprados após vender três reservas. Não representa pessoas, uma campanha completa ou o efeito isolado de cada item. Nenhuma regra foi calibrada automaticamente pelos resultados.",
  economy: {
    averageTm,
    averageSale,
    tmsPerPokemon: averageSale / averageTm,
    rareCandy: MARKET_RARE_CANDY.price,
    candyPerAverageTm: MARKET_RARE_CANDY.price / averageTm,
    equipmentPrices: HELD_ITEMS.map(({ id, price }) => ({ id, price })),
  },
  duels,
  gearCombats,
  totals: {
    duelCombats: duels.length,
    gearCombats: gearCombats.length * 2,
    duelWins: duels.filter((r) => r.winner === "Você").length,
    baselineEliteWins: gearCombats.filter((r) => r.baseline.winner === "Você")
      .length,
    equippedEliteWins: gearCombats.filter((r) => r.equipped.winner === "Você")
      .length,
    censored:
      duels.filter((r) => r.censored).length +
      gearCombats.filter((r) => r.baseline.censored || r.equipped.censored)
        .length,
  },
};
assert.ok(
  report.economy.tmsPerPokemon > 1.2 && report.economy.tmsPerPokemon < 1.4,
);
assert.equal(report.economy.candyPerAverageTm, 0.7);
await mkdir("docs/balance/companions-0.23.0", { recursive: true });
await writeFile(
  "docs/balance/companions-0.23.0/economy-and-combat.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify({ economy: report.economy, totals: report.totals }, null, 2),
);
assert.equal(
  report.totals.censored,
  0,
  "Investigar duelos ou pares sem conclusão antes de entregar.",
);
