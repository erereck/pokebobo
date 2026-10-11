import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export async function checkCompiledLearnsets(root = path.resolve("src")) {
  const failures = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (/\.jsx?$/.test(file)) {
        const source = await readFile(file, "utf8");
        if (
          /\bTeamValidator\b|\.getLearnset(?:Data)?\s*\(|\.(?:learnsets|Learnsets)\b/.test(
            source,
          )
        )
          failures.push(path.relative(root, file));
      }
    }
  }
  await walk(root);
  if (failures.length)
    throw Error(
      `O build leve não permite validar learnsets em runtime: ${failures.join(", ")}. Use o catálogo compilado ou restaure as tabelas no browserSimulatorPlugin.`,
    );
}
