// Importação por manifesto congelado; --check confere só os arquivos locais.
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import manifest from "../public/battle-sprites/manifest.json" with { type: "json" };

const root = new URL("../public/battle-sprites/", import.meta.url);
const checkOnly = process.argv.includes("--check");
let count = 0,
  total = 0;
for (const sprite of Object.values(manifest)) {
  for (const side of ["front", "back", "shinyFront", "shinyBack"]) {
    const entry = sprite[side];
    if (!/^(front|back)(-shiny)?\/[a-z0-9-]+\.(gif|png)$/.test(entry.file))
      throw Error("Nome inválido no manifesto");
    const url = new URL(entry.sourceUrl);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "play.pokemonshowdown.com" ||
      !/^\/sprites\/gen5(?:ani)?(?:-back)?(?:-shiny)?\//.test(url.pathname)
    )
      throw Error("Fonte fora do manifesto permitido");
    const target = new URL(entry.file, root);
    let bytes;
    try {
      bytes = await readFile(target);
    } catch (error) {
      if (checkOnly) throw error;
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw Error(`Falha ${response.status}: ${entry.file}`);
      bytes = Buffer.from(await response.arrayBuffer());
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (
      bytes.length !== entry.bytes ||
      createHash("sha256").update(bytes).digest("hex") !== entry.sha256
    )
      throw Error(
        `Arquivo/fonte divergiu; conferir antes de substituir: ${entry.file}`,
      );
    if (!checkOnly) {
      await mkdir(new URL(entry.file.split("/")[0] + "/", root), { recursive: true });
      await writeFile(target, bytes);
    }
    total += bytes.length;
    count++;
  }
}
console.log(
  `${count} sprites conferidos, ${total} bytes; originais sem alteração.`,
);
