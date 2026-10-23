import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { initialState, reducer } from "../src/game/engine.js";
import { makeMon } from "../src/game/pokemon.js";
import { MARKET_RARE_CANDY, MARKET_TMS } from "../src/game/config/market.js";
import { ELITES } from "../src/game/data/league/elites.js";
import { CHAMPIONS } from "../src/game/data/league/champions.js";
import { simulateCombat } from "./simulation/runCampaign.mjs";

const averageTm =
  MARKET_TMS.reduce((sum, tm) => sum + tm.price, 0) / MARKET_TMS.length;
assert.equal(MARKET_RARE_CANDY.price / averageTm, 0.7);
const combats = [];
for (const level of [45, 50]) {
  for (const [index, elite] of ELITES.entries()) {
    const state = initialState();
    state.run = {
      phase: "market",
      mode: "normal",
      moveLearningMode: "automatic",
      rng: 20261023 + index,
      seed: 20261023 + index,
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
      ].map((name, i) => makeMon(name, level, `p${i}`)),
      box: ["Arbok", "Pidgeot"].map((name, i) => makeMon(name, level, `b${i}`)),
    };
    let bought = reducer(state, { type: "MARKET_SELL", monId: "b0" });
    bought = reducer(bought, { type: "MARKET_SELL", monId: "b1" });
    const proceeds = bought.run.money;
    for (const monId of ["p0", "p1", "p2"])
      bought = reducer(bought, { type: "MARKET_BUY_CANDY", monId });
    assert.deepEqual(
      bought.run.party.map((mon) => mon.level),
      [level + 1, level + 1, level + 1, level, level, level],
    );
    assert.equal(proceeds - bought.run.money, MARKET_RARE_CANDY.price * 3);
    const prepare = (s) =>
      reducer(reducer(s, { type: "MARKET_LEAVE" }), { type: "CHALLENGE" });
    const baseline = prepare(state),
      candy = prepare(bought);
    assert.deepEqual(baseline.run.battle.seed, candy.run.battle.seed);
    assert.deepEqual(baseline.run.battle.enemy, candy.run.battle.enemy);
    const before = simulateCombat(baseline.run.battle),
      after = simulateCombat(candy.run.battle);
    assert.equal(before.censored || after.censored, false);
    combats.push({
      level,
      elite: elite.name,
      proceeds,
      spent: MARKET_RARE_CANDY.price * 3,
      remaining: bought.run.money,
      before: { winner: before.snapshot.winner, turns: before.snapshot.turn },
      candy: { winner: after.snapshot.winner, turns: after.snapshot.turn },
    });
  }
}
const report = {
  method:
    "22 pares de combates reais contra os 11 membros possíveis da Elite na primeira posição, níveis 45/50, mesma seed/adversário. Equipe fixa de seis: antes sem compras; depois vende duas reservas e compra três Rare Candy, um em cada inicial. Ambas as políticas usam a IA do jogo. Não mede dificuldade humana nem chance de completar a Liga.",
  rareCandy: MARKET_RARE_CANDY,
  averageTm,
  tmRatio: MARKET_RARE_CANDY.price / averageTm,
  combatCount: combats.length * 2,
  wins: {
    before: combats.filter((c) => c.before.winner === "Você").length,
    candy: combats.filter((c) => c.candy.winner === "Você").length,
  },
  combats,
};
await mkdir("docs/balance/rare-candy-0.22.1", { recursive: true });
await writeFile(
  "docs/balance/rare-candy-0.22.1/economy-and-combat.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    price: MARKET_RARE_CANDY.price,
    tmRatio: report.tmRatio,
    combatCount: report.combatCount,
    wins: report.wins,
  }),
);
