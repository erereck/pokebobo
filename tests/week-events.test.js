import test from "node:test";
import assert from "node:assert/strict";
import { WEEK_EVENTS } from "../src/game/data/weekEvents.js";
import {
  captureChanceForRun,
  maybeStartWeekEvent,
  weekEventView,
} from "../src/game/career/weekEvents.js";
import { reducer } from "../src/game/state/reducer.js";
import { drafted } from "./helpers/campaign.js";
import { ENCOUNTER_RULES } from "../src/game/config/encounters.js";

test("catálogo de semanas vivas é grande, único e sempre oferece decisão", () => {
  assert.ok(WEEK_EVENTS.length >= 50);
  assert.equal(new Set(WEEK_EVENTS.map((event) => event.id)).size, WEEK_EVENTS.length);
  for (const event of WEEK_EVENTS) {
    assert.ok(event.title);
    assert.ok(event.text);
    assert.ok(event.choices.length >= 2);
    assert.equal(
      new Set(event.choices.map((choice) => choice.id)).size,
      event.choices.length,
      event.id,
    );
  }
});

test("sorteio de acontecimento é determinístico para o mesmo estado e seed", () => {
  const a = drafted(20260918);
  a.run.weeklyEvents = true;
  a.run.lastEventWeek = null;
  const b = structuredClone(a);
  let startedA = false;
  let startedB = false;
  for (let i = 0; i < 8 && !startedA; i++) {
    startedA = maybeStartWeekEvent(a.run);
    startedB = maybeStartWeekEvent(b.run);
    assert.equal(startedA, startedB);
    assert.deepEqual(a.run.weekEvent, b.run.weekEvent);
    assert.equal(a.run.rng, b.run.rng);
  }
  assert.equal(startedA, true);
  assert.equal(a.run.phase, "event");
  assert.equal(weekEventView(a.run)?.id, a.run.weekEvent.id);
});

test("escolha de acontecimento aplica consequência, registra e volta à jornada", () => {
  let s = drafted(91);
  s.run.weeklyEvents = true;
  s.run.phase = "event";
  s.run.weekEvent = { id: "lost-bag", choices: ["return", "keep"] };
  s.run.lastEventWeek = s.run.week;
  s.run.lastAmbush = 999;
  s.run.spent = 1;
  const berries = s.run.berries;

  s = reducer(s, { type: "EVENT_CHOICE", choiceId: "return" });

  assert.equal(s.run.phase, "career");
  assert.equal(s.run.weekEvent, null);
  assert.equal(s.run.berries, berries + 1);
  assert.equal(s.run.eventFlags["honest-trainer"], true);
  assert.match(s.run.journal[0].text, /Mochila esquecida/);
});

test("acontecimento pode abrir batalha com recompensa pendente", () => {
  let s = drafted(92);
  s.run.weeklyEvents = true;
  s.run.phase = "event";
  s.run.weekEvent = { id: "veteran-spar", choices: ["battle", "talk"] };
  s.run.lastEventWeek = s.run.week;

  s = reducer(s, { type: "EVENT_CHOICE", choiceId: "battle" });

  assert.equal(s.run.phase, "battle");
  assert.equal(s.run.battle.kind, "ambush");
  assert.equal(s.run.pendingEventReward.balls, 2);
  assert.equal(s.run.pendingEventReward.teamLevels, 1);
});

test("bônus de treino é consumido uma vez pela próxima ação", () => {
  let s = drafted(93);
  s.run.eventBoosts = {
    capture: 0,
    training: 2,
    forage: 0,
    ambushShield: 0,
  };
  s.run.lastAmbush = 999;
  const level = s.run.party[0].level;

  s = reducer(s, { type: "TRAIN" });

  assert.ok(s.run.party[0].level >= level + 3);
  assert.ok(s.run.party[0].level <= level + 5);
  assert.equal(s.run.eventBoosts.training, 0);
});

test("bônus de captura aparece no cálculo e respeita o teto de 98%", () => {
  const s = drafted(94);
  s.run.eventBoosts = { capture: 0.08 };
  assert.equal(
    captureChanceForRun(s.run, ENCOUNTER_RULES.captureChance),
    0.94,
  );
  s.run.eventBoosts.capture = 0.5;
  assert.equal(
    captureChanceForRun(s.run, ENCOUNTER_RULES.captureChance),
    0.98,
  );
});

test("evento com ação extra devolve orçamento sem voltar a semana global", () => {
  let s = drafted(95);
  s.run.weeklyEvents = true;
  s.run.phase = "event";
  s.run.weekEvent = {
    id: "center-volunteers",
    choices: ["help", "supplies"],
  };
  s.run.lastEventWeek = s.run.week;
  s.run.lastAmbush = 999;
  s.run.spent = 2;
  const week = s.run.week;

  s = reducer(s, { type: "EVENT_CHOICE", choiceId: "help" });

  assert.equal(s.run.week, week);
  assert.equal(s.run.spent, 1);
  assert.equal(s.run.phase, "career");
});
