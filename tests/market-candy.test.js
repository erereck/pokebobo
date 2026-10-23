import test from "node:test";
import assert from "node:assert/strict";
import { drafted } from "./helpers/campaign.js";
import { makeMon } from "../src/game/pokemon.js";
import { reducer } from "../src/game/engine.js";
import { MARKET_RARE_CANDY, MARKET_TMS } from "../src/game/config/market.js";
import { ELITES } from "../src/game/data/league/elites.js";
import { CHAMPIONS } from "../src/game/data/league/champions.js";
import { actionMoments } from "../src/features/moments/actionMoments.js";
import { parseSaveBackup } from "../src/game/persistence/importSave.js";
import catalog from "../src/game/catalog.json" with { type: "json" };

function market() {
  const state = drafted(811);
  Object.assign(state.run, {
    phase: "market",
    position: 9,
    badges: 8,
    inLeague: false,
    money: 1400,
    league: [...ELITES.slice(0, 4), CHAMPIONS[0]],
    party: [makeMon("Nidoking", 45, "party")],
    box: [makeMon("Charmeleon", 35, "reserve")],
    pendingMoveChoices: [],
    pendingEvolutionChoices: [],
    moveLearningMode: "automatic",
  });
  return state;
}

test("Rare Candy custa 0,7 TM média e concede um nível", () => {
  const average =
    MARKET_TMS.reduce((sum, tm) => sum + tm.price, 0) / MARKET_TMS.length;
  assert.equal(MARKET_RARE_CANDY.price / average, 0.7);
  assert.equal(MARKET_RARE_CANDY.levels, 1);
});

test("Rare Candy exige mercado aberto, saldo e alvo válidos antes de cobrar", () => {
  const state = market(),
    action = { type: "MARKET_BUY_CANDY", monId: "party" };
  assert.equal(reducer(state, { type: "MARKET_BUY_CANDY" }), state);
  assert.equal(reducer(state, { ...action, monId: "inexistente" }), state);
  state.run.money = 699;
  assert.equal(reducer(state, action), state);
  state.run.money = 700;
  state.run.phase = "career";
  assert.equal(reducer(state, action), state);
  state.run.phase = "market";
  state.run.inLeague = true;
  assert.equal(reducer(state, action), state);
});

test("compra repetível só aumenta o alvo e debita uma unidade por confirmação", () => {
  const state = market(),
    action = {
      type: "MARKET_BUY_CANDY",
      monId: "party",
      price: 0,
      levels: 100,
    };
  const next = reducer(state, action);
  assert.equal(next.run.party[0].level, 46);
  assert.equal(next.run.money, 700);
  assert.deepEqual(next.run.box, state.run.box);
  assert.deepEqual(next.run.marketPurchases, state.run.marketPurchases);
  assert.deepEqual(
    [next.run.rng, next.run.week, next.run.spent],
    [state.run.rng, state.run.week, state.run.spent],
  );
  const twice = reducer(next, action);
  assert.equal(twice.run.money, 0);
  assert.equal(twice.run.party[0].level, 47);
  assert.equal(reducer(twice, action), twice);
});

test("Rare Candy respeita o nível 100 e não cobra quando não há ganho", () => {
  const state = market();
  state.run.party[0] = makeMon("Nidoking", 99, "party");
  const next = reducer(state, { type: "MARKET_BUY_CANDY", monId: "party" });
  assert.equal(next.run.party[0].level, 100);
  assert.equal(next.run.money, 700);
  assert.equal(
    reducer(next, { type: "MARKET_BUY_CANDY", monId: "party" }),
    next,
  );
});

test("Rare Candy na reserva evolui, registra a conquista e preserva TM equipada", () => {
  const state = market();
  state.run.box[0].moves[0] = "protect";
  state.run.box[0].tmMoves = ["protect"];
  const action = { type: "MARKET_BUY_CANDY", monId: "reserve" };
  const next = reducer(state, action);
  assert.equal(next.run.box[0].name, "Charizard");
  assert.equal(next.run.box[0].level, 36);
  assert.ok(next.run.box[0].moves.includes("protect"));
  assert.deepEqual(next.run.party, state.run.party);
  assert.equal(actionMoments(state.run, next.run, action)[0].to, "Charizard");
  const restored = parseSaveBackup(JSON.stringify(next));
  assert.equal(restored.run.money, 700);
  assert.equal(restored.run.box[0].name, "Charizard");
  assert.deepEqual(restored.run.box[0].tmMoves, ["protect"]);
});

test("aprendizado manual após Rare Candy bloqueia outra compra até resolver", () => {
  const state = market();
  const learned = catalog.Nidoking.moves.find(
    (move) => move.level > 1 && move.level < 45,
  );
  state.run.party[0] = makeMon("Nidoking", learned.level - 1, "party");
  state.run.party[0].moves = [
    "tackle",
    "leer",
    "poisonsting",
    "focusenergy",
  ].filter((id) => id !== learned.id);
  while (state.run.party[0].moves.length < 4)
    state.run.party[0].moves.push("peck");
  state.run.moveLearningMode = "manual";
  const action = { type: "MARKET_BUY_CANDY", monId: "party" };
  const next = reducer(state, action);
  assert.equal(next.run.money, 700);
  assert.ok(
    next.run.pendingMoveChoices.some((choice) => choice.moveId === learned.id),
  );
  assert.equal(next.run.phase, "market");
  assert.equal(reducer(next, action), next);
  assert.equal(reducer(next, { type: "MARKET_LEAVE" }), next);
  const restored = parseSaveBackup(JSON.stringify(next));
  assert.equal(
    restored.run.pendingMoveChoices[0].moveId,
    next.run.pendingMoveChoices[0].moveId,
  );
});

test("evolução ramificada por Rare Candy mantém a decisão do treinador", () => {
  const state = market();
  state.run.party[0] = makeMon("Eevee", 29, "party");
  const next = reducer(state, { type: "MARKET_BUY_CANDY", monId: "party" });
  assert.equal(next.run.party[0].name, "Eevee");
  assert.equal(next.run.party[0].level, 30);
  assert.equal(next.run.pendingEvolutionChoices[0].monId, "party");
  assert.equal(reducer(next, { type: "MARKET_LEAVE" }), next);
});
