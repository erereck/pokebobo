import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const source =
  readFileSync(
    new URL("../src/features/offline/offlineClient.js", import.meta.url),
    "utf8",
  )
    .replaceAll("import.meta.env.PROD", "true")
    .replaceAll("import.meta.env.BASE_URL", '"/pokebobo/"')
    .replace(/export (const|function|async function)/g, "$1") +
  "\nglobalThis.client = {startOffline, offlineSnapshot};";

function environment({
  existing = false,
  networkFails = false,
  controlled = false,
} = {}) {
  const events = new Map(),
    timers = [],
    fetches = [];
  const addEventListener = (type, listener) => {
    const list = events.get(type) || [];
    list.push(listener);
    events.set(type, list);
  };
  const registration = {
    active: {},
    waiting: null,
    installing: null,
    addEventListener,
  };
  const serviceWorker = {
    controller: controlled ? {} : null,
    addEventListener,
    getRegistration: async () => (existing ? registration : undefined),
    register: async () => {
      if (networkFails) throw Error("network");
      return registration;
    },
    ready: Promise.resolve(registration),
  };
  const context = vm.createContext({
    navigator: { onLine: true, serviceWorker },
    window: {
      isSecureContext: true,
      matchMedia: () => ({ matches: false }),
      addEventListener,
    },
    document: {
      readyState: "complete",
      images: [
        { currentSrc: "https://game.test/pokebobo/sprites/1.png" },
        { currentSrc: "https://elsewhere.test/image.png" },
      ],
    },
    location: { origin: "https://game.test" },
    fetch: async (url) => {
      fetches.push(url);
    },
    setTimeout: (callback) => {
      timers.push(callback);
    },
  });
  vm.runInContext(source, context);
  const emit = (type) => {
    for (const listener of events.get(type) || []) listener();
  };
  return { client: context.client, timers, fetches, serviceWorker, emit };
}

test("primeiras imagens só são aquecidas depois de a página ser controlada, sem pedidos externos", async () => {
  const env = environment();
  env.client.startOffline();
  const pending = env.timers.shift()();
  for (let i = 0; i < 8; i++) await Promise.resolve();
  assert.deepEqual(env.fetches, []);
  env.serviceWorker.controller = {};
  env.emit("controllerchange");
  await pending;
  assert.deepEqual(env.fetches, ["https://game.test/pokebobo/sprites/1.png"]);
  assert.equal(env.client.offlineSnapshot().ready, true);
});

test("cópia ativa continua pronta quando existe conexão aparente mas atualizar o registro falha", async () => {
  const env = environment({
    existing: true,
    controlled: true,
    networkFails: true,
  });
  env.client.startOffline();
  await env.timers.shift()();
  assert.equal(env.client.offlineSnapshot().ready, true);
  assert.equal(env.client.offlineSnapshot().error, "");
});

test("primeiro preparo com rede indisponível informa falha sem aquecer arquivos nem travar a página", async () => {
  const env = environment({ networkFails: true });
  env.client.startOffline();
  await env.timers.shift()();
  assert.equal(env.client.offlineSnapshot().ready, false);
  assert.equal(env.client.offlineSnapshot().preparing, false);
  assert.match(env.client.offlineSnapshot().error, /continuar jogando online/);
  assert.deepEqual(env.fetches, []);
});
