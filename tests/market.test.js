import test from "node:test";
import assert from "node:assert/strict";
import { drafted } from "./helpers/campaign.js";
import { reducer } from "../src/game/engine.js";
import { makeMon } from "../src/game/pokemon.js";
import { MARKET_TMS } from "../src/game/config/market.js";
import { pokemonSalePrice, tmEligibility } from "../src/game/market/market.js";
import { growWithLearning } from "../src/game/pokemon/moveLearning.js";
import { parseSaveBackup } from "../src/game/persistence/importSave.js";
import { ELITES } from "../src/game/data/league/elites.js";
import { CHAMPIONS } from "../src/game/data/league/champions.js";

function market() {
  const state = drafted(811);
  Object.assign(state.run, {
    position: 9,
    badges: 8,
    phase: "market",
    inLeague: false,
    party: [makeMon("Nidoking", 45, "buyer"), makeMon("Pidgeot", 45, "sale")],
    box: [makeMon("Arbok", 45, "reserve")],
    league: [...ELITES.slice(0, 4), CHAMPIONS[0]],
    pendingEvolutionChoices: [],
    pendingMoveChoices: [],
  });
  return state;
}

test("venda valoriza nível e força da espécie, sem bônus de cor ou golpes comprados", () => {
  assert.ok(
    pokemonSalePrice(makeMon("Dragonite", 45, "a")) >
      pokemonSalePrice(makeMon("Pidgeot", 45, "b")),
  );
  assert.ok(
    pokemonSalePrice(makeMon("Pidgeot", 55, "a")) >
      pokemonSalePrice(makeMon("Pidgeot", 35, "b")),
  );
  const mon = makeMon("Pidgeot", 45, "a");
  assert.equal(
    pokemonSalePrice({ ...mon, shiny: true, tmMoves: ["protect"] }),
    pokemonSalePrice(mon),
  );
  assert.equal(pokemonSalePrice({ name: "Inexistente", level: 45 }), 0);
});

test("Pokémon intermediários no nível 45 rendem aproximadamente 1,3 TMs médias", () => {
  const names = [
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
  const averagePrice =
    MARKET_TMS.reduce((sum, tm) => sum + tm.price, 0) / MARKET_TMS.length;
  const averageSale =
    names.reduce(
      (sum, name) => sum + pokemonSalePrice(makeMon(name, 45, name)),
      0,
    ) / names.length;
  assert.equal(averagePrice, 1000);
  assert.ok(
    averageSale / averagePrice > 1.2 && averageSale / averagePrice < 1.4,
  );
});

test("vende equipe/reserva uma vez, mantém Pokédex, não gasta semana ou RNG", () => {
  const state = market();
  const { rng, week, spent } = state.run;
  state.run.collection = [{ species: "Arbok" }];
  const next = reducer(state, { type: "MARKET_SELL", monId: "reserve" });
  assert.equal(next.run.money, pokemonSalePrice(state.run.box[0]));
  assert.equal(next.run.box.length, 0);
  assert.deepEqual(next.run.collection, state.run.collection);
  assert.deepEqual(
    [next.run.rng, next.run.week, next.run.spent],
    [rng, week, spent],
  );
  assert.equal(reducer(next, { type: "MARKET_SELL", monId: "reserve" }), next);
  const last = reducer(next, { type: "MARKET_SELL", monId: "sale" });
  assert.equal(reducer(last, { type: "MARKET_SELL", monId: "buyer" }), last);
});

test("compra só conclui com dinheiro, alvo compatível e substituição válida", () => {
  const state = market();
  const buy = {
    type: "MARKET_BUY_TM",
    tmId: "icebeam",
    monId: "buyer",
    forgetMoveId: state.run.party[0].moves[0],
  };
  assert.equal(reducer(state, buy), state);
  state.run.money = 2000;
  for (const action of [
    { ...buy, monId: undefined },
    { ...buy, monId: "sale" },
    { ...buy, forgetMoveId: undefined },
    { ...buy, forgetMoveId: "fake" },
    { ...buy, tmId: "fake" },
  ])
    assert.equal(reducer(state, action), state);
  const next = reducer(state, buy);
  assert.equal(next.run.money, 800);
  assert.ok(next.run.party[0].moves.includes("icebeam"));
  assert.deepEqual(next.run.party[0].tmMoves, ["icebeam"]);
  assert.deepEqual(next.run.marketPurchases, ["icebeam"]);
  assert.equal(next.run.rng, state.run.rng);
  assert.equal(next.run.party[0].moves.length, 4);
  next.run.money = 5000;
  assert.equal(reducer(next, buy), next);
});

test("compatibilidade inclui máquinas herdadas e formas regionais; conhecidos ficam bloqueados", () => {
  for (const name of ["Nidoking", "Nidoqueen", "Blastoise", "Mew"])
    assert.equal(
      tmEligibility(makeMon(name, 45, name), "icebeam"),
      "Pode aprender",
    );
  assert.equal(
    tmEligibility(makeMon("Magikarp", 45, "a"), "icebeam"),
    "Não compatível",
  );
  assert.equal(
    tmEligibility({ name: "Raichu-Alola", moves: [] }, "psychic"),
    "Pode aprender",
  );
  assert.equal(
    tmEligibility({ name: "Nidoking", moves: ["icebeam"] }, "icebeam"),
    "Já conhece este golpe",
  );
});

test("TM pode ser aplicada na reserva e numa vaga livre", () => {
  const state = market();
  state.run.money = 2000;
  state.run.box = [makeMon("Blastoise", 45, "reserve")];
  state.run.box[0].moves = ["tackle"];
  const next = reducer(state, {
    type: "MARKET_BUY_TM",
    tmId: "icebeam",
    monId: "reserve",
  });
  assert.deepEqual(next.run.box[0].moves, ["tackle", "icebeam"]);
  assert.equal(next.run.money, 800);
});

test("TM persiste com crescimento automático, evolução e escolhas manuais", () => {
  const state = market();
  state.run.money = 2000;
  const bought = reducer(state, {
    type: "MARKET_BUY_TM",
    tmId: "icebeam",
    monId: "buyer",
    forgetMoveId: state.run.party[0].moves[0],
  });
  bought.run.moveLearningMode = "automatic";
  const grown = growWithLearning(bought.run, bought.run.party[0], 5);
  assert.ok(grown.moves.includes("icebeam"));
  assert.equal(grown.moves.length, 4);
  const evolving = {
    ...makeMon("Nidorino", 29, "evo"),
    tmMoves: ["icebeam"],
    moves: ["icebeam", "tackle"],
  };
  const evolved = growWithLearning(bought.run, evolving, 1);
  assert.equal(evolved.name, "Nidoking");
  assert.ok(evolved.moves.includes("icebeam"));
  bought.run.moveLearningMode = "manual";
  bought.run.pendingMoveChoices = [
    { monId: "buyer", species: "Nidoking", moveId: "tackle" },
  ];
  const forgotten = reducer(bought, {
    type: "MOVE_CHOICE",
    monId: "buyer",
    forgetMoveId: "icebeam",
  });
  assert.equal(forgotten.run.party[0].moves.includes("icebeam"), false);
  assert.deepEqual(forgotten.run.party[0].tmMoves, []);
});

test("mercado permite organizar equipe; partida só sai por MARKET_LEAVE e não reabre", () => {
  const state = market();
  for (const type of ["CHALLENGE", "TRAIN", "EXPLORE", "FORAGE", "PREPARE"])
    assert.equal(reducer(state, { type }), state);
  const managed = reducer(state, {
    type: "BOX_SWAP",
    partyId: "sale",
    boxId: "reserve",
  });
  assert.equal(managed.run.party[1].id, "reserve");
  const left = reducer(managed, { type: "MARKET_LEAVE" });
  assert.equal(left.run.phase, "career");
  assert.equal(left.run.inLeague, true);
  for (const type of ["MARKET_SELL", "MARKET_BUY_TM", "MARKET_LEAVE"])
    assert.equal(
      reducer(left, { type, monId: "buyer", tmId: "icebeam" }),
      left,
    );
  const battle = reducer(left, { type: "CHALLENGE" });
  assert.equal(battle.run.battle.kind, "league");
});

test("decisões de aprendizado do oitavo ginásio bloqueiam negociações e saída", () => {
  const state = market();
  state.run.pendingMoveChoices = [
    { monId: "buyer", species: "Nidoking", moveId: "tackle" },
  ];
  assert.equal(reducer(state, { type: "MARKET_LEAVE" }), state);
  assert.equal(reducer(state, { type: "MARKET_SELL", monId: "sale" }), state);
});

test("exportação e restauração preservam fase, dinheiro, estoque e TM equipada", () => {
  const state = market();
  state.run.money = 2000;
  const next = reducer(state, {
    type: "MARKET_BUY_TM",
    tmId: "icebeam",
    monId: "buyer",
    forgetMoveId: state.run.party[0].moves[0],
  });
  const restored = parseSaveBackup(JSON.stringify(next));
  assert.equal(restored.run.phase, "market");
  assert.equal(restored.run.money, 800);
  assert.deepEqual(restored.run.marketPurchases, ["icebeam"]);
  assert.deepEqual(restored.run.party[0].tmMoves, ["icebeam"]);
  assert.ok(restored.run.party[0].moves.includes("icebeam"));
});
