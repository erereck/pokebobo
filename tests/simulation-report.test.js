import test from "node:test";
import assert from "node:assert/strict";
import {
  summarizeCampaigns,
  breakdowns,
} from "../scripts/simulation/summarize.mjs";
import { levelGainLabel, levelGains } from "../src/game/selectors/levelGain.js";
test("relatório usa encontros como denominador e mantém censurados fora das derrotas", () => {
  const make = (won, censored, kind = "gym") => ({
    won,
    censored,
    badges: won ? 1 : 0,
    leagueWins: 0,
    starter: "Bulbasaur",
    party: [{ name: "Bulbasaur" }],
    battles: [
      {
        kind,
        name: "Brock",
        winner: won ? "Você" : "Brock",
        censored,
        turns: 2,
        playerMaxLevel: 12,
        partySize: 2,
      },
    ],
  });
  const rows = [make(true, false), make(false, false), make(false, true)];
  const totals = summarizeCampaigns(rows);
  assert.equal(totals.winRate, 50);
  assert.equal(totals.censored, 1);
  const result = breakdowns(rows).byOpponent[0];
  assert.equal(result.encounters, 3);
  assert.equal(result.completed, 2);
  assert.equal(result.playerDefeats, 1);
  assert.equal(result.defeatRate, 50);
  assert.equal(result.meanPartySize, 2);
  assert.equal(breakdowns(rows).byStarter[0].runs, 3);
});
test("emboscadas e Liga têm contagem de derrota separada dos ginásios", () => {
  const rows = [
    {
      won: false,
      censored: false,
      badges: 2,
      leagueWins: 0,
      party: [],
      battles: [{ kind: "ambush" }],
    },
    {
      won: false,
      censored: false,
      badges: 8,
      leagueWins: 4,
      party: [],
      battles: [{ kind: "league", leagueIndex: 5, playerMaxLevel: 64 }],
    },
  ];
  assert.deepEqual(summarizeCampaigns(rows).deaths, {
    "Emboscada · etapa 3": 1,
    "Liga 5": 1,
  });
  assert.equal(summarizeCampaigns([]).winRate, null);
});
test("rótulo de recompensa informa quantos integrantes realmente recebem níveis", () => {
  assert.equal(
    levelGainLabel(levelGains([{ level: 100 }, { level: 99 }], 1)),
    "+1 nível · 1/2 integrantes",
  );
  assert.equal(
    levelGainLabel(levelGains([{ level: 100 }], 1)),
    "Equipe no nível máximo",
  );
});
