import { readFile, writeFile, readdir } from "node:fs/promises";
import { resolve, basename } from "node:path";
const dist = resolve("dist");
let html = await readFile(dist + "/index.html", "utf8");
const script = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/)[1];
const sheet = html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/)[1];
let css = await readFile(resolve(dist, sheet), "utf8");
const urls = [
  ...new Set(
    [...css.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1].replace(/["']/g, "")),
  ),
];
for (const url of urls) {
  if (url.startsWith("data:")) continue;
  const file = resolve(dist, "assets", url);
  const buffer = await readFile(file);
  css = css
    .split(url)
    .join(
      "data:font/" +
        (url.endsWith(".ttf") ? "ttf" : "woff2") +
        ";base64," +
        buffer.toString("base64"),
    );
}
let js = await readFile(resolve(dist, script), "utf8");
const sprites = {};
const covers = {};
for (const file of await readdir("public/covers")) {
  if (file.endsWith(".png"))
    covers[file] =
      "data:image/png;base64," +
      (await readFile("public/covers/" + file)).toString("base64");
}
for (const file of await readdir("public/sprites"))
  sprites[file.replace(".png", "")] =
    "data:image/png;base64," +
    (await readFile("public/sprites/" + file)).toString("base64");
const favicon =
  "data:image/svg+xml;base64," +
  (await readFile("public/favicon.svg")).toString("base64");
html = html
  .replace(
    /<script[^>]+src="[^"]+"[^>]*><\/script>/,
    () =>
      `<script>window.POKEBOBO_SPRITES=${JSON.stringify(sprites)};window.POKEBOBO_COVERS=${JSON.stringify(covers)}</script><script type="module">${js.replace(/<\/script/gi, "<\\/script")}</script>`,
  )
  .replace(/<link[^>]+href="[^"]+\.css"[^>]*>/, () => `<style>${css}</style>`)
  .replace("./favicon.svg", favicon);
await writeFile("../Pokebobo.html", html);
console.log(
  "Pokebobo.html criado: " +
    (Buffer.byteLength(html) / 1048576).toFixed(1) +
    " MB. Jogo completo sem servidor e sem internet.",
);
