import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
const template = readFileSync(
  new URL("../scripts/serviceWorker.js", import.meta.url),
  "utf8",
);
function worker({ broken = false } = {}) {
  const mutations = { puts: 0, deletes: 0 };
  const handlers = new Map(),
    stores = new Map(),
    scope = "https://example.test/pokebobo/";
  const caches = {
    open: async (name) => {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name),
        key = (r) => (typeof r === "string" ? r : r.href || r.url);
      return {
        match: async (r) => store.get(key(r))?.clone(),
        delete: async (r) => {
          mutations.deletes++;
          return store.delete(key(r));
        },
        keys: async () => [...store.keys()].map((url) => new Request(url)),
        put: async (r, value) => {
          mutations.puts++;
          store.set(key(r), value.clone());
        },
        addAll: async (requests) => {
          for (const r of requests) {
            const response = await network(r);
            if (!response.ok) throw Error("bad asset");
            store.set(key(r), response.clone());
          }
        },
      };
    },
    keys: async () => [...stores.keys()],
    delete: async (n) => stores.delete(n),
  };
  let offline = false,
    claimed = false,
    activated = false;
  async function network(request) {
    if (offline) throw Error("offline");
    const url = typeof request === "string" ? request : request.url;
    if (url.endsWith("index.html"))
      return new Response('<script src="assets/main.js"></script>', {
        headers: { "Content-Type": "text/html" },
      });
    if (broken && url.endsWith("main.js"))
      return new Response("missing", { status: 404 });
    return new Response(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), {
      headers: {
        "Content-Type": url.endsWith("mp3") ? "audio/mpeg" : "image/png",
      },
    });
  }
  const self = {
    registration: { scope },
    clients: {
      claim: async () => {
        claimed = true;
      },
    },
    skipWaiting: () => {
      activated = true;
    },
    addEventListener: (type, fn) => handlers.set(type, fn),
  };
  vm.runInNewContext(
    template
      .replace("__CACHE_VERSION__", '"test"')
      .replace("__PRECACHE_FILES__", '["index.html","assets/main.js"]')
      .replace("__ENTRY_FILE__", '"assets/main.js"'),
    { self, caches, fetch: network, Request, Response, Headers, URL, Promise },
  );
  async function send(type, request) {
    const waits = [];
    let reply;
    handlers.get(type)({
      request,
      data: request,
      ports: [],
      waitUntil: (p) => waits.push(p),
      respondWith: (p) => (reply = p),
    });
    const result = reply && (await reply);
    await Promise.all(waits);
    return result;
  }
  return {
    send,
    stores,
    mutations,
    caches,
    scope,
    setOffline: (value) => {
      offline = value;
    },
    claimed: () => claimed,
    activated: () => activated,
  };
}
test("shell offline preserva caminhos/convites e não força atualização durante a partida", async () => {
  const w = worker();
  await w.send("install");
  await w.send("activate");
  assert.equal(w.claimed(), true);
  assert.equal(w.activated(), false);
  w.setOffline(true);
  const response = await w.send("fetch", {
    url: w.scope + "?region=PB1",
    method: "GET",
    mode: "navigate",
    headers: new Headers(),
  });
  assert.match(await response.text(), /assets\/main.js/);
  const script = await w.send("fetch", new Request(w.scope + "assets/main.js"));
  assert.equal(script.status, 200);
});
test("mídia em cache atende Range real offline; limites, 404 e URLs externas são respeitados", async () => {
  const w = worker();
  await w.send("install");
  await w.send("fetch", new Request(w.scope + "audio/track.mp3"));
  w.setOffline(true);
  const segment = await w.send(
    "fetch",
    new Request(w.scope + "audio/track.mp3", {
      headers: { Range: "bytes=2-5" },
    }),
  );
  assert.equal(segment.status, 206);
  assert.equal(segment.headers.get("Content-Range"), "bytes 2-5/10");
  assert.deepEqual(
    [...new Uint8Array(await segment.arrayBuffer())],
    [2, 3, 4, 5],
  );
  const suffix = await w.send(
    "fetch",
    new Request(w.scope + "audio/track.mp3", {
      headers: { Range: "bytes=-3" },
    }),
  );
  assert.deepEqual([...new Uint8Array(await suffix.arrayBuffer())], [7, 8, 9]);
  const mutations = { ...w.mutations };
  const readers = await Promise.all(
    Array.from({ length: 12 }, () =>
      w.send(
        "fetch",
        new Request(w.scope + "audio/track.mp3", {
          headers: { Range: "bytes=0-" },
        }),
      ),
    ),
  );
  assert.ok(readers.every((response) => response.status === 206));
  assert.deepEqual(
    w.mutations,
    mutations,
    "ler offline não apaga ou regrava a entrada compartilhada",
  );
  assert.equal(
    (
      await w.send(
        "fetch",
        new Request(w.scope + "audio/track.mp3", {
          headers: { Range: "bytes=40-" },
        }),
      )
    ).status,
    416,
  );
  assert.equal(
    await w.send("fetch", new Request("https://elsewhere.test/sprites/1.png")),
    undefined,
  );
  w.setOffline(false);
  for (let i = 0; i < 205; i++)
    await w.send("fetch", new Request(w.scope + `sprites/${i}.png`));
  assert.ok(w.stores.get("pokebobo-media-v1").size <= 200);
});
test("instalação incompleta não remove o shell anterior e ativação conserva uma versão", async () => {
  const w = worker({ broken: true });
  w.stores.set("pokebobo-shell-previous", new Map());
  await assert.rejects(w.send("install"), /bad asset/);
  assert.ok(w.stores.has("pokebobo-shell-previous"));
  assert.equal(w.stores.has("pokebobo-shell-test"), false);
  const good = worker();
  for (const name of [
    "pokebobo-shell-old1",
    "other-app",
    "pokebobo-shell-old2",
  ])
    good.stores.set(name, new Map());
  await good.send("install");
  await good.send("activate");
  assert.equal(good.stores.has("pokebobo-shell-old1"), false);
  assert.ok(good.stores.has("pokebobo-shell-old2"));
  assert.ok(good.stores.has("other-app"));
});
