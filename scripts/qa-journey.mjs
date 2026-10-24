// Playwright é ferramenta externa de QA, não dependência enviada ao jogo.
// PLAYWRIGHT_PATH pode apontar ao index.mjs do runtime de desenvolvimento.
import { pathToFileURL } from "node:url";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { drafted, best } from "../tests/helpers/campaign.js";
import { makeMon } from "../src/game/pokemon.js";
import { restoreBattle } from "../src/game/battle/restore.js";
import { ELITES } from "../src/game/data/league/elites.js";
import { CHAMPIONS } from "../src/game/data/league/champions.js";

const pw = await import(
  process.env.PLAYWRIGHT_PATH
    ? pathToFileURL(process.env.PLAYWRIGHT_PATH).href
    : "playwright"
);
const engine = process.env.QA_ENGINE || "edge";
const url = process.env.QA_URL || "http://localhost:4173/";
const output = process.env.QA_OUTPUT || "docs/balance/companions-0.23.0";
const images = process.env.QA_IMAGES || "docs/images";
const widths = process.env.QA_WIDTHS?.split(",").map(Number);
const viewports = [
  { width: 1280, height: 800 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
  { width: 844, height: 375 },
].filter((v) => !widths || widths.includes(v.width));
assert.ok(viewports.length > 0, "Escolha pelo menos um dos visores de QA.");
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

function fixture(phase = "career") {
  const s = drafted(99);
  Object.assign(s.run, {
    phase,
    badges: phase === "market" ? 8 : 2,
    position: phase === "market" ? 9 : 4,
    spent: 0,
    lastAmbush: 100,
    money: 5000,
    heldItems: { focussash: 1 },
    party: [makeMon("Garchomp", 100, "mon0"), makeMon("Blastoise", 45, "mon1")],
    box: [makeMon("Charmeleon", 35, "mon2")],
    league: [...ELITES.slice(0, 4), CHAMPIONS[0]],
    pendingMoveChoices: [],
    pendingEvolutionChoices: [],
    moveLearningMode: "automatic",
    notice: "Prepare sua equipe para a próxima parada.",
  });
  return s;
}
async function open(state, viewport) {
  const context = await browser.newContext({
    viewport,
    isMobile: viewport.width < 900,
    hasTouch: viewport.width < 900,
    reducedMotion: "reduce",
    acceptDownloads: true,
    // O WebKit de teste no Windows não valida o worker desta hospedagem.
    // Esta matriz cobre UI; offline/worker permanece habilitado no Edge.
    serviceWorkers: engine === "webkit" ? "block" : "allow",
  });
  await context.addInitScript((save) => {
    if (!localStorage.getItem("pokebobo.save.v1"))
      localStorage.setItem("pokebobo.save.v1", JSON.stringify(save));
  }, state);
  const page = await context.newPage(),
    errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  const read = () =>
    page.evaluate(() => {
      const save = JSON.parse(localStorage.getItem("pokebobo.save.v1"));
      // Hall compartilhado fica em chave própria; o slot não duplica o arquivo.
      save.meta.history = JSON.parse(
        localStorage.getItem("pokebobo.hall.v1") || "[]",
      );
      return save;
    });
  return { context, page, errors, read };
}
async function check(page) {
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll("img")].every(
        (img) => img.complete && img.naturalWidth,
      ),
    { timeout: 15000 },
  );
  const geometry = await page.evaluate(() => {
    const boxes = [
      document.documentElement,
      document.querySelector(".play-main"),
      ...document.querySelectorAll("dialog[open]"),
    ]
      .filter(Boolean)
      .map((el) => ({
        element: el.tagName,
        width: el.clientWidth,
        scrollWidth: el.scrollWidth,
      }));
    return {
      boxes,
      broken: [...document.querySelectorAll("img")]
        .filter((img) => !img.naturalWidth)
        .map((img) => img.src),
    };
  });
  assert.ok(
    geometry.boxes.every((box) => box.scrollWidth <= box.width + 1),
    JSON.stringify(geometry),
  );
  assert.deepEqual(geometry.broken, []);
  return geometry;
}
async function shot(page, name, viewport) {
  if (engine === "edge" && [1280, 390].includes(viewport.width))
    await page.screenshot({
      path: `${images}/companheiros-0.23-${name}-${viewport.width}.png`,
    });
}
async function fight(page, read, planned = []) {
  let count = 0;
  while ((await read()).run.phase === "battle" && count++ < 100) {
    const b = restoreBattle((await read()).run.battle);
    let choice;
    try {
      choice = planned[count - 1] || best(b);
    } finally {
      b.destroy();
    }
    const [kind, index] = choice.split(" ");
    const button =
      kind === "move"
        ? page.locator(`.move-button[data-move-index="${index}"]`)
        : page.locator(".switch-options button").nth(Number(index) - 1);
    await button.waitFor();
    await button.click();
    const skip = page.getByRole("button", {
      name: "Pular animação do turno",
      exact: true,
    });
    if (engine !== "webkit" && (await skip.isVisible())) {
      try {
        await skip.click({ timeout: 1200 });
      } catch (error) {
        // Movimento reduzido pode concluir o turno entre observar e clicar.
        // Só aceite o desaparecimento; um controle ainda visível deve falhar.
        if (await skip.isVisible()) {
          console.log(
            await page.evaluate(() => ({
              viewport: [innerWidth, innerHeight],
              skip: document
                .querySelector(".battle-skip")
                ?.getBoundingClientRect()
                .toJSON(),
              activeAnimations: document.getAnimations().map((a) => ({
                state: a.playState,
                current: a.currentTime,
                target: a.effect?.target?.className,
              })),
              text: document.querySelector(".battle-comment")?.textContent,
              reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
            })),
          );
          await page.screenshot({
            path: `${output}/skip-failure-${engine}.png`,
          });
          throw error;
        }
      }
    }
    await page.waitForFunction(() => !document.querySelector(".battle-skip"));
  }
  assert.equal((await read()).run.phase, "result");
  await page
    .getByRole("button", { name: "Continuar a jornada", exact: true })
    .click();
  return count;
}
async function endJourney(page) {
  await page
    .getByRole("button", { name: "Opções e progresso", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Encerrar esta run", exact: true })
    .click();
  await page.getByRole("button", { name: "Encerrar run", exact: true }).click();
  try {
    await page.waitForFunction(
      () =>
        JSON.parse(localStorage.getItem("pokebobo.save.v1")).run.phase ===
        "ended",
      null,
      { timeout: 5000 },
    );
  } catch (error) {
    console.log(await page.locator("body").innerText());
    console.log(
      await page.evaluate(() =>
        JSON.parse(localStorage.getItem("pokebobo.save.v1")),
      ),
    );
    throw error;
  }
}

try {
  for (const viewport of viewports) {
    // Escolha do personagem na partida pronta, sem outro sorteio.
    {
      const state = drafted(99);
      state.run.phase = "ready";
      const { context, page, errors, read } = await open(state, viewport);
      await page
        .getByRole("button", { name: /Lia Joga com paciência/ })
        .click();
      assert.equal((await read()).run.rival.profile, "lia");
      assert.equal((await read()).run.rng, state.run.rng);
      await shot(page, "partida", viewport);
      const geometry = await check(page);
      await page
        .getByRole("button", { name: "Colocar o pé na estrada", exact: true })
        .click();
      assert.equal((await read()).run.phase, "career");
      await page.reload();
      assert.equal((await read()).run.rival.profile, "lia");
      assert.deepEqual(errors, []);
      cases.push({
        viewport,
        scenario: "escolha do rival",
        flows: 3,
        geometry,
        errors,
      });
      await context.close();
    }
    // Revanche real, apelido, equipamento, reserva, berries e Hall/cartão.
    {
      const state = fixture();
      const { context, page, errors, read } = await open(state, viewport);
      const trigger = page.getByRole("button", {
        name: "Ver revanche",
        exact: true,
      });
      await trigger.click();
      await shot(page, "rival", viewport);
      await check(page);
      await page.keyboard.press("Escape");
      await page.waitForFunction(() =>
        document.activeElement?.matches(".rival-card > button"),
      );
      assert.equal(
        await trigger.evaluate((el) => document.activeElement === el),
        true,
      );
      assert.equal((await read()).run.rng, state.run.rng);
      assert.equal((await read()).run.week, state.run.week);
      await trigger.click();
      await page
        .getByRole("button", { name: "Enfrentar Nico", exact: true })
        .click();
      await page.getByRole("button", { name: "Equipe", exact: true }).click();
      assert.equal(
        await page
          .getByRole("button", { name: "Equipamento", exact: true })
          .isEnabled(),
        false,
      );
      await page.getByRole("button", { name: "Batalha", exact: true }).click();
      const commands = await fight(page, read);
      let saved = await read();
      assert.equal(saved.run.phase, "career");
      assert.equal(saved.run.heldItems.leftovers, 1);
      assert.equal(saved.run.heroRecords.mon0.knockouts, 2);
      assert.equal(saved.run.rival.memories[0].name, "Garchomp");
      await page.reload();
      saved = await read();
      assert.equal(saved.run.heldItems.leftovers, 1);
      assert.equal(saved.run.heroRecords.mon0.battles, 1);
      assert.equal(
        await page
          .getByRole("button", { name: "Ver revanche", exact: true })
          .count(),
        0,
      );
      await page.getByRole("button", { name: "Equipe", exact: true }).click();
      await page.getByRole("button", { name: "Apelido", exact: true }).click();
      await page.getByRole("textbox").pressSequentially("Garra Azul");
      await page
        .getByRole("button", { name: "Salvar apelido", exact: true })
        .click();
      assert.equal(
        await page
          .getByRole("heading", { name: "Garra Azul", exact: true })
          .count(),
        1,
      );
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
      assert.equal((await read()).run.heldItems.leftovers, 0);
      await page.locator(".pokemon-feats").scrollIntoViewIfNeeded();
      await shot(page, "ficha", viewport);
      await check(page);
      await page
        .getByRole("button", { name: "Equipamento", exact: true })
        .click();
      await page
        .locator(".equipment-choices button")
        .filter({ hasText: "Focus Sash" })
        .click();
      await page
        .getByRole("button", { name: "Equipar Focus Sash", exact: true })
        .click();
      assert.equal((await read()).run.heldItems.leftovers, 1);
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
      await page.getByRole("button", { name: /^Reserva ·/ }).click();
      await page
        .getByRole("button", {
          name: "Mandar Garra Azul para a reserva",
          exact: true,
        })
        .click();
      assert.equal(
        (await read()).run.box.find((mon) => mon.id === "mon0").item,
        "leftovers",
      );
      await page
        .locator(".reserve-card")
        .filter({ hasText: "Garra Azul" })
        .getByRole("button", { name: "Trazer", exact: true })
        .click();
      await page.getByRole("button", { name: "Mochila", exact: true }).click();
      await page
        .getByRole("button", { name: "Preparar · 1 semana", exact: true })
        .click();
      saved = await read();
      assert.equal(
        saved.run.party.find((mon) => mon.id === "mon0").item,
        "leftovers",
      );
      assert.equal(
        saved.run.party.find((mon) => mon.id === "mon1").item,
        "Sitrus Berry",
      );
      assert.equal(saved.run.week, state.run.week + 1);
      await endJourney(page);
      assert.equal((await read()).meta.history[0].hero.nickname, "Garra Azul");
      await page
        .getByRole("button", { name: "Ver Hall da Fama", exact: true })
        .click();
      const hall = page.getByRole("dialog", {
        name: "Hall da Fama",
        exact: true,
      });
      assert.match(
        await hall.locator(".journey-hero").innerText(),
        /Garra Azul/,
      );
      await hall.locator(".journey-hero").scrollIntoViewIfNeeded();
      await shot(page, "hall", viewport);
      await check(page);
      await hall
        .getByRole("button", { name: "Compartilhar jornada", exact: true })
        .click();
      const downloadButton = page.getByRole("button", {
        name: "Baixar cartão PNG",
        exact: true,
      });
      await downloadButton.waitFor();
      const downloadPromise = page.waitForEvent("download");
      await downloadButton.click();
      const download = await downloadPromise;
      const bytes = await readFile(await download.path());
      assert.ok(bytes.byteLength > 10000);
      assert.equal(bytes.readUInt32BE(16), 1080);
      assert.equal(bytes.readUInt32BE(20), 1350);
      if (engine === "edge" && viewport.width === 390)
        await download.saveAs(`${images}/companheiros-0.23-cartao.png`);
      const cardHash = createHash("sha256").update(bytes).digest("hex");
      const geometry = await check(page);
      assert.deepEqual(errors, []);
      cases.push({
        viewport,
        scenario: "revanche e legado",
        flows: 15,
        commands,
        cardHash,
        geometry,
        errors,
      });
      await context.close();
    }
    // Compra e uso no alvo obrigatório, preços/estoque, doces/TMs e última revanche.
    {
      const { context, page, errors, read } = await open(
        fixture("market"),
        viewport,
      );
      await page
        .getByRole("button", { name: "Comprar itens", exact: true })
        .click();
      await page
        .getByRole("button", {
          name: "Comprar Leftovers por ₽ 1.200",
          exact: true,
        })
        .click();
      assert.equal(
        await page
          .getByRole("button", {
            name: "Comprar e equipar · ₽ 1.200",
            exact: true,
          })
          .isEnabled(),
        false,
      );
      await page
        .locator(".market-recipient")
        .filter({ hasText: "Garchomp" })
        .click();
      await page
        .getByRole("button", { name: "Cancelar compra", exact: true })
        .click();
      assert.equal((await read()).run.money, 5000);
      for (const [name, price, recipient] of [
        ["Leftovers", "1.200", "Garchomp"],
        ["Focus Sash", "700", "Charmeleon"],
        ["Choice Scarf", "1.000", "Blastoise"],
      ]) {
        await page
          .getByRole("button", {
            name: `Comprar ${name} por ₽ ${price}`,
            exact: true,
          })
          .click();
        await page
          .locator(".market-recipient")
          .filter({ hasText: recipient })
          .click();
        if (name === "Choice Scarf") {
          await shot(page, "compra", viewport);
          await check(page);
        }
        await page
          .getByRole("button", {
            name: `Comprar e equipar · ₽ ${price}`,
            exact: true,
          })
          .click();
        assert.equal(
          await page
            .getByRole("button", {
              name: `Comprar ${name} por ₽ ${price}`,
              exact: true,
            })
            .isEnabled(),
          false,
        );
      }
      let saved = await read();
      assert.equal(saved.run.money, 2100);
      assert.equal(saved.run.box[0].item, "focussash");
      await page
        .getByRole("button", {
          name: "Comprar Rare Candy por ₽ 700",
          exact: true,
        })
        .click();
      await page
        .locator(".market-recipient")
        .filter({ hasText: "Blastoise" })
        .click();
      await page
        .getByRole("button", { name: "Comprar e usar · ₽ 700", exact: true })
        .click();
      assert.equal((await read()).run.party[1].level, 46);
      assert.equal((await read()).run.party[1].item, "choicescarf");
      await page
        .getByRole("button", {
          name: "Comprar TM Protect por ₽ 600",
          exact: true,
        })
        .click();
      await page
        .locator(".market-recipient")
        .filter({ hasText: "Garchomp" })
        .click();
      await page.locator(".forget-move-button").first().click();
      await page
        .getByRole("button", { name: "Comprar e ensinar · ₽ 600", exact: true })
        .click();
      saved = await read();
      assert.equal(saved.run.money, 800);
      assert.ok(saved.run.party[0].moves.includes("protect"));
      await page.reload();
      assert.equal((await read()).run.money, 800);
      await page
        .getByRole("button", { name: "Ver revanche", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Enfrentar Nico", exact: true })
        .click();
      const commands = await fight(page, read);
      saved = await read();
      assert.equal(saved.run.phase, "market");
      assert.equal(saved.run.heldItems.choicescarf, 1);
      assert.equal(saved.run.money, 800);
      await page
        .getByRole("button", { name: "Seguir para a Elite 4", exact: true })
        .click();
      assert.equal((await read()).run.inLeague, true);
      await page.getByRole("button", { name: "Mochila", exact: true }).click();
      await page
        .getByRole("button", { name: "Gerenciar equipamentos", exact: true })
        .click();
      await check(page);
      await page.keyboard.press("Escape");
      const geometry = await check(page);
      assert.deepEqual(errors, []);
      cases.push({
        viewport,
        scenario: "Mercado e Liga",
        flows: 12,
        commands,
        geometry,
        errors,
      });
      await context.close();
    }
    // Memorial deriva de queda real, sem fixture de estatísticas inventadas.
    {
      const state = fixture();
      state.run.mode = "nuzlocke";
      state.run.party = [
        {
          ...makeMon("Rattata", 1, "fallen"),
          nickname: "Valente",
          item: "leftovers",
        },
        makeMon("Garchomp", 100, "survivor"),
      ];
      const { context, page, errors, read } = await open(state, viewport);
      await page
        .getByRole("button", { name: "Ver revanche", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Enfrentar Nico", exact: true })
        .click();
      const commands = await fight(page, read);
      assert.equal((await read()).run.heroRecords.fallen.status, "fallen");
      assert.equal((await read()).run.heldItems.leftovers, 2);
      await endJourney(page);
      await page
        .getByRole("button", { name: "Ver Hall da Fama", exact: true })
        .click();
      const hall = page.getByRole("dialog", {
        name: "Hall da Fama",
        exact: true,
      });
      await hall.locator(".journey-memorial summary").click();
      assert.match(
        await hall.locator(".journey-memorial").innerText(),
        /Valente/,
      );
      await hall.locator(".journey-memorial").scrollIntoViewIfNeeded();
      await shot(page, "memorial", viewport);
      const geometry = await check(page);
      assert.deepEqual(errors, []);
      cases.push({
        viewport,
        scenario: "memorial Nuzlocke",
        flows: 3,
        commands,
        geometry,
        errors,
      });
      await context.close();
    }
    // Focus Sash + Endeavor + Quick Attack: vitória real, sem ajustar HP.
    {
      const state = fixture();
      state.run.party = [
        {
          ...makeMon("Rattata", 10, "clutch"),
          nickname: "Pequeno gigante",
          item: "focussash",
          moves: ["endeavor", "quickattack"],
        },
      ];
      state.run.heldItems = {};
      state.run.phase = "battle";
      state.run.battle = {
        kind: "ambush",
        name: "Treino de superação",
        seed: [1, 2, 3, 4],
        player: structuredClone(state.run.party),
        enemy: [{ ...makeMon("Machamp", 70, "foe0"), moves: ["closecombat"] }],
        choices: [],
      };
      const { context, page, errors, read } = await open(state, viewport);
      const commands = await fight(page, read, ["move 1", "move 2"]);
      assert.equal((await read()).run.heroRecords.clutch.clutches, 1);
      assert.equal((await read()).run.party[0].item, "");
      await page.reload();
      assert.equal((await read()).run.heroRecords.clutch.clutches, 1);
      await endJourney(page);
      assert.equal((await read()).meta.history[0].hero.epithet, "Por um fio");
      await page
        .getByRole("button", { name: "Ver Hall da Fama", exact: true })
        .click();
      assert.match(
        await page
          .getByRole("dialog", { name: "Hall da Fama", exact: true })
          .locator(".journey-hero")
          .innerText(),
        /Por um fio/,
      );
      const geometry = await check(page);
      assert.deepEqual(errors, []);
      cases.push({
        viewport,
        scenario: "Focus Sash e feito de 1 HP",
        flows: 3,
        commands,
        geometry,
        errors,
      });
      await context.close();
    }
    console.log(`Conferido ${engine} ${viewport.width}x${viewport.height}`);
  }
  assert.equal(cases.length, viewports.length * 5);
  await writeFile(
    `${output}/browser-${engine}.json`,
    JSON.stringify(
      {
        url,
        engine,
        method:
          "Fixtures de partida pronta/campanha/Mercado; comandos e combates reais pela UI, visores emulados. Equipe nível 100 verifica integração, não dificuldade. Sem envio a apps sociais; download PNG real.",
        cases,
        totalFlows: cases.reduce((sum, item) => sum + item.flows, 0),
        passed: true,
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  await browser.close();
}
