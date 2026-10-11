import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import packageInfo from "../package.json" with { type: "json" };

export function offlinePlugin() {
  return {
    name: "pokebobo-offline",
    apply: "build",
    async generateBundle(_options, bundle) {
      const assets = Object.values(bundle)
        .filter((file) => /\.(?:js|css|woff2|ttf)$/.test(file.fileName))
        .map((file) => file.fileName)
        .sort();
      const entry = Object.values(bundle).find(
        (file) => file.type === "chunk" && file.isEntry,
      )?.fileName;
      if (!entry) throw Error("Build sem entrada para o cache offline.");
      const local = [];
      for (const folder of ["field", "battle-effects"])
        for (const file of await readdir(
          new URL(`../public/${folder}/`, import.meta.url),
        ))
          if (/\.(?:png|woff2|ttf)$/.test(file))
            local.push(`${folder}/${file}`);
      const files = [
        "index.html",
        ...assets,
        "favicon.svg",
        "manifest.webmanifest",
        "icons/pokebobo-192.png",
        "icons/pokebobo-512.png",
        ...local.sort(),
      ];
      const template = await readFile(
        new URL("./serviceWorker.js", import.meta.url),
        "utf8",
      );
      const hash = createHash("sha256").update(template);
      for (const file of files) {
        hash.update(file);
        const bundled = bundle[file];
        if (bundled)
          hash.update(bundled.type === "chunk" ? bundled.code : bundled.source);
        else if (file !== "index.html")
          hash.update(
            await readFile(new URL(`../public/${file}`, import.meta.url)),
          );
      }
      const stamp = hash.digest("hex").slice(0, 12);
      this.emitFile({
        type: "asset",
        fileName: "sw.js",
        source: template
          .replace(
            "__CACHE_VERSION__",
            JSON.stringify(`${packageInfo.version}-${stamp}`),
          )
          .replace("__PRECACHE_FILES__", JSON.stringify(files))
          .replace("__ENTRY_FILE__", JSON.stringify(entry)),
      });
    },
  };
}
