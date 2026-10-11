/* Template de build. Não importa o jogo, não lê saves e não cacheia dados do usuário. */
const VERSION = __CACHE_VERSION__;
const FILES = __PRECACHE_FILES__;
const ENTRY = __ENTRY_FILE__;
const SHELL_PREFIX = "pokebobo-shell-";
const SHELL = SHELL_PREFIX + VERSION;
const MEDIA = "pokebobo-media-v1";
const MAX_MEDIA_BYTES = 60 * 1024 * 1024;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_MEDIA_FILES = 200;
const ROOT = new URL(self.registration.scope);
const urls = FILES.map((file) => new URL(file, ROOT).href);
const precached = new Set(urls);
let mediaQueue = Promise.resolve();

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL);
      try {
        await cache.addAll(
          urls.map((url) => new Request(url, { cache: "reload" })),
        );
        const html = await cache.match(new URL("index.html", ROOT));
        if (!(await html.text()).includes(ENTRY))
          throw Error(
            "Publicação em andamento; cache será preparado novamente.",
          );
      } catch (error) {
        await caches.delete(SHELL);
        throw error;
      }
    })(),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const old = (await caches.keys()).filter(
        (name) => name.startsWith(SHELL_PREFIX) && name !== SHELL,
      );
      // Conservar a versão anterior para outras abas ainda usando seus chunks.
      await Promise.all(old.slice(0, -1).map((name) => caches.delete(name)));
      await self.clients.claim();
    })(),
  );
});

async function rememberMedia(request, response) {
  if (!response?.ok || response.status !== 200) return;
  const buffer = await response.arrayBuffer();
  if (!buffer.byteLength || buffer.byteLength > MAX_FILE_BYTES) return;
  const cache = await caches.open(MEDIA);
  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.set("x-pokebobo-bytes", String(buffer.byteLength));
  headers.set("x-pokebobo-cached-at", String(Date.now()));
  // Substituir sem apagar antes: outra leitura pode chegar no mesmo instante.
  await cache.put(request, new Response(buffer, { status: 200, headers }));
  const keys = await cache.keys();
  let bytes = 0;
  const entries = await Promise.all(
    keys.map(async (key) => {
      const response = await cache.match(key);
      return {
        key,
        bytes: Number(response.headers.get("x-pokebobo-bytes")) || 0,
        at: Number(response.headers.get("x-pokebobo-cached-at")) || 0,
      };
    }),
  );
  entries.sort((a, b) => a.at - b.at);
  for (const entry of entries) bytes += entry.bytes;
  let count = keys.length;
  for (
    let i = 0;
    i < keys.length && (bytes > MAX_MEDIA_BYTES || count > MAX_MEDIA_FILES);
    i++
  ) {
    await cache.delete(entries[i].key);
    bytes -= entries[i].bytes;
    count--;
  }
}
async function rangeResponse(response, range) {
  if (!range || !response?.ok || response.status !== 200) return response;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) return response;
  const bytes = await response.arrayBuffer(),
    size = bytes.byteLength;
  const start = match[1]
    ? Number(match[1])
    : Math.max(0, size - Number(match[2]));
  const end =
    match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  if (start >= size || end < start)
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${size}` },
    });
  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  headers.set("Accept-Ranges", "bytes");
  return new Response(bytes.slice(start, end + 1), { status: 206, headers });
}

self.addEventListener("fetch", (event) => {
  const request = event.request,
    url = new URL(request.url);
  if (
    request.method !== "GET" ||
    url.origin !== ROOT.origin ||
    !url.pathname.startsWith(ROOT.pathname)
  )
    return;
  if (
    request.mode === "navigate" &&
    [ROOT.pathname, `${ROOT.pathname}index.html`].includes(url.pathname)
  ) {
    event.respondWith(
      caches
        .open(SHELL)
        .then(
          async (cache) =>
            (await cache.match(new URL("index.html", ROOT))) || fetch(request),
        ),
    );
    return;
  }
  if (precached.has(url.href)) {
    event.respondWith(
      caches
        .open(SHELL)
        .then(async (cache) => (await cache.match(request)) || fetch(request)),
    );
    return;
  }
  const relative = url.pathname.slice(ROOT.pathname.length);
  if (
    !/^(?:sprites|battle-sprites|field|covers|audio|battle-effects)\/.+\.(?:png|gif|webp|mp3|ogg|wav)$/i.test(
      relative,
    )
  )
    return;
  const headers = new Headers(request.headers);
  const range = headers.get("range");
  headers.delete("range");
  const fullRequest = new Request(request.url, {
    headers,
    credentials: "same-origin",
  });
  const response = (async () => {
    try {
      return { result: await fetch(fullRequest), cached: false };
    } catch (error) {
      const cached = await (await caches.open(MEDIA)).match(fullRequest);
      if (cached) return { result: cached, cached: true };
      throw error;
    }
  })();
  event.waitUntil(
    response
      .then(({ result, cached }) => {
        if (!result.ok || cached) return;
        const copy = result.clone();
        mediaQueue = mediaQueue
          .catch(() => {})
          .then(() => rememberMedia(fullRequest, copy));
        return mediaQueue;
      })
      .catch(() => {}),
  );
  event.respondWith(
    response.then(({ result }) => rangeResponse(result, range)),
  );
});
