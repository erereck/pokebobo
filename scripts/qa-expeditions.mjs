// Playwright externo, sem dependência enviada ao jogo. QA só usa contextos
// privados com saves de teste, tanto no dev quanto no build /pokebobo/.
import { pathToFileURL } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { drafted, best } from "../tests/helpers/campaign.js";
import {
  expeditionState,
  expeditionPath,
  toGuardian,
} from "../tests/helpers/expeditions.js";
import { reducer } from "../src/game/engine.js";
import { makeMon } from "../src/game/pokemon.js";
import { restoreBattle } from "../src/game/battle/restore.js";

const pw = await import(
  process.env.PLAYWRIGHT_PATH
    ? pathToFileURL(process.env.PLAYWRIGHT_PATH).href
    : "playwright"
);
const engine = process.env.QA_ENGINE || "edge",
  url = process.env.QA_URL || "http://localhost:4173/";
const output = process.env.QA_OUTPUT || "docs/balance/expeditions-0.24.0",
  images = process.env.QA_IMAGES || "docs/images";
const widths = process.env.QA_WIDTHS?.split(",").map(Number);
const viewports = [
  { width: 1280, height: 800 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
  { width: 844, height: 375 },
].filter((v) => !widths || widths.includes(v.width));
await mkdir(output, { recursive: true });
await mkdir(images, { recursive: true });
const browser =
  engine === "webkit"
    ? await pw.webkit.launch({ headless: true })
    : await pw.chromium.launch({
        headless: true,
        ...(process.platform === "win32" ? { channel: "msedge" } : {}),
      });
const cases = [];
let currentPage;
async function open(state, viewport) {
  const context = await browser.newContext({
    viewport,
    isMobile: viewport.width < 900,
    hasTouch: viewport.width < 900,
    reducedMotion: "reduce",
    serviceWorkers: engine === "webkit" ? "block" : "allow",
  });
  await context.addInitScript((save) => {
    if (!localStorage.getItem("pokebobo.save.v1"))
      localStorage.setItem("pokebobo.save.v1", JSON.stringify(save));
  }, state);
  const page = await context.newPage(),
    errors = [];
  currentPage = page;
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  const read = () =>
    page.evaluate(() => JSON.parse(localStorage.getItem("pokebobo.save.v1")));
  return { context, page, read, errors };
}
async function check(page) {
  await page.waitForFunction(() =>
    [...document.images].every((i) => i.complete && i.naturalWidth),
  );
  const geometry = await page.evaluate(() =>
    [
      document.documentElement,
      document.querySelector(".play-main"),
      ...document.querySelectorAll("dialog[open]"),
    ]
      .filter(Boolean)
      .map((e) => ({
        element: e.tagName,
        width: e.clientWidth,
        scrollWidth: e.scrollWidth,
      })),
  );
  assert.ok(
    geometry.every((b) => b.scrollWidth <= b.width + 1),
    JSON.stringify(geometry),
  );
  return geometry;
}
async function shot(page, name, viewport) {
  if (engine === "edge" && [390, 844, 1280].includes(viewport.width))
    await page.screenshot({
      path: `${images}/expedicoes-0.24-${name}-${viewport.width}.png`,
    });
}
async function walk(page, read, target) {
  const r = (await read()).run,
    e = r.expeditions[r.activeExpedition];
  for (const { dx, dy } of expeditionPath(e, target)) {
    const before = (await read()).run.expeditions[r.activeExpedition].steps;
    await page.locator(".field-map").focus();
    await page.keyboard.press(
      dx === 1
        ? "ArrowRight"
        : dx === -1
          ? "ArrowLeft"
          : dy === 1
            ? "ArrowDown"
            : "ArrowUp",
    );
    try {
      await page.waitForFunction(
        ({ id, before }) => {
          const e = JSON.parse(localStorage.getItem("pokebobo.save.v1")).run
            .expeditions[id];
          const map = document.querySelector(".field-map");
          return (
            e.steps === before + 1 &&
            !e.walk &&
            Number(map?.dataset.fieldSteps) === e.steps &&
            map.dataset.fieldWalking === "false"
          );
        },
        { id: r.activeExpedition, before },
      );
    } catch (error) {
      console.log(
        JSON.stringify({
          before,
          dx,
          dy,
          snapshot: await read(),
          ui: await page
            .locator(".field-map")
            .evaluate((el) => ({
              steps: el.dataset.fieldSteps,
              walking: el.dataset.fieldWalking,
              focused: document.activeElement?.outerHTML,
              dialog: !!document.querySelector("dialog[open]"),
            })),
        }),
      );
      throw error;
    }
    // Gravação é anterior ao commit visual. A próxima tecla precisa observar
    // também o efeito de controles da renderização que concluiu este passo.
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
  }
}
async function fight(page, read) {
  let count = 0;
  while ((await read()).run.phase === "battle" && count++ < 100) {
    const battle = restoreBattle((await read()).run.battle),
      choice = best(battle);
    battle.destroy();
    const [kind, index] = choice.split(" ");
    const button =
      kind === "move"
        ? page.locator(`.move-button[data-move-index="${index}"]`)
        : page.locator(".switch-options button").nth(Number(index) - 1);
    await button.click();
    const skip = page.getByRole("button", {
      name: "Pular animação do turno",
      exact: true,
    });
    if (engine !== "webkit" && (await skip.isVisible())) {
      try {
        await skip.click({ timeout: 1200 });
      } catch (e) {
        if (await skip.isVisible()) throw e;
      }
    }
    await page.waitForFunction(() => !document.querySelector(".battle-skip"));
  }
  assert.equal((await read()).run.phase, "result");
  return count;
}
function fixture(id = "echo-cave") {
  const s = drafted(99);
  Object.assign(s.run, {
    position: id === "echo-cave" ? 4 : 7,
    badges: id === "echo-cave" ? 2 : 5,
    spent: 0,
    lastAmbush: 100,
    money: 0,
    moveLearningMode: "automatic",
    party: [makeMon(id === "sunken-ruins" ? "Houndoom" : "Garchomp", 80, "mon0"), makeMon("Blastoise", 45, "mon1")],
    heldItems: { leftovers: 1 },
  });
  return s;
}
try {
  for (const viewport of viewports) {
    console.log(`QA ${engine}: ${viewport.width}×${viewport.height}`);
    // Caminhada real pelas três salas, cancelamento/foco, reload, combate e tesouro.
    for (const id of ["echo-cave", "sunken-ruins"]) {
      const state = fixture(id),
        { context, page, read, errors } = await open(state, viewport);
      const entry = page
        .getByRole("button", { name: "Ver entrada", exact: true })
        .last();
      await entry.scrollIntoViewIfNeeded();
      await shot(page, "acesso", viewport);
      await entry.click();
      await check(page);
      await shot(page, "entrada", viewport);
      await page.keyboard.press("Escape");
      assert.equal(
        await entry.evaluate((e) => e === document.activeElement),
        true,
      );
      assert.equal((await read()).run.week, state.run.week);
      await entry.click();
      await page
        .getByRole("button", { name: "Entrar · 1 semana", exact: true })
        .click();
      assert.equal((await read()).run.week, state.run.week + 1);
      if (viewport.width === 1280)
        assert.ok(
          await page
            .locator(".expedition-interactions")
            .evaluate(
              (e) =>
                e.getBoundingClientRect().bottom <=
                document.querySelector(".play-main").getBoundingClientRect()
                  .bottom,
            ),
          "Comandos cabem no visor desktop",
        );
      const up = page.getByRole("button", {
        name: "Caminhar para cima",
        exact: true,
      });
      if (viewport.width < 900) await up.tap();
      else await up.click();
      await page.waitForFunction((id) => {
        const e = JSON.parse(localStorage.getItem("pokebobo.save.v1")).run
          .expeditions[id];
        return e.steps === 1 && !e.walk;
      }, id);
      for (let room = 0; room < 2; room++) {
        await walk(page, read, { x: 8, y: 3 });
        await page
          .getByRole("button", { name: "Examinar o baú", exact: true })
          .click();
        await check(page);
        await page
          .getByRole("button", {
            name: room ? "2 kits de berries" : "Guardar os achados",
            exact: true,
          })
          .click();
        await page.reload();
        const e = (await read()).run.expeditions[id];
        assert.ok(e.collected.includes(room));
        assert.equal(
          await page
            .getByRole("button", { name: "Achados guardados", exact: true })
            .isDisabled(),
          true,
        );
        await shot(page, `${id}-sala-${room + 1}`, viewport);
        await check(page);
        await walk(page, read, { x: 5, y: 1 });
        await page
          .getByRole("button", { name: "Próxima sala", exact: true })
          .click();
      }
      await walk(page, read, { x: 5, y: 3 });
      // Mesmo com risco à frente, permite administrar o que já está na mochila.
      await page.getByRole("button", { name: "Equipe", exact: true }).click();
      await page
        .getByRole("button", { name: "Equipamento", exact: true })
        .click();
      await page
        .locator(".equipment-choices button")
        .filter({ hasText: "Leftovers" })
        .click();
      await page
        .getByRole("button", { name: "Equipar Leftovers", exact: true })
        .click();
      assert.equal((await read()).run.party[0].item, "leftovers");
      await page.getByRole("button", { name: "Jornada", exact: true }).click();
      await page
        .getByRole("button", { name: "Ver desafio", exact: true })
        .click();
      await check(page);
      await shot(page, `${id}-guardiao`, viewport);
      await page
        .getByRole("button", { name: "Ainda não", exact: true })
        .click();
      assert.equal((await read()).run.phase, "expedition");
      await page
        .getByRole("button", { name: "Ver desafio", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Enfrentar o guardião", exact: true })
        .click();
      await page.reload();
      const turns = await fight(page, read);
      await page
        .getByRole("button", { name: "Continuar a jornada", exact: true })
        .click();
      await page.reload();
      assert.equal((await read()).run.expeditions[id].status, "won");
      await check(page);
      await shot(page, "tesouro", viewport);
      await page.locator(".expedition-treasures button").first().click();
      const reward = id === "echo-cave" ? "focussash" : "choicescarf";
      await page.reload();
      assert.equal((await read()).run.heldItems[reward], 1);
      assert.equal((await read()).run.money, id === "echo-cave" ? 400 : 600);
      assert.equal((await read()).run.week, state.run.week + 1);
      assert.equal((await read()).run.party[0].level, 80);
      await page
        .getByRole("button", { name: "Concluir a expedição", exact: true })
        .click();
      await page.reload();
      assert.equal((await read()).run.expeditions[id].status, "cleared");
      await check(page);
      assert.deepEqual(errors, []);
      cases.push({
        viewport,
        scenario: `três salas e guardião: ${id}`,
        flows: 21,
        turns,
        errors,
      });
      await context.close();
    }
    // A entrada do campo não cobra outra ação; sair conserva só o primeiro baú.
    {
      const state = reducer(fixture(), { type: "EXPLORE" });
      const { context, page, read, errors } = await open(state, viewport);
      await page
        .getByRole("button", { name: "Ver entrada", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Entrar · sem outra semana", exact: true })
        .click();
      assert.equal((await read()).run.week, state.run.week);
      await walk(page, read, { x: 8, y: 3 });
      await page
        .getByRole("button", { name: "Examinar o baú", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Guardar os achados", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Sair com os achados", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Continuar explorando", exact: true })
        .click();
      assert.equal((await read()).run.phase, "expedition");
      await page
        .getByRole("button", { name: "Sair com os achados", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Sair com meus achados", exact: true })
        .click();
      await page.reload();
      assert.equal(
        (await read()).run.expeditions["echo-cave"].status,
        "escaped",
      );
      assert.equal((await read()).run.money, 200);
      assert.equal((await read()).run.week, state.run.week);
      await page.getByRole("button", { name: "Mochila", exact: true }).click();
      assert.match(await page.locator(".expedition-wallet").innerText(), /200/);
      await check(page);
      assert.deepEqual(errors, []);
      cases.push({
        viewport,
        scenario: "campo, recuo, cancelamento, saldo e recarga",
        flows: 8,
        errors,
      });
      await context.close();
    }
    // A escolha de continuar na última semana retoma o ginásio uma única vez.
    {
      const state = expeditionState();
      state.run.spent = 3;
      const { context, page, read, errors } = await open(state, viewport);
      await page
        .getByRole("button", { name: "Sair com os achados", exact: true })
        .click();
      assert.match(await page.locator("dialog").innerText(), /Última semana/);
      await page
        .getByRole("button", { name: "Sair com meus achados", exact: true })
        .click();
      assert.equal((await read()).run.phase, "battle");
      assert.equal((await read()).run.battle.kind, "gym");
      await check(page);
      assert.deepEqual(errors, []);
      cases.push({
        viewport,
        scenario: "última semana e ginásio",
        flows: 3,
        errors,
      });
      await context.close();
    }
    // Derrota real mostra encerramento; nunca entrega o tesouro.
    {
      let state = toGuardian(expeditionState());
      state.run.party = [makeMon("Magikarp", 1, "mon0")];
      state = reducer(state, { type: "EXPEDITION_CHALLENGE" });
      const { context, page, read, errors } = await open(state, viewport);
      await fight(page, read);
      await page
        .getByRole("button", { name: "Registrar esta história", exact: true })
        .click();
      assert.equal((await read()).run.phase, "ended");
      assert.equal(
        (await read()).run.expeditions["echo-cave"].status,
        "defeated",
      );
      await check(page);
      assert.deepEqual(errors, []);
      cases.push({
        viewport,
        scenario: "derrota definitiva no guardião",
        flows: 3,
        errors,
      });
      await context.close();
    }
  }
  const report = {
    engine,
    url,
    method:
      "Contextos privados, setas reais, controles/diálogos e combates via UI. Equipe nível 80 verifica integração, não dificuldade. Emulação não substitui aparelho físico. WebKit Windows bloqueia service worker; não mede offline.",
    cases,
    totalFlows: cases.reduce((n, c) => n + c.flows, 0),
  };
  await writeFile(
    `${output}/browser-${engine}.json`,
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(
    JSON.stringify({
      engine,
      cases: cases.length,
      totalFlows: report.totalFlows,
    }),
  );
} catch (error) {
  if (currentPage && !currentPage.isClosed()) {
    await currentPage
      .screenshot({ path: `${output}/failure-${engine}.png` })
      .catch(() => {});
    const diagnostic = await currentPage
      .evaluate(() => ({
        text: document.body.innerText,
        save: JSON.parse(localStorage.getItem("pokebobo.save.v1")),
      }))
      .catch(() => null);
    await writeFile(
      `${output}/failure-${engine}.json`,
      JSON.stringify({ error: error.message, diagnostic }, null, 2),
    );
  }
  throw error;
} finally {
  await browser.close();
}
