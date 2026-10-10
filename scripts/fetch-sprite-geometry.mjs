// Cache de pesquisa separado dos assets do build; nunca executa código remoto.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { createHash } from "node:crypto";
import sources from "../docs/balance/sprite-geometry-sources.json" with { type: "json" };
const output = process.argv[process.argv.indexOf("--out") + 1];
if (!process.argv.includes("--out") || !output)
  throw Error("Informe --out /caminho/do/cache");
const root = resolve(output);
let next = 0;
await Promise.all(
  Array.from({ length: 3 }, async () => {
    while (next < sources.length) {
      const record = sources[next++];
      if (
        !/^(ani|ani-back|ani-shiny|ani-back-shiny)\/[a-z0-9-]+\.gif$/.test(
          record.file,
        )
      )
        throw Error("Caminho inválido");
      const url = new URL(record.url);
      if (
        url.hostname !== "play.pokemonshowdown.com" ||
        url.protocol !== "https:" ||
        url.pathname !== `/sprites/${record.file}`
      )
        throw Error("Fonte inválida");
      const target = resolve(root, record.file);
      let data;
      try {
        data = await readFile(target);
      } catch {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(30000),
        });
        if (!response.ok) throw Error(response.status);
        data = Buffer.from(await response.arrayBuffer());
        await new Promise((r) => setTimeout(r, 80));
      }
      if (
        data.length !== record.bytes ||
        createHash("sha256").update(data).digest("hex") !== record.sha256
      )
        throw Error(`Fonte mudou: ${record.file}`);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, data);
    }
  }),
);
console.log(`${sources.length} fontes 3D conferidas no cache externo.`);
